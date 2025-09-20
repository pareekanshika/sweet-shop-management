const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sweet_shop', 'root', 'root_anshi', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
