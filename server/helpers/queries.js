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

const retrievePartyById = async (columns, value) => {
  const client = await pool.connect();
  const data = await client.query(
    `SELECT ${columns} FROM parties WHERE id = $1`,
    [value]
  );
  client.release();
  return data.rows[0];
};

const deleteParty = async id => {
  const client = await pool.connect();
  await client.query(`DELETE FROM parties WHERE id = $1`, [id]);
  await client.release();
};

const retrieveSpecificParty = async data => {
  const client = await pool.connect();
  const party = await client.query(
    'SELECT id, name, logo_url FROM parties WHERE id = $1',
    [data]
  );
  client.release();

  return party.rows[0];
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
const retrieveAllOffices = async () => {
  const client = await pool.connect();
  const offices = await client.query(`SELECT * FROM offices`);
  client.release();

  return offices.rows;
};

const createOffice = async data => {
  const client = await pool.connect();
  const office = await client.query(
    'INSERT INTO offices(type, name) VALUES($1, $2) RETURNING *',
    [data.type, data.name]
  );
  client.release();

  return office.rows[0];
};

const checkCandidacy = async (office, candidate) => {
  const client = await pool.connect();
  const politician = await client.query(
    `SELECT * FROM candidates WHERE office = $1 AND candidate = $2`,
    [office, candidate]
  );

  await client.release();

  return politician.rows[0];
};

const voteExists = async (voter, office) => {
  const client = await pool.connect();
  const vote = await client.query(
    'SELECT * FROM votes WHERE created_by = $1 AND office = $2',
    [voter, office]
  );
  await client.release();

  return vote.rows[0];
};

const createVote = async (date, userId, officeId, candidateId) => {
  const client = await pool.connect();
  const vote = await client.query(
    `INSERT INTO votes (created_on, created_by, office, candidate)
    VALUES($1, $2, $3, $4) RETURNING *`,
    [date, userId, officeId, candidateId]
  );
  client.release();

  return vote.rows[0];
};

export {
  retrieveUser,
  createUser,
  retrieveParty,
  createParty,
  retrieveSpecificOffice,
  retrieveAllOffices,
  createOffice,
  retrievePartyById,
  deleteParty,
  retrieveSpecificParty,
  retrieveAllParties,
  checkCandidacy,
  voteExists,
  createVote
};
