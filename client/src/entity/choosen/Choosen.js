import { Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import is from 'is_js';
import { setElementFromRoute } from './actions';
import Element from './component/Element';
import RelatedElements from './RelatedElements';

export default function Choosen() {
    const { element, authenticated } = useSelector(({ choosen, auth }) => ({ element: choosen.element, authenticated: auth.authenticated }))
    const search = useLocation().search
    const dispatch = useDispatch();

    useEffect(() => {
        const { resource, id } = getQueryParams(search)
        if (resource && id)
            dispatch(setElementFromRoute({ resource, id }))
    }, [])

    if (!element)
        return (<Typography component="h1" variant="h6" color="inherit" noWrap>
            No element selected ! Search one
        </Typography>)

    return (
        <Container>
            <Grid container spacing={3}>
                <Element element={element} />
                {authenticated && (
                    <Grid item xs={12}>
                        <RelatedElements />
                    </Grid>
                )}
            </Grid>
        </Container>
    )

}

const getQueryParams = (search) => {
    const resource = new URLSearchParams(search).get('resource');
    const id = new URLSearchParams(search).get('id');

    return { resource, id }
}