/* eslint-disable arrow-parens */

'use strict'

const _ = require('lodash')
const tap = require('tap')
const request = require('superagent')
const buildFastify = require('../src/app')

tap.test('GET `/api/v1/hello` route', async t => {
    const fastify = buildFastify()

    t.tearDown(() => {
        fastify.close()
    })

    await fastify.listen()

    const url = `http://${fastify.server.address().address}:${fastify.server.address().port}/api/v1`

    const res = await request.get(`${url}/hello`)

    t.is(res.status, 200)
    // eslint-disable-next-line require-unicode-regexp
    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));
})