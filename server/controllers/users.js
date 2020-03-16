import bcrypt from 'bcrypt';
import generateToken from '../helpers/generate-token';
import { validateUserSignup, validateUserSignIn } from '../helpers/validation';
import { codes, messages } from '../helpers/messages-and-codes';
import { retrieveUser, createUser } from '../helpers/queries';

const userSignUp = async (req, res) => {
  const { error, value } = await validateUserSignup(req.body);

  // Return error 400, if user input validation fails
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if the user already exists
  const userExists = await retrieveUser('email', value.email);

  if (userExists.rows.length > 0)
    return res
      .status(codes.conflict)
      .json({ status: res.statusCode, error: messages.userExists });

  // Hash password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(value.password, salt);

  // Create user instance in the database
  const user = await createUser(value, hashedPassword);
  // eslint-disable-next-line camelcase
  const { id, email, phone_number, is_admin } = user.rows[0];
  return res.status(codes.resourceCreated).json({
    status: res.statusCode,
    data: { id, email, phone_number, is_admin }
  });
};

const userSignIn = async (req, res) => {
  // Validate user input
  const { error, value } = await validateUserSignIn(req.body);

  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if the user exists
  const user = await retrieveUser('*', value.email);

  if (user.rows.length === 0)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.userDoesNotExist });

  // Check if the password is correct
  const { password } = user.rows[0];

  const isPasswordCorrect = await bcrypt.compare(value.password, password);

  if (!isPasswordCorrect)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.wrongPassword });

  // Generate token
  // eslint-disable-next-line camelcase
  const { id, email, phone_number, is_admin } = user.rows[0];
  const token = await generateToken({ id, email, is_admin });

  return res.status(codes.okay).json({
    status: res.statusCode,
    data: {
      token,
      id,
      email,
      phone_number,
      is_admin
    }
  });
};

export { userSignUp, userSignIn };
