/* eslint-disable import/no-extraneous-dependencies */
import pool from './config';

const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone_number VARCHAR(10) NOT NULL,
        password VARCHAR NOT NULL,
        is_admin BOOLEAN NOT NULL
    );

    INSERT INTO users (first_name, last_name, email, phone_number, password, is_admin) 
    VALUES(
      'Blue',
      'west',
      'bluewest@gmail.com',
      '0785007666', 
      '$2b$10$FN8VUIWVKKmEMJFJ1lC.OON0ehXHaUl85oE.USaDkbXy2jk6M51vy', 
      false 
      );

    CREATE TABLE IF NOT EXISTS parties (
      id SERIAL PRIMARY KEY,
      name VARCHAR UNIQUE NOT NULL,
      hq_address VARCHAR NOT NULL,
      logo_url VARCHAR
    );

    INSERT INTO parties (name, hq_address, logo_url) 
    VALUES(
      'testParty', 
      'testAddress', 
      'testUrl'
      );

      CREATE TABLE IF NOT EXISTS offices (
        id SERIAL PRIMARY KEY,
        type VARCHAR NOT NULL,
        name VARCHAR NOT NULL
      );
  
      INSERT INTO offices (type, name) 
      VALUES(
        'testOfficeType', 
        'testOfficeName'
        );
      
      CREATE TABLE IF NOT EXISTS candidates(
        office INT REFERENCES offices(id) ON DELETE CASCADE NOT NULL,
        party INT REFERENCES parties(id) ON DELETE CASCADE NOT NULL,
        candidate INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        PRIMARY KEY(candidate, office)
      );
  `;

const dropTablesQuery = `
      DROP TABLE IF EXISTS users CASCADE;

      DROP TABLE IF EXISTS parties CASCADE;

      DROP TABLE IF EXISTS offices CASCADE;

      DROP TABLE IF EXISTS candidates CASCADE;
`;

const createTables = async () => {
  const client = await pool.connect();
  await client.query(createTablesQuery);
  client.release();
};

const dropTables = async () => {
  const client = await pool.connect();
  await client.query(dropTablesQuery);
  client.release();
};

export { createTables, dropTables };

require('make-runnable');
