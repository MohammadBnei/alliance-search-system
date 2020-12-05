import { routerActions } from 'connected-react-router'
import axios from '../../conf'
import {
    ERROR,
    SET_CHOOSEN_ELEMENT,
    SET_OTHER_ELEMENT,
    REMOVE_OTHER_ELEMENT
} from '../../redux/actionTypes'

export function setElement(url) {
    return (dispatch) => {
        searchElement(url)
            .then(res => {
                dispatch({ type: SET_CHOOSEN_ELEMENT, payload: res.data })
                const [resource, id] = url.split('/').filter(e => e).slice(-2)
                dispatch(routerActions.push({
                    pathname: '/',
                    search: `?resource=${resource}&id=${id}`
                }))
            })
            .catch(error => {
                console.log(error)
                dispatch({ type: ERROR, payload: error.response })
            })
    }
}

export function setElementFromRoute({ resource, id }) {
    return (dispatch) => {
        axios
            .get('/element/' + id, { params: { resource } })
            .then(res => {
                dispatch({ type: SET_CHOOSEN_ELEMENT, payload: res.data })
            })
            .catch(error => {
                console.log(error)
                dispatch({ type: ERROR, payload: error.response })
            })
    }
}

export function setOtherElement(url) {
    return (dispatch) => {
        searchElement(url)
            .then(res => {
                dispatch({ type: SET_OTHER_ELEMENT, payload: res.data })
            })
            .catch(error => {
                console.log(error)
                dispatch({ type: ERROR, payload: error.response })
            })
    }
}

export function removeOtherElement(url) {
    return (dispatch) => {
        dispatch({ type: REMOVE_OTHER_ELEMENT, payload: url })
    }
}



const searchElement = (url) => axios
    .get('/element', { params: { url } }) 
