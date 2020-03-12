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

const createUsersTable = async () => {
  const client = await pool.connect();
  await client.query('DROP TABLE IF EXISTS users CASCADE');
  await client.query(usersTable);
  client.release();
};

export default createUsersTable;

require('make-runnable');
