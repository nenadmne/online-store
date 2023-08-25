const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const data = [username, hashedPassword];

  try {
    let [existingUser] = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Username already exists. Please choose a different username.",
      });
    }
    await db.query("INSERT INTO users (username, password) VALUES (?)", [data]);
    res.status(200).json({ success: true, message: "Signup successful." });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Signup failed." });
  }
});

module.exports = router;
