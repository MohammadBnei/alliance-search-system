const { generateToken } = require('../jwt')

const user = {
    username: 'Luke',
    password: 'DadSucks'
}

module.exports = {
    signUp: async (req, res) => {
        try {
            const { marchand, contact } = req.body
            marchandValidator.verifyMarchand(marchand)
            contactValidator.verifyContactOnCreateWithMarchand(contact)

            const newMarchand = await Marchand.create(marchand)
            newMarchand.getContact()
                .then(c => c.update(contact))

            sendCreationMail(contact)

            res.send({ success: true })

        } catch (error) {
            console.error(error)
            res.status(500).send({
                message: error.message || 'Some error occurred'
            })
        }
    },

    signIn: async (req, res) => {
        try {
            const { username, password } = req.body

            console.log({username});

            if (username !== user.username) {
                throw new Error('User not found')
            }
            if (password !== user.password) {
                throw new Error('Wrong password')
            }

            const token = generateToken(user.username)

            res.send({ token, user })

        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred'
            })
        }
    },

    jwtSignIn: async (req, res) => {
        try {
            const { marchand } = req

            const contact = await marchand.getContact()

            res.send({
                success: true, user: {
                    ...marchand.get({
                        plain: true
                    }), ...contact.get({
                        plain: true
                    })
                }
            })

        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred'
            })
        }
    },

    delete: async (req, res) => {
        const id = req.params.id

        try {
            const num = await Marchand.destroy({
                where: { id: id }
            })
            if (num == 1) {
                res.send({
                    message: 'marchand was deleted successfully!'
                })
            } else {
                res.send({
                    message: `Cannot delete marchand with id = ${id}.Maybe marchand was not found!`
                })
            }
        } catch (error) {
            res.status(500).send({
                message: `Could not delete marchand with id = ${id} `
            })
        }
    }
}
