import { Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { setElementFromRoute } from './actions';
import Film from './component/Film';
import People from './component/People';

export default function Choosen() {
    const { element } = useSelector(({ choosen }) => choosen)
    const [type, setType] = useState(null);
    const search = useLocation().search
    const dispatch = useDispatch();

    useEffect(() => {
        const { resource, id } = getQueryParams(search)
        if (resource && id)
            dispatch(setElementFromRoute({ resource, id }))
    }, [])

    useEffect(() => {
        if (!element)
            return

        const { url } = element
        const [resource, _] = url.split('/').filter(e => e).slice(-2)

        setType(resource)
    }, [element])

    if (!element)
        return (<Typography component="h1" variant="h6" color="inherit" noWrap>
            No element selected ! Search one
        </Typography>)

    return (
        <Container>
            <Grid container spacing={3}>
                {type === 'films' && <Film film={element} />}
                {type === 'people' && <People people={element} />}
            </Grid>
        </Container>
    )

}

const getQueryParams = (search) => {
    const resource = new URLSearchParams(search).get('resource');
    const id = new URLSearchParams(search).get('id');

    return { resource, id }
}