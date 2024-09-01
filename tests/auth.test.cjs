
  const chai = require('chai');
  const chaiHttp =  require('chai-http');
  const { expect } = chai;

  chai.use(chaiHttp.default); 

  const app =  require('../app.js'); 
  const User =  require('../models/user.js');
  const jwt =  require('jsonwebtoken');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await chai.request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword'
    });
    expect(res).to.have.status(201);
    expect(res.text).to.equal('User registered');
  });

  it('should login a user and return a token', async () => {
    await new User({ username: 'testuser', password: 'testpassword' }).save();
    const res = await chai.request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'testpassword'
    });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
  });
});

