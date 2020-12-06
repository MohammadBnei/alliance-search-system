const { signUp, jwtSignIn, signIn } = require('../controller/auth')
const { verifyJWT } = require('../jwt')

module.exports = app => {

    const router = require('express').Router()

    router.post('/signup', signUp)

    router.get('/signin', verifyJWT, jwtSignIn)

    router.post('/signin', signIn)

    app.use('/', router)
}
