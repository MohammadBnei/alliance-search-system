import {
    SEARCH,
    SET_SEARCH_OPTIONS
} from '../actionTypes'

export default function (state = {
    term: '',
    options: {}
}, { type, payload }) {
    switch (type) {
        case SEARCH:
            return { term: payload.term, ...state }
        case SET_SEARCH_OPTIONS:
            return { options: payload.options}
        default:
            return state
    }
}
