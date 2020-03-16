/* eslint-disable import/no-extraneous-dependencies */
import pool from './config';

const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone_number VARCHAR(10) NOT NULL,
        password VARCHAR NOT NULL,
        is_admin BOOLEAN NOT NULL
    )`;

const partiesTable = `
      CREATE TABLE IF NOT EXISTS parties (
        id SERIAL PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL,
        hq_address VARCHAR NOT NULL,
        logo_url VARCHAR
      )`;

const dropUsersTable = async () => {
  const client = await pool.connect();
  await client.query('DROP TABLE IF EXISTS users CASCADE');
  client.release();
};

const createUsersTable = async () => {
  const client = await pool.connect();
  await client.query(usersTable);
  client.release();
};

const dropPartiesTable = async () => {
  const client = await pool.connect();
  await client.query('DROP TABLE IF EXISTS parties CASCADE');
  client.release();
};

const createPartiesTable = async () => {
  const client = await pool.connect();
  await client.query(partiesTable);
  client.release();
};

export {
  dropUsersTable,
  createUsersTable,
  dropPartiesTable,
  createPartiesTable
};

require('make-runnable');
