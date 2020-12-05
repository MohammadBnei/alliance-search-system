import { Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import is from 'is_js';
import { setElementFromRoute } from './actions';
import Element from './component/Element';
import RelatedElements from './component/RelatedElements';

export default function Choosen() {
    const { element } = useSelector(({ choosen }) => choosen)
    const [relatedElements, setRelatedElements] = useState(null);
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

        setRelatedElements(Object.keys(element).reduce((acc, cur) => {
            if (is.array(element[cur])) {
                acc[cur] = element[cur].filter(c => is.url(c))
            }
            return acc
        }, {}))
    }, [element])

    if (!element)
        return (<Typography component="h1" variant="h6" color="inherit" noWrap>
            No element selected ! Search one
        </Typography>)

    return (
        <Container>
            <Grid container spacing={3}>
                <Element element={element} />
                {relatedElements && (
                    <Grid item xs={12}>
                        <RelatedElements elements={relatedElements} />
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