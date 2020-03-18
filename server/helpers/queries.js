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
  const user = await client.query(
    `INSERT INTO users (first_name, last_name, email, phone_number, password, is_admin) 
    VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      data.firstName,
      data.lastName,
      data.email,
      data.phoneNumber,
      hashedPassword,
      false
    ]
  );

  client.release();
  return user;
};

const retrieveParty = async (columns, value) => {
  const client = await pool.connect();
  const data = await client.query(
    `SELECT ${columns} FROM parties WHERE name = $1`,
    [value]
  );
  client.release();
  return data.rows[0];
};

const createParty = async data => {
  const client = await pool.connect();
  const party = await client.query(
    `INSERT INTO parties (name, hq_address, logo_url) VALUES($1, $2, $3) RETURNING *`,
    [data.name, data.hqAddress, data.logoUrl]
  );
  client.release();

  return party;
};

const retrieveAllParties = async () => {
  const client = await pool.connect();
  const parties = await client.query(`SELECT id, name, logo_url FROM parties`);
  client.release();

  return parties.rows;
};

const retrieveSpecificOffice = async id => {
  const client = await pool.connect();
  const office = await client.query('SELECT * FROM offices WHERE id = $1', [
    id
  ]);
  await client.release();

  return office.rows[0];
};

export {
  retrieveUser,
  createUser,
  retrieveParty,
  createParty,
  retrieveAllParties,
  retrieveSpecificOffice
};
