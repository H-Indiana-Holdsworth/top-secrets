const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs a user up with POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'indy', password: 'testpassword' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'indy' });
  });
});
