import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let connectionString = '';

if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DB_URL;
} else if (process.env.NODE_ENV === 'dev') {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DEV}`;
} else if (process.env.NODE_ENV === 'test') {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_TEST}`;
}

const pool = new Pool({ connectionString });

export default pool;
