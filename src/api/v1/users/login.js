/* eslint-disable no-undef */

'use strict'

const bcrypt = require('bcrypt')
const _ = require('lodash')

const prefix = '/api/v1/users'

fastify.post(`${prefix}/login`, {
    schema: {
        body: {
            type: 'object',
            properties: {
                user: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                }
            },
            required: ['user', 'password']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    statusCode: {
                        type: 'integer'
                    },
                    token: {
                        type: 'string'
                    }
                }
            }
        }

    }
}, async (req) => {

    const [user] = await fastify.knex.select('id', 'name', 'password').from('users').where({
        name: req.body.user
    })

    if (_.isUndefined(user) || !await bcrypt.compare(req.body.password, user.password)) {
        const err = new Error('Invalid user or password')

        err.statusCode = 401
        throw err
    }

    return {
        statusCode: 200,
        token: fastify.jwt.sign({
            id: user.id,
            name: user.name
        }, {
            expiresIn: '7d'
        })
    }

})