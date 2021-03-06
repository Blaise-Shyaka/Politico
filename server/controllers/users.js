import bcrypt from 'bcrypt';
import moment from 'moment';
import generateToken from '../helpers/generate-token';
import {
  validateUserSignup,
  validateUserSignIn,
  validateOfficeId,
  validateSpecificPartyId,
  validateVote
} from '../helpers/validation';
import { codes, messages } from '../helpers/messages-and-codes';
import {
  retrieveUser,
  createUser,
  retrieveAllParties,
  retrieveSpecificOffice,
  retrieveAllOffices,
  retrieveSpecificParty,
  checkCandidacy,
  voteExists,
  createVote,
  officeExists,
  countVotes
} from '../helpers/queries';
import sendResponse from '../helpers/send-response';

const userSignUp = async (req, res) => {
  const { error, value } = await validateUserSignup(req.body);

  // Return error 400, if user input validation fails
  if (error) return sendResponse(res, codes.badRequest, error.message);

  // Check if the user already exists
  const userExists = await retrieveUser('email', value.email);

  if (userExists.rows.length > 0)
    return sendResponse(res, codes.conflict, messages.userExists);

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

    if (error) return sendResponse(res, codes.badRequest, error.message);

    // Check if the user exists
    const user = await retrieveUser('*', value.email);

    if (user.rows.length === 0)
      return sendResponse(res, codes.unauthorized, messages.userDoesNotExist);

    // Check if the password is correct
    const { password } = user.rows[0];

    const isPasswordCorrect = await bcrypt.compare(value.password, password);

    if (!isPasswordCorrect)
      return sendResponse(res, codes.unauthorized, messages.wrongPassword);

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
    return sendResponse(res, codes.badRequest, messages.wrongParameterFormat);

  // Check if it does not exist and send an error
  const partyId = parseInt(value.partyId, 10);
  const party = await retrieveSpecificParty(partyId);

  if (!party) return sendResponse(res, codes.notFound, messages.partyNotFound);

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

const viewAllParties = async (req, res) => {
  // Query all parties
  const parties = await retrieveAllParties();

  // Check if there are no parties
  if (parties.length === 0)
    return sendResponse(res, codes.notFound, messages.noPartiesFound);

  // Send response
  return res.status(codes.okay).json({ status: res.statusCode, data: parties });
};

const viewSpecificOffice = async (req, res) => {
  // Validate officeId
  const { error, value } = await validateOfficeId(req.params);
  if (error)
    return sendResponse(res, codes.badRequest, messages.wrongParameterFormat);

  // Check if that id exists in the database
  const officeId = parseInt(value.officeId, 10);
  const office = await retrieveSpecificOffice(officeId);

  if (!office)
    return sendResponse(res, codes.notFound, messages.officeNotFound);

  // Send a response
  return res.status(codes.okay).json({ status: res.statusCode, data: office });
};

const viewAllOffices = async (req, res) => {
  // Retrieve all offices
  const offices = await retrieveAllOffices();

  // Check if there are no offices
  if (offices.length === 0)
    return sendResponse(res, codes.notFound, messages.noOfficesFound);

  // Send response
  return res.status(codes.okay).json({ status: res.statusCode, data: offices });
};

const castVote = async (req, res) => {
  // Fetch user ID
  const { id: userId } = req.user;
  if (!userId) return sendResponse(res, codes.unauthorized, messages.noToken);

  // Validate user input
  const { error, value } = await validateVote(req.body);

  if (error) return sendResponse(res, codes.badRequest, error.message);

  // Check if a candidate the user is voting for exists
  const { office: officeId, candidate: candidateId } = value;
  const politician = await checkCandidacy(officeId, candidateId);

  if (!politician)
    return sendResponse(res, codes.notFound, messages.candidateNotFound);

  // Check if the user has not voted for this same office
  const hasVoted = await voteExists(userId, candidateId);
  if (hasVoted) return sendResponse(res, codes.conflict, messages.alreadyVoted);

  // Generate voting time and cast vote
  const createdOn = moment().format('LLL');

  // Create vote and send response
  const vote = await createVote(createdOn, userId, officeId, candidateId);
  const { created_by: voter, office, candidate } = vote;
  return res
    .status(codes.resourceCreated)
    .json({ status: res.statusCode, data: { voter, office, candidate } });
};

const getElectionResults = async (req, res) => {
  // Fetch and validate officeID
  const { error, value } = await validateOfficeId(req.params);
  if (error) return sendResponse(res, codes.badRequest, error.message);

  // Check if office ID exists
  const { officeId } = value;
  const officeOfInterest = await officeExists(officeId);
  if (!officeOfInterest)
    return sendResponse(res, codes.notFound, messages.officeNotFound);

  // Query database for votes count
  const votes = await countVotes(officeOfInterest.office);

  const votesToDisplay = await votes.map(elt => {
    const { candidate, count: results } = elt;
    return { officeId, candidate, results };
  });

  return res
    .status(codes.okay)
    .json({ status: res.statusCode, data: votesToDisplay });
};

export {
  userSignUp,
  userSignIn,
  viewAllParties,
  viewSpecificOffice,
  viewSpecificParty,
  viewAllOffices,
  castVote,
  getElectionResults
};
