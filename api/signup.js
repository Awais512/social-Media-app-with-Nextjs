const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Profile = require('../models/ProfileModel');
const Follower = require('../models/FollowerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const userPng =
  'https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png';
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    if (username.length < 1) return res.status(401).send('Invalid username');
    if (!regexUserName.test(username))
      return res.status(401).send('Invalid username');
    const user = await User.findOne({ username: username.toLowerCase() });
    if (user) return res.status(401).send('Username already in use');
    return res.status(200).send('Available');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { name, email, username, password, bio, facebook, twitter, instagram } =
    req.body.user;

  if (!isEmail(email)) return res.status(401).send('Invalid email');
  if (password.length < 6)
    return res.status(401).send('Password must be at least 6 characters');

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(401).send('User already exists');
    }

    user = new User({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      profilePicUrl: req.body.profilePicUrl || userPng,
    });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
