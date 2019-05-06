/* eslint-disable no-console */

'use strict'

require('dotenv-flow').config()
const fastify = require('./app')();

(async () => {
    try {
        await fastify.listen(process.env.PORT, process.env.ADDRESS)

        if (process.env.SHOW_ROUTES) {
            console.log(fastify.printRoutes())
        }
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})()