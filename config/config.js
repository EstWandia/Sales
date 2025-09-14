require('dotenv').config();

module.exports = {
  development: {
    username: "root",
    password: "P@ssW0rd",
    database: "students_db",
    host: "localhost",
    dialect: "mysql"
  },

  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },

  production: {
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "mysql"
  }
};

