import React, { useEffect, useState, useCallback } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Grid, makeStyles, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListElement from './component/ListElement'
import { EVENTS_API_URI, extractParamsFromUrl } from '../../conf'
import { useSelector } from 'react-redux'
import is from 'is_js'

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        textTransform: 'capitalize'
    }
}))

let sse

export default function RelatedElements () {
    const classes = useStyles()
    const choosenElement = useSelector(({ choosen }) => choosen.element)
    const [expanded, setExpanded] = useState(false)
    const [relatedElements, setRelatedElements] = useState({})
    const relatedSSEHandler = useCallback(() => sseHandler, [])
    
    useEffect(() => {
        setRelatedElements(Object.keys(choosenElement).reduce((acc, cur) => {
            if (is.array(choosenElement[cur])) {
                acc[cur] = choosenElement[cur].filter(c => is.url(c))
            }
            return acc
        }, {}))
        sse = new EventSource(`${EVENTS_API_URI}related?url=${choosenElement.url}`)

        sse.onmessage = relatedSSEHandler

        return () => sse.close()
    }, [choosenElement])

    const sseHandler = (message) => {
        try {
            const data = JSON.parse(message.data)
            if (data.end === true) {
                console.log('Stream Ended')
                sse.close()
                return
            }

            setRelatedElements(el => {
                let [resource] = extractParamsFromUrl(data.url)
                const [choosenResource] = extractParamsFromUrl(choosenElement.url)
                if (resource === 'people' && choosenResource === 'films') {
                    resource = 'characters'
                }
                if (resource === 'people' && choosenResource === 'planets') {
                    resource = 'residents'
                }
                if (el[resource]) {
                    const elementIndex = el[resource].findIndex(url => url === data.url)
                    elementIndex !== -1 && el[resource].splice(elementIndex, 1, data)
                    return { ...el }
                }

                return el
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    return Object.entries(relatedElements).map(([key, val], i) =>
        <Accordion key={i} expanded={expanded === key} onChange={handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={'panel1a-header' + key}
            >
                <Typography className={classes.heading} >{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={1}>
                    {val.map(v => (
                        <ListElement val={v} key={is.url(v) ? v : v.url} />
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}
