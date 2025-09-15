const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {
  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

User.beforeCreate(async (user, options) => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
});

module.exports = User;
