// test/apiTest.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // Pastikan ini adalah cara yang benar untuk mengimpor app Anda
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
  it('should verify IMEI on /api/signup/verify-imei POST', function(done) {
    chai.request(server)
      .post('/api/signup/verify-imei')
      .send({ imei: '123456789012345', email: 'test@example.com', password: 'password' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
