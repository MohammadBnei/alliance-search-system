module.exports = {
    PORT: process.env.PORT || 3000,
    ssl: {
        key: fs.readFileSync(proces.env.SSL_KEY),
        cert: fs.readFileSync(proces.env.SSL_CERT)
    },
}
