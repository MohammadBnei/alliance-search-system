const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

module.exports = {
    /**
     * Generates a token with the marchandId for credentials purpose
     */
    generateToken: marchandId => {
        return jwt.sign({ marchandId }, process.env.JWT_SECRET || 'prp-esgi')
    },

    /**
     * Middleware
     * Verifies the token passed as a header or as a parameter (for payment routes)
     * Extract the marchandId from the token
     * Adds it to the req object
     */
    verifyJWT: async (req, res, next) => {
        try {
            let token = req.headers['authorization'] || req.params.token

            if (!token) throw new Error('No token provided')

            token = token.replace('Bearer ', '')

            const { marchandId } = jwt.verify(token, process.env.JWT_SECRET || 'prp-esgi')

            if (!marchandId) throw new Error('There was an error with the marchand account')

            req.marchandId = marchandId

            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: error.message || 'Something went wrong with your token',
            })
        }
    },

    /**
     * Middleware
     * Extracts payment details from the token
     * Adds it to the req object
     */
    getTokenPaymentInfo: async (req, res, next) => {
        try {
            let token = req.params.token

            if (!token) throw new Error('No token provided')

            const paymentDetails = jwt.verify(token, process.env.JWT_SECRET || 'prp-esgi')

            if (!paymentDetails) throw new Error('Cannot verify token')

            req.paymentDetails = paymentDetails
            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: error.message || 'Something went wrong with your token',
            })
        }
    },

    /**
     * Middleware
     * Fetches the marchand's option from the api-marchand
     * Adds it to the req object
     */
    getMarchandOptions: async (req, res, next) => {
        try {
            let token = req.headers['authorization']

            if (!token) throw new Error('No token provided')

            const result = await fetch(`${process.env.BASE_URL || 'https://nginx/'}api/marchand/option`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                },
            })

            const { success, options, message } = await result.json()

            if (!success) throw new Error(message)

            req.options = options

            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: error.message || 'Something went wrong with your token',
            })
        }
    },
}

