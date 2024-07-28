const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Could not create user." });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = new User({
    email,
    password: hashedPassword
  });

  try {
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);
    res.status(200).json({ message: "User signed up successfully." });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { email, password },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Login 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.status(200).send({ token, email: user.email });
});
module.exports = router;