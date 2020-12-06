const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: function (user) {
        //1. Dont use password and other sensitive fields
        //2. Use fields that are useful in other parts of the     
        //app/collections/models
        return jwt.sign({ user }, process.env.JWT_SECRET || 'secret')
    },

    verifyJWT: async (req, res, next) => {
        try {
            let token = req.headers['authorization']

            if (!token) throw new Error('No token provided')

            token = token.replace('Bearer ', '')

            const { user } = jwt.verify(token, process.env.JWT_SECRET)

            if (!user) throw new Error('Not a valid token')

            next()
        } catch (error) {
            return res.status(404).send({
                success: false,
                message: error.message || 'Something went wrong',
            })
        }

    },



    // verifyJWTAdmin: async (req, res, next) => {
    //     let token = req.headers['authorization']

    //     if (!token) { res.status(403).send({ message: 'No token provided' }) }

    //     token = token.replace('Bearer ', '')

    //     try {

    //         const { admin } = jwt.verify(token, process.env.JWT_SECRET_ADMIN || 'prp-esgi-admin')
    //         if (!admin) throw new Error('Not a valid token')

    //         req.role = {admin: true}
    //         if (!req.role) throw new Error('User not admin')

    //         // console.log(req.body.marchandId)

    //     } catch (error) {
    //         return res.status(404).send({
    //             success: false,
    //             message: error.message || 'Something went wrong',
    //         })
    //     }

    //     next()

    // }
}