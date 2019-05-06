/* eslint-disable no-undef */

'use strict'

const bcrypt = require('bcrypt')

const prefix = '/api/v1/users'

fastify.post(`${prefix}/create`, {
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
                    id: {
                        type: 'integer'
                    }
                }
            }
        }

    }
}, async (req) => {

    const [id] = await fastify.knex('users').insert({
        name: req.body.user,
        password: await bcrypt.hash(req.body.password, 10)
    }).returning('id')

    return {
        statusCode: 200,
        id
    }
})