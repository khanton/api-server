'use strict'

require('dotenv-flow').config()
const fastify = require('./app')();

(async () => {
    try {
        await fastify.listen(process.env.PORT, process.env.ADDRESS)

        if (process.env.SHOW_ROUTES) {
            // eslint-disable-next-line no-console
            console.log(fastify.printRoutes())
        }
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})()