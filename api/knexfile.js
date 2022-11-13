// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const HOST = process.env.DATABASE_HOST || '127.0.0.1';
const USER = process.env.POSTGRES_USER || 'postgres';
const PASSWORD = process.env.POSTGRES_PASSWORD || 'docker';
const DATABASE = process.env.POSTGRES_DB || 'ewok';
const PORT = process.env.PORT || 5432;

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: HOST,
      user: USER,
      password: PASSWORD,
      port: PORT,
      database: DATABASE
    },
    migrations: {
      directory: './migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      dhost: '127.0.0.1',
      password: 'docker',
      user: 'postgres',
      port: 5432,
      database: 'ewok'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL+'?ssl=no-verify',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }

};
