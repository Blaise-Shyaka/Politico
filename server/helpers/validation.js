import Joi from '@hapi/joi';

const validateUserSignup = data => {
  const schema = Joi.object({
    first_name: Joi.string()
      .trim()
      .required(),
    last_name: Joi.string()
      .trim()
      .required(),
    email: Joi.string()
      .trim()
      .email()
      .required(),
    phone_number: Joi.string()
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
    confirm_password: Joi.ref('password')
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
    hq_address: Joi.string()
      .trim()
      .required(),
    logo_url: Joi.string().trim()
  });
  return schema.validate(data);
};

export { validateUserSignup, validateUserSignIn, validatePoliticalParty };
