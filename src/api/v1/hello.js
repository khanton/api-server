'use strict'

// eslint-disable-next-line no-undef
fastify.get('/api/v1/hello', async () => {
    // Complex code here
    return {
        hello: true,
        version: 1
    };
})