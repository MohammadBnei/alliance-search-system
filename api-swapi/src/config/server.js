const fs = require('fs');

module.exports = {
    PORT: process.env.PORT || 3000,
    ssl: {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT)
    },
}
