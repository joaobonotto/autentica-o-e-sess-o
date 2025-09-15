const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuth } = require('../middleware/auth');

router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, { attributes: ['id','email','createdAt'] });
    res.render('dashboard', { user, message: req.session.message });
    req.session.message = null;
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.get('/users', ensureAuth, async (req, res) => {
  const users = await User.findAll({ attributes: ['id','email','createdAt'] });
  res.send(users);
});

module.exports = router;
