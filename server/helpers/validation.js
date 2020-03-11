import Joi from '@hapi/joi';

const validateUserSignup = data => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    phone_number: Joi.string().required(),
    password: Joi.string()
      .alphanum()
      .required(),
    confirm_password: Joi.ref('password')
  });

  return schema.validate(data);
};

export default validateUserSignup;
