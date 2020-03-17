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

describe('Viewing a specific political party', () => {
  const userToken = generateToken({
    id: 1,
    email: 'bluewest@gmail.com',
    phoneNumber: '0785007666',
    isAdmin: false
  });

  beforeEach(done => setTimeout(done, 500));

  it('should return status 200, if a political party exists', done => {
    chai
      .request(app)
      .get('/api/parties/1')
      .set('Authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'data']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['id', 'name', 'logoUrl']);
      });
    done();
  });

  it('should return status 401, if wrong or no token was provided', done => {
    chai
      .request(app)
      .get('/api/parties/1')
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

  it('should return status 404, if the party does not exist', done => {
    chai
      .request(app)
      .get('/api/parties/1000')
      .set('Authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.include.keys(['status', 'error']);
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.partyNotFound);
      });
    done();
  });

  it('should return status 400, if the parameter is not a number', done => {
    chai
      .request(app)
      .get('/api/parties/abc')
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
});
