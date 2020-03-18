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
  wrongPassword: 'Either email or password is wrong.',
  noToken: 'Invalid or no token was provided',
  notAllowed: 'Unauthorized to access this route.',
  partyExists: 'A party registered under that name already exists',
  successfullyDeleted: 'The party was successfully deleted',
  partyNotFound: 'The political party you are trying to access does not exist',
  wrongParameterFormat:
    'The parameter is in wrong format. It should be a number',
  noPartiesFound: 'There are no parties recorded yet!'
};

export { codes, messages };
