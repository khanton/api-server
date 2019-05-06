/* eslint-disable require-unicode-regexp */
/* eslint-disable arrow-parens */

'use strict'

require('dotenv-flow').config()

const _ = require('lodash')
const tap = require('tap')
const request = require('superagent')
const buildFastify = require('../src/app')

let fastify = null
let url = null

const USERNAME = 'test@test.com'
const PASSWORD = 'password'

tap.beforeEach(async (done) => {
    fastify = buildFastify()

    await fastify.listen()
    await fastify.knex.migrate.latest()
    url = `http://${fastify.server.address().address}:${fastify.server.address().port}/api/v1`
    done()
})

tap.afterEach(async (done) => {
    await fastify.knex.migrate.rollback()
    fastify.knex.client.pool.destroy()
    await fastify.close()
    done()
})

tap.test('Auth create user', async t => {

    // Correct

    let res = await request.post(`${url}/users/create`).send({
        user: USERNAME,
        password: PASSWORD
    })

    t.is(res.status, 200)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));
    t.ok(_.isInteger(res.body.id))

    // No username

    res = await request.post(`${url}/users/create`).send({
        password: PASSWORD
    }).ok(() => true)

    t.is(res.status, 400)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));

    // No password

    res = await request.post(`${url}/users/create`).send({
        user: USERNAME
    }).ok(() => true)

    t.is(res.status, 400)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));

})

tap.test('Auth login', async t => {

    // Correct

    let res = await request.post(`${url}/users/create`).send({
        user: USERNAME,
        password: PASSWORD
    })

    t.is(res.status, 200)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));

    // Login success

    res = await request.post(`${url}/users/login`).send({
        user: USERNAME,
        password: PASSWORD
    }).ok(() => true)

    t.is(res.status, 200)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.ok(!_.isEmpty(res.body.token))
    t.is(res.body.statusCode, 200)

    // Login failed (invalid password)

    res = await request.post(`${url}/users/login`).send({
        user: USERNAME,
        password: 'password1'
    }).ok(() => true)

    t.is(res.status, 401)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.is(res.body.statusCode, 401)

    // Login failed (invalid user)

    res = await request.post(`${url}/users/login`).send({
        user: 'test1@test.com',
        password: PASSWORD
    }).ok(() => true)

    t.is(res.status, 401)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.is(res.body.statusCode, 401)

    // Login failed (incorrect params)

    res = await request.post(`${url}/users/login`).send({
        password: PASSWORD
    }).ok(() => true)

    t.is(res.status, 400)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.is(res.body.statusCode, 400)
})

tap.test('Auth get info', async t => {

    // Correct

    let res = await request.post(`${url}/users/create`).send({
        user: USERNAME,
        password: PASSWORD
    })

    t.is(res.status, 200)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body));

    // Login success

    res = await request.post(`${url}/users/login`).send({
        user: USERNAME,
        password: PASSWORD
    }).ok(() => true)

    t.is(res.status, 200)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.ok(!_.isEmpty(res.body.token))
    t.is(res.body.statusCode, 200)

    const {token} = res.body;

    // Get Info success

    res = await request.get(`${url}/users/me`)
        .set('Authorization', `Bearer ${token}`)
        .ok(() => true)

    t.is(res.status, 200)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.ok(_.isPlainObject(res.body.profile))
    t.is(res.body.profile.name, USERNAME)
    t.is(res.body.statusCode, 200)

    // Get Info unsuccess

    res = await request.get(`${url}/users/me`)
        .set('Authorization', `Bearer ${token}AA`)
        .ok(() => true)

    t.is(res.status, 401)

    t.match(_.get(res.headers, 'content-type'), /application\/json/)

    t.ok(_.isPlainObject(res.body))
    t.is(res.body.statusCode, 401)


})