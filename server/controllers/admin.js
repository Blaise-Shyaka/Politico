/* eslint-disable consistent-return */
import { codes, messages } from '../helpers/messages-and-codes';
import {
  validatePoliticalParty,
  validatePoliticalOffice,
  validateSpecificPartyId,
  validateOfficeId,
  validateCandidate
} from '../helpers/validation';

import {
  createParty,
  retrieveParty,
  createOffice,
  retrievePartyById,
  retrieveSpecificParty,
  retrieveSpecificOffice,
  retrieveSpecificUser,
  registerCandidate,
  candidateExists
} from '../helpers/queries';

const createPoliticalParty = async (req, res) => {
  const { isAdmin } = req.user;
  if (!isAdmin)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.notAllowed });

  // validate party
  const { error, value } = await validatePoliticalParty(req.body);
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if the party already exists
  const partyAlreadyExists = await retrieveParty('name', value.name);
  if (partyAlreadyExists)
    return res
      .status(codes.conflict)
      .json({ status: res.statusCode, error: messages.partyExists });

  // insert into the parties table

  const party = await createParty(value);
  const { id, name } = party.rows[0];

  return res
    .status(codes.resourceCreated)
    .json({ status: res.statusCode, data: { id, name } });
};

const deletePoliticalParty = async (req, res) => {
  // Check if the user accessing this route is an admin
  const { isAdmin } = req.user;
  if (!isAdmin)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.notAllowed });

  // Validate req.params
  const { error, value } = await validateSpecificPartyId(req.params);
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });
  // Check if party exists
  const { partyId } = value;
  const id = parseInt(partyId, 10);
  const party = await retrievePartyById('*', id);
  if (!party)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.partyNotFound });

  // Delete party and send response
  deletePoliticalParty(id);
  return res.status(codes.okay).json({
    status: res.statusCode,
    data: { message: messages.successfullyDeleted }
  });
};

const createPoliticalOffice = async (req, res) => {
  // Check if the user accessing this route is an admin
  const { isAdmin } = req.user;
  if (!isAdmin)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.notAllowed });
  // Validate the input
  const { error, value } = await validatePoliticalOffice(req.body);
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if it the office type falls into pre-specified categories
  const officeTypes = ['federal', 'legislative', 'state', 'local government'];
  const typeOfOfficeSubmitted = value.type;
  const isIncluded = officeTypes.includes(typeOfOfficeSubmitted.toLowerCase());
  if (!isIncluded)
    return res.status(codes.badRequest).json({
      status: res.statusCode,
      error: messages.notATypeOfOffice
    });

  // Insert into the database and send response
  const office = await createOffice(value);
  return res
    .status(codes.resourceCreated)
    .json({ status: res.statusCode, data: office });
};

const registerPolitician = async (req, res) => {
  // Check if user accessing this route is an admin
  const { isAdmin } = req.user;
  if (!isAdmin)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.notAllowed });

  // Validate and fetch party, office, and user ID
  const { error, value } = await validateOfficeId(req.params);
  const {
    error: candidateError,
    value: candidateValue
  } = await validateCandidate(req.body);

  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: messages.wrongParameterFormat });

  if (candidateError)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: candidateError.message });

  // Check if party, office and user exist
  const partyId = parseInt(candidateValue.party, 10);
  const userId = parseInt(candidateValue.user, 10);
  const officeId = parseInt(value.officeId, 10);

  const party = await retrieveSpecificParty(partyId);
  const office = await retrieveSpecificOffice(officeId);
  const user = await retrieveSpecificUser('*', userId);

  if (!party)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.partyNotFound });

  if (!office)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.officeNotFound });

  if (!user)
    return res
      .status(codes.notFound)
      .json({ status: res.statusCode, error: messages.noUser });

  // Check if a candidate is already running for that specific office
  const politician = await candidateExists(officeId, userId);

  if (politician)
    return res
      .status(codes.conflict)
      .json({ status: res.statusCode, error: messages.candidateAlreadyExists });

  // Register candidate and send a response
  const candidate = await registerCandidate(officeId, partyId, userId);

  return res
    .status(codes.resourceCreated)
    .json({ status: res.statusCode, data: candidate });
};

export {
  createPoliticalParty,
  createPoliticalOffice,
  deletePoliticalParty,
  registerPolitician
};
