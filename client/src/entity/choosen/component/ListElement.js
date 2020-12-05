import React, { useEffect, useState } from 'react';
import { Button, Grid, makeStyles, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { newError } from '../../../redux/actions/error';
import { searchElement, setElement as setElementAction } from '../actions';

const useStyles = makeStyles(() => ({
    button: {
        width: '100%'
    }
}))

export default function ListElement({ url }) {
    const classes = useStyles()
    const dispatch = useDispatch();
    const [element, setElement] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await searchElement(url)
                setElement(data)
            } catch (error) {
                dispatch(newError(error.message))
            } finally {
                setLoading(false)
            }
        })()
    }, [])


    if (loading)
        return null

    const handleClick = () => {
        dispatch(setElementAction(element))
    } 

    return (
        <Grid item xs={12}>
            <Paper>
                <Button className={classes.button} variant="outlined" color="primary" onClick={handleClick}>
                    {element.name || element.title}
                </Button>
            </Paper>
        </Grid>
    )
}