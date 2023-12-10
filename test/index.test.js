const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Express App', () => {
  it('should return status 200 on GET /gateways', (done) => {
    chai.request(app)
      .get('/gateways')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return status 200 on GET /gateways/:serialNumber', (done) => {
    chai.request(app)
      .get('/gateways/GW123') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should create a new gateway with status 201 on POST /gateways', (done) => {
    const newGateway = {
      serialNumber: 'GW456',
      name: 'Gateway 2',
      ipAddress: '192.168.1.2',
      devices: [],
    };

    chai.request(app)
      .post('/gateways')
      .send(newGateway)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});
