/* eslint-disable consistent-return */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { codes, messages } from '../helpers/messages-and-codes';

const { should } = chai;

should();
chai.use(chaiHttp);

/* global describe, it */
describe('User creating an account', () => {
  it('should return status 201 and a data object containing new user info', done => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Daniel',
        last_name: 'Chapelle',
        email: 'danielchapelle@gmail.com',
        phone_number: '0788543666',
        password: 'danielpassword',
        confirm_password: 'danielpassword'
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
          'phone_number',
          'is_admin'
        ]);
      });
    done();
  });

  it('should return status 409 if the user already exists', done => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Daniel',
        last_name: 'Chapelle',
        email: 'danielchapelle@gmail.com',
        password: 'danielpassword',
        phone_number: '0788543666',
        confirm_password: 'danielpassword'
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

  it('should return status 400 if the user input is wrong or incomplete', done => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Daniel',
        last_name: 'Chapelle',
        password: 'danielpassword',
        phone_number: '0788543666',
        confirm_password: 'danielpassword'
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
});
