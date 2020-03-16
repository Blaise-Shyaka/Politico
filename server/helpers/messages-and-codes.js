const codes = {
  badRequest: 400,
  conflict: 409,
  resourceCreated: 201,
  unauthorized: 401,
  okay: 200,
  notFound: 404
};

const messages = {
  userExists: 'You already have an account. Proceed with sign in instead',
  userDoesNotExist: 'You do not have an account on Politico. Sign up instead',
  wrongPassword: 'Either email or password is wrong.'
};

export { codes, messages };
