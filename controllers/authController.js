const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { compare } = require('bcryptjs');

const format = (user) => {
  const { id, first_name, last_name, email, username } = user;
  return {
    id,
    first_name,
    last_name,
    email,
    username,
    accessToken: generateToken(),
  };
};

const register = async (req, res) => {
  const { first_name, last_name, email, username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email, username },
    });

    if (user) {
      return res.json('User already registered');
    }
  } catch (err) {
    return res.json(err);
  }

  try {
    const user = await User.create({
      first_name,
      last_name,
      email,
      username,
      password,
    });

    return res.json(user);
  } catch (err) {
    return res.json(err);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.json('User not found');
    }

    const match = comparePassword(password, user.password);

    if (match) {
      return res.json(format(user));
    } else {
      return res.json('Wrong Username or Password');
    }
  } catch (err) {
    return res.json(err);
  }
};
module.exports = { register, login };
