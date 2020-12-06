const RESOURCE_LIST = ['films', 'people', 'planets', 'species', 'starships', 'vehicles']
const SWAPI_URL = 'http://swapi.dev/api/'

module.exports = {
    ...require('./server'),
    RESOURCE_LIST,
    SWAPI_URL
}
