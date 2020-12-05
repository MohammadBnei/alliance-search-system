const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const is = require('is_js');

const SWAPI_URl = 'http://swapi.dev/api/';
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const jwtOptions = { audience: 'urn:foo', issuer: 'urn:issuer' }

const RESOURCE_LIST = ['films', 'people', 'planets', 'species', 'starships', 'vehicles']

const userMock = {
    name: 'Luke',
    password: 'DadSucks'
};

const generateToken = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET, jwtOptions)

    return token
}

const verifyToken = async function (request) {
    let token = request.headers['authorization']

    if (!token) throw Boom.unauthorized('No token provided')

    token = token.replace('Bearer ', '')

    const user = jwt.verify(token, JWT_SECRET, jwtOptions)

    if (!user) throw Boom.unauthorized('Not a valid token')

    return user
}

const verifyCredentials = (request) => {
    const { name, password } = request.payload;
    if (name !== userMock.name)
        throw Boom.badRequest(`User ${name} not found`)

    if (password !== userMock.password)
        throw Boom.badRequest(`Wrong password`)

    return userMock
}

const init = async () => {

    const server = Hapi.server({
        debug: { log: ['*'] },
        port: PORT,
        host: '0.0.0.0',
        routes: {
            cors: true
        }
    });

    // await server.register(require('@hapi/jwt'));

    // server.auth.strategy('jwt', 'jwt', {
    //     keys: 'secret',
    //     verify: {
    //         aud: 'urn:audience:test',
    //         iss: 'urn:issuer:test',
    //         sub: false,
    //         nbf: true,
    //         exp: true,
    //         maxAgeSec: 14400, // 4 hours
    //         timeSkewSec: 15
    //     },
    //     validate: validation
    // });


    server.route({
        method: 'GET',
        path: '/api/search',
        handler: async (request, h) => {
            // TODO : Move token logic to a plugin
            // verifyToken(request);
            const { resource, term: searchTerm } = request.query

            if (RESOURCE_LIST.indexOf(resource) === -1)
                throw Boom.badRequest(resource ? `${resource} not in avalaible resource : ${RESOURCE_LIST.join(', ')}` : 'No resource specified. You must provide one.')

            if (!searchTerm)
                throw Boom.badRequest('You must specify a search term')

            const result = await (await fetch(`${SWAPI_URl}${resource}/?search=${searchTerm}`)).json()

            request.log('log', result)

            while (result.next !== null) {
                const { results, next } = await (await fetch(result.next)).json()

                result.next = next
                result.results = [...result.results, ...results]
            }

            return result;
        }
    });

    server.route({
        method: 'GET',
        path: '/api/element',
        handler: async (request, h) => {
            // TODO : Move token logic to a plugin
            // verifyToken(request);
            const { url } = request.query

            if (!url || is.not.url(url))
                throw Boom.badRequest('You must specify a correct url')

            const result = await (await fetch(url)).json()

            //TODO : Push to client
            /**
             * Object.keys(element).reduce((acc, cur) => {
                    if (is.array(element[cur])) {
                        acc[cur] = element[cur].filter(c => is.url(c))
                    }
                    return acc
                }, {})
             */

            request.log('log', url)

            return result;
        }
    });

    server.route({
        method: 'GET',
        path: '/api/element/{id}',
        handler: async (request, h) => {
            // TODO : Move token logic to a plugin
            // verifyToken(request);
            const { resource } = request.query
            const { id } = request.params

            if (!id)
                throw Boom.badRequest('No id specified')

            if (RESOURCE_LIST.indexOf(resource) === -1)
                throw Boom.badRequest(resource ? `${resource} not in avalaible resource : ${RESOURCE_LIST.join(', ')}` : 'No resource specified. You must provide one.')

            const result = await (await fetch(`${SWAPI_URl}${resource}/${id}`)).json()

            return result;
        }
    });

    server.route({
        method: ['GET', 'OPTIONS'],
        path: '/api/',
        handler: async (request, h) => {
            return { resourceList: RESOURCE_LIST };
        }
    });

    server.route({
        method: 'POST',
        path: '/auth/signin',
        // validate: {
        //     payload: {
        //         name: Joi.string().required(),
        //         password: Joi.string().required()
        //     }
        // },
        handler: async (request, h) => {
            // TODO : Move token logic to a plugin
            const user = verifyCredentials(request);

            return {
                user,
                token: await generateToken(user)
            };
        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();