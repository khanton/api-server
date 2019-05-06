'use strict'

require('dotenv-flow').config()

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECT
  },
  test: {
    client: 'pg',
    connection: process.env.PG_CONNECT
  }
};