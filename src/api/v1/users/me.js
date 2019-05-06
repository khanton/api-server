/* eslint-disable no-undef */

'use strict'

const bcrypt = require('bcrypt')
const _ = require('lodash')

const prefix = '/api/v1/users'

fastify.get(`${prefix}/me`, {
    preValidation: [fastify.authenticate],
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    statusCode: {
                        type: 'integer'
                    },
                    profile: {
                        type: 'object'
                    }
                }
            }
        }

    }
}, async (req) => {

    console.log(req.user)

})