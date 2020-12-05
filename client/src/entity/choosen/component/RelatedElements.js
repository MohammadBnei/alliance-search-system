import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Element from './Element';
import ListElement from './ListElement';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        textTransform: 'capitalize'
    },
}));

export default function RelatedElements({ elements }) {
    const classes = useStyles();
    return Object.entries(elements).map(([key, val]) => (
        <Accordion key={key}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.heading} >{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={1}>
                    {val.map(v => (
                        <ListElement url={v} key={v}/>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    ))
}