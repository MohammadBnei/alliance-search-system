const { generateToken, verifyJWT } = require('./tokenHandle')

module.exports = app => {

    const router = require('express').Router()

    /**
     * Single route to generate a token for marchand credentials
     */
    router.get('/generate', verifyJWT, (req, res) => res.send({ success: true, token: generateToken(req.marchandId) }))

    app.use('/token', router)
}
