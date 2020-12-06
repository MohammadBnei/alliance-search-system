// const { verifyJWT, getTokenPaymentInfo, getMarchandOptions } = require('../token/tokenHandle')
const { searchSwapi, getElementByUrl, getElementById, getResource, getRelatedElements } = require('./controller')

module.exports = app => {

    const router = require('express').Router()

    router.get('/search', searchSwapi)
    router.get('/element', getElementByUrl)
    router.get('/element/:id', getElementById)
    router.get('/related', getRelatedElements)
    router.get('/resource', getResource)

    app.use('/', router)
}
