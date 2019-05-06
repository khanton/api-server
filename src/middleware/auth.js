/* eslint-disable no-undef */

'use strict'

 async function middle (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  }

  module.exports = middle;