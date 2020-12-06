const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const is = require('is_js')
const { getToken } = require('../token')
let { RESOURCE_LIST, SWAPI_URL } = require('../config')


module.exports = {
    searchSwapi: async (req, res) => {
        try {
            const { resource, term: searchTerm, wookie = false } = req.query

            if (RESOURCE_LIST.indexOf(resource) === -1)
                throw new Error(resource ? `${resource} not in avalaible resource : ${RESOURCE_LIST.join(', ')}` : 'No resource specified. You must provide one.')

            if (!searchTerm) throw new Error('You must specify a search term')

            const searchParams = new URLSearchParams({
                search: searchTerm,
            })

            if (wookie)
                searchParams.append('format', 'wookie')

            const url = new URL(`${SWAPI_URL}${resource}/`)
            url.search = searchParams.toString()

            const result = await (await fetch(url)).json()

            // eventEmitter.emit(TRANSACTION_INITIATED, { marchandId: req.marchandId, amount, devise })

            while (result.next !== null) {
                const { results, next } = await (await fetch(result.next)).json()

                result.next = next
                result.results = [...result.results, ...results]
            }

            res.send(result)
        } catch (error) {
            console.log(error)
            res.status(400).send({
                message: error.message || 'Something went wrong with the search'
            })
        }
    },
    getElementByUrl: async (req, res) => {
        try {
            let { url, wookie = false } = req.query

            if (!url) throw new Error('You must specify a correct url')

            const searchParams = new URLSearchParams()

            if (wookie)
                searchParams.set('format', 'wookie')

            url = new URL(url)
            url.search = searchParams.toString()


            const result = await (await fetch(url)).json()

            // eventEmitter.emit(TRANSACTION_INITIATED, { marchandId: req.marchandId, amount, devise })

            res.send(result)
        } catch (error) {
            console.log(error)
            res.status(400).send({
                message: error.message || 'Something went wrong with the search'
            })
        }
    },

    getRelatedElements: async (req, res) => {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        }

        res.writeHead(200, headers)
        res.write('connected\n\n')

        let { url, wookie = false } = req.query

        const searchParams = new URLSearchParams()

        if (wookie)
            searchParams.set('format', 'wookie')

        url.search = searchParams.toString()


        const result = await (await fetch(url)).json()

        const relatedElements = Object.keys(result).reduce((acc, cur) => {
            if (is.array(result[cur])) {
                acc.push(result[cur].filter(c => is.url(c)))
            }
            return acc
        }, []).flat()
        
        Promise.all(relatedElements.map(async elementUrl => {
            try {
                const data = await (await fetch(elementUrl)).json()
                res.write(`data: ${JSON.stringify(data)}\n\n`)
            } catch (error) {
                console.log(error, 'Wesh ?')
            }
        })).then(() => {  
            res.write(`data: ${JSON.stringify({end: true})}\n\n`)
        })
    },

    getElementById: async (req, res) => {
        try {
            const { resource, wookie } = req.query
            const { id } = req.params

            if (!id) throw new Error('You must specify an id')

            if (RESOURCE_LIST.indexOf(resource) === -1)
                throw new Error(resource ? `${resource} not in avalaible resource : ${RESOURCE_LIST.join(', ')}` : 'No resource specified. You must provide one.')

            const searchParams = new URLSearchParams()

            if (wookie)
                searchParams.set('format', 'wookie')

            const url = new URL(`${SWAPI_URL}${resource}/${id}`)

            url.search = searchParams.toString()


            const result = await (await fetch(url)).json()

            // eventEmitter.emit(TRANSACTION_INITIATED, { marchandId: req.marchandId, amount, devise })

            res.send(result)
        } catch (error) {
            console.log(error)
            res.status(400).send({
                message: error.message || 'Something went wrong with the search'
            })
        }
    },

    getResource: async (req, res) => {
        const resource = await (await fetch(SWAPI_URL)).json()
        RESOURCE_LIST = Object.keys(resource)
        res.send({ resourceList: RESOURCE_LIST })
    }
}
