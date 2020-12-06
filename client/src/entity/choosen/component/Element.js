import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { extractParamsFromUrl } from '../../../conf';
import { newError } from '../../../redux/actions/error';
import { searchElement } from '../actions';
import Film from './Film';
import People from './People';
import Planet from './Planet';

export default function Element({ element }) {
    const [type, setType] = useState(null);
    const [currentElement, setCurrentElement] = useState(element);

    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentElement(element)
        if (is.url(element)) {
            (async () => {
                try {
                    setCurrentElement(await searchElement(element))
                    setType(extractParamsFromUrl(element)[0])
                } catch (error) {
                    dispatch(newError(error.message))
                }
            })()
        } else {
            const { url } = element
            const [resource] = extractParamsFromUrl(url)
            setType(resource)
        }
    }, [element])


    return (
        <>
            {type === 'films' && <Film film={currentElement} />}
            {type === 'people' && <People people={currentElement} />}
            {type === 'planets' && <Planet planet={currentElement} />}
        </>
    )

}