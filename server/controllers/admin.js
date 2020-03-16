/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import { codes, messages } from '../helpers/messages-and-codes';
import { validatePoliticalParty } from '../helpers/validation';
import { createParty, retrieveParty } from '../helpers/queries';

const createPoliticalParty = (req, res) => {
  const { is_admin } = req.user;

  if (!is_admin)
    return res
      .status(codes.unauthorized)
      .json({ status: res.statusCode, error: messages.notAllowed });

  // validate party
  const { error, value } = validatePoliticalParty(req.body);
  if (error)
    return res
      .status(codes.badRequest)
      .json({ status: res.statusCode, error: error.message });

  // Check if the party already exists

  const partyAlreadyExists = retrieveParty('name', value.name);
  if (partyAlreadyExists)
    return res
      .status(codes.conflict)
      .json({ status: res.statusCode, error: messages.partyExists });

  // insert into the parties table
  const party = createParty(value);
  const { id, name } = party.rows[0];

  return res
    .status(codes.resourceCreated)
    .json({ status: res.statusCode, data: { id, name } });
};

export default createPoliticalParty;
