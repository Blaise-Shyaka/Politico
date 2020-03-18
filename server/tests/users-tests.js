/* eslint-disable consistent-return */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { codes, messages } from '../helpers/messages-and-codes';
import generateToken from '../helpers/generate-token';

const { should } = chai;

should();
chai.use(chaiHttp);

/* global describe, it, beforeEach */
describe('User creating an account', () => {
  beforeEach(done => setTimeout(done, 500));

  it('should return status 201 and a data object containing new user info', done => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'Daniel',
        lastName: 'Chapelle',
        email: 'danielchapelle@gmail.com',
        phoneNumber: '0788543666',
        password: 'danielpassword',
        confirmPassword: 'danielpassword'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.resourceCreated);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys([
          'id',
          'email',
          'phoneNumber',
          'isAdmin'
        ]);
      });
    done();
  });

  it('should return status 400 if the user input is wrong or incomplete', done => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'Daniel',
        lastName: 'Chapelle',
        password: 'danielpassword',
        phoneNumber: '0788543666',
        confirmPassword: 'danielpassword'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 409 if the user already exists', done => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'Blue',
        lastName: 'west',
        email: 'bluewest@gmail.com',
        password: 'bluepassword',
        phoneNumber: '0785007666',
        confirmPassword: 'bluepassword'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.conflict);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.userExists);
      });
    done();
  });
});

describe('User sign in', () => {
  it('should return status 401, if the password is wrong', done => {
    chai
      .request(app)
      .post('/api/auth/signin')
      .send({
        email: 'bluewest@gmail.com',
        password: 'password'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.wrongPassword);
      });
    done();
  });

  it('should return status 400, if user input is invalid', done => {
    chai
      .request(app)
      .post('/api/auth/signin')
      .send({
        email: 'bluewest@gmail.com'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 200, if a user is successfully logged in', done => {
    chai
      .request(app)
      .post('/api/auth/signin')
      .send({
        email: 'bluewest@gmail.com',
        password: 'bluepassword'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys([
          'token',
          'id',
          'email',
          'phoneNumber',
          'isAdmin'
        ]);
      });
    done();
  });
});

describe('View all political parties', () => {
  const userData = {
    id: 1,
    email: 'user@gmail.com',
    phoneNumber: '0775677899',
    isAdmin: false
  };

  const userToken = generateToken(userData);

  beforeEach(done => setTimeout(done, 500));

  it('should return status 200 and an array of parties', done => {
    chai
      .request(app)
      .get('/api/parties')
      .set('Authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.data.should.be.a('array');
      });
    done();
  });

  it('should return status 401, if wrong or no token was provided', done => {
    chai
      .request(app)
      .get('/api/parties')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.noToken);
      });
    done();
  });
});

describe('View a specific office', () => {
  const userData = {
    id: 1,
    email: 'user@gmail.com',
    phoneNumber: '0775677899',
    isAdmin: false
  };

  const userToken = generateToken(userData);

  beforeEach(done => setTimeout(done, 500));

  it('should return status 200 and an object with office details', done => {
    chai
      .request(app)
      .get('/api/offices/1')
      .set('Authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['id', 'type', 'name']);
      });
    done();
  });

  it('should return status 400 if officeId is not a number', done => {
    chai
      .request(app)
      .get('/api/offices/1dfds')
      .set('Authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.wrongParameterFormat);
      });
    done();
  });

  it('should return status 404 if the office a user is trying to access does not exist', done => {
    chai
      .request(app)
      .get('/api/offices/1000')
      .set('Authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.officeNotFound);
      });
    done();
  });

  it('should return status 401 if no token is provided', done => {
    chai
      .request(app)
      .get('/api/offices/1')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.noToken);
      });
    done();
  });
});
