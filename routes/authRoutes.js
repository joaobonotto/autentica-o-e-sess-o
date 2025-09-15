const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register', { error: null, message: req.session.message });
  req.session.message = null;
});

router.post('/register', async (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  if (!email || !password || password !== passwordConfirm) {
    return res.render('register', { error: 'Preencha os campos corretamente.', message: null });
  }
  try {
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { password }
    });
    if (!created) {
      return res.render('register', { error: 'Usuário já existe.', message: null });
    }
    req.session.userId = user.id;
    req.session.message = { type: 'success', text: 'Conta criada com sucesso!' };
    return res.redirect('/app/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('register', { error: 'Erro ao registrar.', message: null });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: null, message: req.session.message });
  req.session.message = null;
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('login', { error: 'Preencha email e senha.', message: null });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.render('login', { error: 'Credenciais inválidas.', message: null });

    const ok = await user.checkPassword(password);
    if (!ok) return res.render('login', { error: 'Credenciais inválidas.', message: null });

    req.session.userId = user.id;
    req.session.message = { type: 'success', text: 'Login realizado com sucesso!' };
    return res.redirect('/app/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('login', { error: 'Erro ao fazer login.', message: null });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    res.clearCookie('connect.sid');
    return res.redirect('/');
  });
});

module.exports = router;
