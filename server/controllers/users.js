import bcrypt from 'bcrypt';
import generateToken from '../helpers/generate-token';
import {
  validateUserSignup,
  validateUserSignIn,
  validateSpecificPartyId
} from '../helpers/validation';
import { codes, messages } from '../helpers/messages-and-codes';
import {
  retrieveUser,
  createUser,
  retrieveSpecificParty
} from '../helpers/queries';

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

  const {
    id,
    email,
    phone_number: phoneNumber,
    is_admin: isAdmin
  } = user.rows[0];

  return res.status(codes.resourceCreated).json({
    status: res.statusCode,
    data: { id, email, phoneNumber, isAdmin }
  });
};

const userSignIn = async (req, res) => {
  try {
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
    const {
      id,
      email,
      phone_number: phoneNumber,
      is_admin: isAdmin
    } = user.rows[0];
    const token = await generateToken({ id, email, isAdmin });

    return res.status(codes.okay).json({
      status: res.statusCode,
      data: {
        token,
        id,
        email,
        phoneNumber,
        isAdmin
      }
    });
  } catch (e) {
    return e.stack;
  }
};

const viewSpecificParty = async (req, res) => {
  // Validate the parameter object
  const { error, value } = validateSpecificPartyId(req.params);
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: messages.wrongParameterFormat });

  // Check if it does not exist and send an error
  const partyId = parseInt(value.partyId, 10);
  const party = await retrieveSpecificParty(partyId);

  if (!party)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.partyNotFound });

  // Display the response
  const { id, name, logo_url: logoUrl } = party;

  return res.status(codes.okay).json({
    status: res.statusCode,
    data: {
      id,
      name,
      logoUrl
    }
  });
};

export { userSignUp, userSignIn, viewSpecificParty };
