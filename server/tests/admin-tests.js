import chai from 'chai';
import chaiHttp from 'chai-http';
import generateToken from '../helpers/generate-token';
import app from '../app';
import { codes, messages } from '../helpers/messages-and-codes';

const { should } = chai;
should();

chai.use(chaiHttp);

/* global describe, it, beforeEach */
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

  beforeEach(done => setTimeout(done, 500));

  it('should return status 201 if a political party is created successfully', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', adminToken)
      .send({
        name: 'Liberals',
        hqAddress: 'New York',
        logoUrl: 'http://dummyurl/logos/002'
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

  it('should return status 401, if a user accessing this resource is not an admin', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', notAnAdminToken)
      .send({
        name: 'One love',
        hqAddress: 'New York',
        logoUrl: 'http://dummyurl/logos/002'
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
        name: 'Patriots',
        logoUrl: 'http://dummyurl/logos/062'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 409 if a party already exists', done => {
    chai
      .request(app)
      .post('/api/parties')
      .set('Authorization', adminToken)
      .send({
        name: 'testParty',
        hqAddress: 'testAddress',
        logoUrl: 'testUrl'
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
});

describe('Create a political office', () => {
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

  beforeEach(done => setTimeout(done, 500));

  it('should return status 201 if a political office is created successfully', done => {
    chai
      .request(app)
      .post('/api/offices')
      .set('Authorization', adminToken)
      .send({
        type: 'Federal',
        name: 'Attorney General'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.resourceCreated);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['id', 'type', 'name']);
      });
    done();
  });

  it('should return status 401 if the user trying to access this route is not an admin', done => {
    chai
      .request(app)
      .post('/api/offices')
      .set('Authorization', notAnAdminToken)
      .send({
        type: 'Federal',
        name: 'Attorney General'
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

  it('should return status 400 on wrong input', done => {
    chai
      .request(app)
      .post('/api/offices')
      .set('Authorization', adminToken)
      .send({
        type: 'Federal'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 400 if the type of office is neither federal, legislative, state nor local government', done => {
    chai
      .request(app)
      .post('/api/offices')
      .set('Authorization', adminToken)
      .send({
        type: 'Anything',
        name: 'Secretary general'
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.notATypeOfOffice);
      });
    done();
  });
});

describe('Deleting a political party', () => {
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

  beforeEach(done => setTimeout(done, 500));
  it('should return status 200, if a party was deleted successfully', done => {
    chai
      .request(app)
      .delete('/api/parties/1')
      .set('Authorization', adminToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.okay);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['message']);
        res.body.data.message.should.equal(messages.successfullyDeleted);
      });
    done();
  });

  it('should return status 400, if the parameter is poorly formatted', done => {
    chai
      .request(app)
      .delete('/api/parties/1yyy')
      .set('Authorization', adminToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 401, if the user trying to access this route is not an admin', done => {
    chai
      .request(app)
      .delete('/api/parties/1')
      .set('Authorization', notAnAdminToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.notAllowed);
      });
    done();
  });

  it('should return status 404, if the party an admin is deleting does not exist', done => {
    chai
      .request(app)
      .delete('/api/parties/1000')
      .set('Authorization', adminToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.partyNotFound);
      });
    done();
  });
});

describe('Registering a user as a candidate', () => {
  const adminToken = generateToken({
    id: 1,
    email: 'stevengerard@gmail.com',
    phoneNumber: '0789553666',
    isAdmin: true
  });

  const notAnAdminToken = generateToken({
    id: 2,
    email: 'notAdmin@gmail.com',
    phoneNumber: '0789553666',
    isAdmin: false
  });

  beforeEach(done => setTimeout(done, 500));

  it('should return status 201, if a user is registered successfully', done => {
    chai
      .request(app)
      .post('/api/office/1/register')
      .set('Authorization', adminToken)
      .send({ party: '1', user: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.resourceCreated);
        res.body.data.should.be.a('object');
        res.body.data.should.include.keys(['office', 'party', 'candidate']);
      });
    done();
  });

  it('should return status 401, if the user trying to access this route is not an admin', done => {
    chai
      .request(app)
      .post('/api/office/1/register')
      .set('Authorization', notAnAdminToken)
      .send({ party: '1', user: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.unauthorized);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.notAllowed);
      });
    done();
  });

  it('should return status 400, if the office ID input is invalid', done => {
    chai
      .request(app)
      .post('/api/office/1aa/register')
      .set('Authorization', adminToken)
      .send({ party: '1', user: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.wrongParameterFormat);
      });
    done();
  });

  it('should return status 400, if the candidate information input is invalid or wrong', done => {
    chai
      .request(app)
      .post('/api/office/1/register')
      .set('Authorization', adminToken)
      .send({ partyId: '1', userId: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.badRequest);
        res.body.error.should.be.a('string');
      });
    done();
  });

  it('should return status 400, if the affiliated party does not exist', done => {
    chai
      .request(app)
      .post('/api/office/1/register')
      .set('Authorization', adminToken)
      .send({ party: '100', user: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.partyNotFound);
      });
    done();
  });

  it('should return status 400, if the user to be registered does not exist', done => {
    chai
      .request(app)
      .post('/api/office/1/register')
      .set('Authorization', adminToken)
      .send({ party: '1', user: '100' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.noUser);
      });
    done();
  });

  it('should return status 400, if office to run for does not exist', done => {
    chai
      .request(app)
      .post('/api/office/100/register')
      .set('Authorization', adminToken)
      .send({ party: '1', user: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.notFound);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.officeNotFound);
      });
    done();
  });

  it('should return status 409, if a candidate is already running for an office', done => {
    chai
      .request(app)
      .post('/api/office/1/register')
      .set('Authorization', adminToken)
      .send({ party: '1', user: '1' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.status.should.be.a('number');
        res.body.status.should.equal(codes.conflict);
        res.body.error.should.be.a('string');
        res.body.error.should.equal(messages.candidateAlreadyExists);
      });
    done();
  });
});
