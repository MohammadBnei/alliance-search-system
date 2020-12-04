import React from 'react';
import { Container, Grid, TextField } from '@material-ui/core';

export default function SearchBar() {
    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} >
                    <TextField id="outlined-basic" label="Search" variant="outlined" />
                </Grid>
            </Grid>
        </Container>
    )
}