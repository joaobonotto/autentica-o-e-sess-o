const express = require('express');
const router = express.Router();
const User = require('../models/User');

// páginas de registro e login
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  if (!email || !password || password !== passwordConfirm) {
    return res.render('register', { error: 'Preencha corretamente os campos e certifique-se que as senhas são iguais.' });
  }
  try {
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { password }
    });
    if (!created) {
      return res.render('register', { error: 'Usuário já existe com esse email.' });
    }
    // logar automaticamente
    req.session.userId = user.id;
    return res.redirect('/app/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('register', { error: 'Erro ao registrar. Veja console.' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('login', { error: 'Preencha email e senha.' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.render('login', { error: 'Credenciais inválidas.' });

    const ok = await user.checkPassword(password);
    if (!ok) return res.render('login', { error: 'Credenciais inválidas.' });

    req.session.userId = user.id;
    return res.redirect('/app/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('login', { error: 'Erro ao fazer login.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    res.clearCookie('connect.sid');
    return res.redirect('/');
  });
});

module.exports = router;
