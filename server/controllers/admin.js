/* eslint-disable consistent-return */
import { codes, messages } from '../helpers/messages-and-codes';
import {
  validatePoliticalParty,
  validatePoliticalOffice,
  validateSpecificPartyId
} from '../helpers/validation';
import {
  createParty,
  retrieveParty,
  createOffice,
  retrievePartyById
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

export { createPoliticalParty, createPoliticalOffice, deletePoliticalParty };
