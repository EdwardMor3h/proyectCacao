const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geocacao",
  password: "120320abcE",
  port: 5432,
});

module.exports = pool;
