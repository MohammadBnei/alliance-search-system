const EventEmitter = require('events')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

const { getToken } = require('../token')
const eventEmitter = new EventEmitter()

// eventEmitter.on(TRANSACTION_VALIDATED, (payload) => {
//     fetch(`${process.env.BASE_URL}events/transaction/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${getToken()}`
//         },
//         body: JSON.stringify({ type: TRANSACTION_VALIDATED, payload })
//     })
//         .catch((error) => console.error(error))
// })

// eventEmitter.on(TRANSACTION_PAYED, (payload) => {
//     fetch(`${process.env.BASE_URL}events/transaction/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${getToken()}`
//         },
//         body: JSON.stringify({ type: TRANSACTION_PAYED, payload })
//     })
//         .catch((error) => console.error(error))
// })

module.exports = {
    eventEmitter
};
