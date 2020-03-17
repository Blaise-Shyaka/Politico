/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { codes, messages } from '../helpers/messages-and-codes';

const authoriseUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.noToken });

  const verifiedUser = await jwt.verify(token, process.env.secret_key);

  req.user = verifiedUser;

  next();
};

export default authoriseUser;
