const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.createUser({ email, passwordHash });
  }

  static async signIn({ email, password }) {
    // check for existing user
    const existingUser = await User.findByEmail(email);
    if (!existingUser) throw new Error('Invalid email');

    // if user exists, compare hashed passwords
    const doPasswordsMatch = bcrypt.compareSync(
      password,
      existingUser.passwordHash
    );
    if (!doPasswordsMatch) throw new Error('Invalid password');
    // if passwords match, return user
    return existingUser;
  }
};
