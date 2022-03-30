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
});
