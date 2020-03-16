import jwt from 'jsonwebtoken';

const generateToken = async data => {
  const token = await jwt.sign(data, process.env.secret_key);
  return token;
};

export default generateToken;
