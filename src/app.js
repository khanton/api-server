/* eslint-disable new-cap */

'use strict'

const Fastify = require('fastify')
const FastifyLoader = require('fastify-loader')
const Knex = require('fastify-knexjs')
const Jwt = require('fastify-jwt')
const authMidleware = require('./middleware/auth')

function buildFastify() {
    const fastify = Fastify({
        logger: true
    })

    fastify.register(
        Knex, {
            client: 'pg',
            connection: process.env.PG_CONNECT
        },
        // eslint-disable-next-line no-console
        console.error
    )

    fastify.register(Jwt, {
        secret: process.env.JWT_SECRET
      })

    fastify.decorate('authenticate', authMidleware)

    fastify.register(FastifyLoader, {
        paths: ['api/**/*.js'],
        name: 'fastify'
    })

    return fastify
}

module.exports = buildFastify