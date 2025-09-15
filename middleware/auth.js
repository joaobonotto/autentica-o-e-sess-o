function ensureAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.session.message = { type: 'error', text: 'Você precisa estar logado para acessar essa página.' };
  return res.redirect('/login');
}
module.exports = { ensureAuth };
