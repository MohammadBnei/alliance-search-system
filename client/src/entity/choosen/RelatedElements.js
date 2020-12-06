import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Grid, makeStyles, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListElement from './component/ListElement';
import { extractParamsFromUrl, SWAPI_API_URI } from '../../conf';
import { useSelector } from 'react-redux';
import is from 'is_js';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        textTransform: 'capitalize'
    },
}));

export default function RelatedElements() {
    const classes = useStyles();
    const choosenElement = useSelector(({ choosen }) => choosen.element);
    const [relatedElements, setRelatedElements] = useState({});

    useEffect(() => {
        setRelatedElements(Object.keys(choosenElement).reduce((acc, cur) => {
            if (is.array(choosenElement[cur])) {
                acc[cur] = choosenElement[cur].filter(c => is.url(c))
            }
            return acc
        }, {}))
        const sse = new EventSource(`${SWAPI_API_URI}related?url=${choosenElement.url}`)

        sse.onmessage = sseHandler

        return () => sse.close()
    }, [choosenElement])

    const sseHandler = (message) => {
        try {
            const data = JSON.parse(message.data)
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
                    el[resource].splice(elementIndex, 1, data)
                }

                return { ...el }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return Object.entries(relatedElements).map(([key, val], i) =>
        <Accordion key={i}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={"panel1a-header" + key}
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

