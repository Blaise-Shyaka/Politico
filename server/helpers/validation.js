import Joi from '@hapi/joi';

const validateUserSignup = data => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .required(),
    lastName: Joi.string()
      .trim()
      .required(),
    email: Joi.string()
      .trim()
      .email()
      .required(),
    phoneNumber: Joi.string()
      .trim()
      .regex(/^[0][0-9]+$/)
      .min(10)
      .max(10)
      .required()
      .messages({
        'string.pattern.base':
          'Phone number should start with a 0, and it is only made up of digits between 0 and 9'
      }),
    password: Joi.string()
      .trim()
      .alphanum()
      .required(),
    confirmPassword: Joi.ref('password')
  });

  return schema.validate(data);
};

const validateUserSignIn = data => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({ 'string.base': 'The email should be comprised of letters' }),
    password: Joi.string()
      .trim()
      .alphanum()
      .required()
  });
  return schema.validate(data);
};

const validatePoliticalParty = data => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .required(),
    hqAddress: Joi.string()
      .trim()
      .required(),
    logoUrl: Joi.string().trim()
  });
  return schema.validate(data);
};

const validateOfficeId = data => {
  const schema = Joi.object({
    officeId: Joi.string().regex(/^[0-9]+$/)
  });

  return schema.validate(data);
};

const validatePoliticalOffice = data => {
  const schema = Joi.object({
    type: Joi.string()
      .trim()
      .required(),
    name: Joi.string()
      .trim()
      .required()
  });

  return schema.validate(data);
};

const validateSpecificPartyId = data => {
  const schema = Joi.object({
    partyId: Joi.string().regex(/^[0-9]+$/)
  });

  return schema.validate(data);
};

const validateVote = data => {
  const schema = Joi.object({
    office: Joi.string()
      .trim()
      .regex(/^[0-9]+$/),
    candidate: Joi.string()
      .trim()
      .regex(/^[0-9]+$/)
     });

  return schema.validate(data);
};

const validateCandidate = data => {
  const schema = Joi.object({
    party: Joi.string().regex(/^[0-9]+$/),
    user: Joi.string().regex(/^[0-9]+$/)
  });

  return schema.validate(data);
};

export {
  validateUserSignup,
  validateUserSignIn,
  validatePoliticalParty,
  validateOfficeId,
  validatePoliticalOffice,
  validateSpecificPartyId,
  validateVote
  validateCandidate
};
