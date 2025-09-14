// config/config.js
import 'dotenv/config';

export default {
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
    use_env_variable: "JAWSDB_URL",  // Heroku automatically sets this
    dialect: "mysql"
  }
};
