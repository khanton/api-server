/* eslint-disable require-await */
/* eslint-disable no-undef */

'use strict'

fastify.get('/api/v1/version', async () => ({
    version: 1
}))