const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// mock user for tests
const mockUser = {
  email: 'indy@m.com',
  password: 'testpassword',
};

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs a user up with POST', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);

    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('logs in a user', async () => {
    const user = await UserService.create({
      email: 'yeet@m.com',
      password: '12345',
    });

    const res = await request(app).post('/api/v1/users/sessions').send({
      email: 'yeet@m.com',
      password: '12345',
    });

    expect(res.body).toEqual({ message: 'Signed in successfully!', user });
  });

  it('logs out a user', async () => {
    await UserService.create({ email: 'indy@m.com', password: 'testpassword' });

    const res = await request(app).delete('/api/v1/users/sessions');

    expect(res.body.message).toEqual('Signed out successfully');
  });

  it.only('gets a list of secrets if signed in', async () => {
    // No user signed in should get an error
    const agent = request.agent(app);
    await UserService.create({ email: 'indy@m.com', password: 'testpassword' });

    let res = await agent.get('/api/v1/secrets');

    expect(res.status).toEqual(401);

    // User signed in should get the list of secrets

    await agent
      .post('/api/v1/auth/sessions')
      .send({ email: 'indy@m.com', password: 'testpassword' });
    res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual([secret1, secret2]);
    expect(res.status).toEqual(200);
  });
});
