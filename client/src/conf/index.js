import axios from 'axios'
import { END_LOADING, ERROR, LOADING } from '../redux/actionTypes';
import store from '../redux/store';

export const API_URI = process.env.API_URI || 'http://server.localhost/api/'
export const AUTH_URL = process.env.AUTH_URL || 'http://server.localhost/auth/'

axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.baseURL = API_URI;

axios.interceptors.request.use((req) => {
    store.dispatch({type: LOADING, payload: `${req.method} ${req.url}`})

    return req
})

axios.interceptors.response.use((res) => {
    store.dispatch({type: END_LOADING, payload: res.data.json})

    return res
}, err => {
    store.dispatch({type: END_LOADING})

    store.dispatch({type: ERROR, payload: `${err.response.status} ${err.response.message}`})
})

export default axios