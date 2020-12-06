const path = require('path');
const {
    NODE_ENV = 'production',
} = process.env;
module.exports = {
    entry: './app.js',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.js'],
    }
}