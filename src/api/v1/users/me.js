/* eslint-disable no-undef */

'use strict'

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
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              name: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
}, async (req) => {
  const [user] = await fastify.knex.select('id', 'name').from('users').where({
    id: req.user.id
  })

  if (_.isUndefined(user)) {
    const err = new Error('Invalid user token')

    err.statusCode = 400
    throw err
  }

  return {
    statusCode: 200,
    profile: user
  }
})
