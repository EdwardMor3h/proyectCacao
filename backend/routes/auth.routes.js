const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SECRET = "geo_cacao_secret";

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const user = result.rows[0];

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
});

module.exports = router;
