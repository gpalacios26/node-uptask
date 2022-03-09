const Sequelize = require('sequelize');

const db = new Sequelize('uptask', 'gpalacios', 'Sistemas.26', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: '3306',
  define: {
      timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = db;