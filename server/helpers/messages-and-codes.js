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
  noPartiesFound: 'There are no parties recorded yet!',
  officeNotFound: 'The office you are trying to access was not found',
  noOfficesFound: 'There are no offices recorded yet!',
  notATypeOfOffice:
    'Wrong type of office. A type of office should be either federal, legislative, state or local government',
  successfullyDeleted: 'The party was successfully deleted',
  partyNotFound: 'The political party you are trying to access does not exist',
  wrongParameterFormat:
    'The parameter is in wrong format. It should be a number',
  candidateNotFound: 'The candidate you are trying to vote for was not found',
  alreadyVoted: 'You have already voted for this office'
};

export { codes, messages };
