const express = require('express');
const router = express.Router();
const User = require('../models/User');

// middleware de proteção
function ensureAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/login');
}

router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, { attributes: ['id','email','createdAt'] });
    res.render('dashboard', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// rota de exemplo para ver todos os usuários (apenas para dev)
router.get('/users', ensureAuth, async (req, res) => {
  const users = await User.findAll({ attributes: ['id','email','createdAt'] });
  res.send(users);
});

module.exports = router;
