/* eslint-disable arrow-parens */

'use strict'

require('dotenv-flow').config()

const _ = require('lodash')
const tap = require('tap')
const request = require('superagent')
const buildFastify = require('../src/app')

let fastify = null
let url = null

tap.beforeEach((done) => {
    fastify = buildFastify()

    fastify.listen().then(() => {
        url = `http://${fastify.server.address().address}:${fastify.server.address().port}/api/v1`
        done()
    })
})

tap.afterEach((done) => {
    if (fastify) {
        fastify.close().then(() => done())
    }
})

tap.test('GET `/api/v1/version` route', async t => {

    const res = await request.get(`${url}/version`)

    t.is(res.status, 200)
    // eslint-disable-next-line require-unicode-regexp
    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));
})

tap.test('GET `/api/v1/version-not-found` route', async t => {

    try {
        await request.get(`${url}/version-not-found`)
    } catch (err) {
        t.is(err.status, 404)
    }
})