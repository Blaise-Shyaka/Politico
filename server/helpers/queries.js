import pool from '../data/config';

const retrieveUser = async (columns, value) => {
  try {
    const client = await pool.connect();
    const data = await client.query(
      `SELECT ${columns} FROM users WHERE email = $1`,
      [value]
    );
    client.release();
    return data;
  } catch (e) {
    return e.stack;
  }
};

const createUser = async (data, hashedPassword) => {
  const client = await pool.connect();
  await client.query(
    `INSERT INTO users (first_name, last_name, email, phone_number, password, is_admin) 
    VALUES($1, $2, $3, $4, $5, $6)
    `,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.phone_number,
      hashedPassword,
      false
    ]
  );
  const user = await retrieveUser('*', data.email);

  client.release();

  return user;
};

export { retrieveUser, createUser };
