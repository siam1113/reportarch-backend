const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Member', 'Admin').default('Member'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const resetRequestSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetConfirmSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const nodemailer = require('nodemailer');

exports.signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  console.log(req.body)
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', msg: err });
  }
};

exports.resetPassword = async (req, res) => {
  // Step 1: Request reset link
  if (req.body.email && !req.body.token) {
    const { error } = resetRequestSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
      // Send email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`
      });
      res.json({ message: 'Reset link sent to your email' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send reset link' });
    }
  }
  // Step 2: Confirm password reset
  else if (req.body.token && req.body.password) {
    const { error } = resetConfirmSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      const { token, password } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ error: 'Password reset failed' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request' });
  }
};
