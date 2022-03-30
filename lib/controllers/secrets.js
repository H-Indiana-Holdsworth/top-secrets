const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    res.send([
      {
        id: '1',
        title: 'Secret 1',
        description: 'My first secret',
        created_at: '2022-03-30 00:43:12.723336+07',
      },

      {
        id: '2',
        title: 'Secret 2',
        description: 'My second secret',
        created_at: '2022-03-29 00:43:12.723336+07',
      },
    ]);
  } catch (error) {
    next(error);
  }
});
