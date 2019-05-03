'use strict'

const Fastify = require('fastify')
const FastifyLoader = require('fastify-loader')


function buildFastify() {
    const fastify = Fastify({
        logger: true
    })

    fastify.register(FastifyLoader, {
        paths: ['api/**/*.js'],
        name: 'fastify'
    });

    return fastify
}

module.exports = buildFastify 