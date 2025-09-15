require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const SequelizeStoreFactory = require('connect-session-sequelize');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const SequelizeStore = SequelizeStoreFactory(session.Store);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_change_me',
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
}));

// Roteamento
app.use('/', authRoutes);
app.use('/app', userRoutes);

// página inicial simples
app.get('/', (req, res) => {
  res.render('index', { userId: req.session.userId });
});

sequelize.sync().then(() => {
  console.log('Banco sincronizado com SQLite.');
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
