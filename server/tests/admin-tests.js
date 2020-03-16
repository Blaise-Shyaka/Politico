import chai from 'chai';
import chaiHttp from 'chai-http';
import generateToken from '../helpers/generate-token';
import app from '../app';
import { codes, messages } from '../helpers/messages-and-codes';

const { should } = chai;
should();

chai.use(chaiHttp);

/* global describe, it */
describe('Create political party', () => {
  const adminToken = generateToken({
    id: 1,
    email: 'steveng@gmail.com',
    phoneNumber: '0789553666',
    isAdmin: true
  });

  const notAnAdminToken = generateToken({
    id: 2,
    email: 'notAdmin@gmail.com',
    phoneNumber: '0789553666',
    isAdmin: false
  });

  it('should return status 201 if a political party is created successfully', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', adminToken)
      .send({
        name: 'Liberals',
        hq_address: 'New York',
        logo_url: 'http://dummyurl/logos/002'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.resourceCreated);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['id', 'name']);
      });
    done();
  });

  it('should return status 409 if a party already exists', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', adminToken)
      .send({
        name: 'Liberals',
        hq_address: 'New York',
        logo_url: 'http://dummyurl/logos/002'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.conflict);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.partyExists);
      });
    done();
  });

  it('should return status 401, if a user accessing this resource is not an admin', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', notAnAdminToken)
      .send({
        name: 'Liberals',
        hq_address: 'New York',
        logo_url: 'http://dummyurl/logos/002'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.notAllowed);
      });
    done();
  });

  it('should return status 400, if the admin input is invalid', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', adminToken)
      .send({
        name: 'Liberals',
        hq_address: 'New York'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });
});
