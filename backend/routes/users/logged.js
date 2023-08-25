const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.post("/logged", verifyToken, async (req, res) => {
  const data = [req.body.name, req.body.age, req.body.city, req.body.country];
  const username = req.user.username;

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length === 0) {
      return res.status(422).json({
        message: "Invalid credentials.",
        errors: { credentials: "Invalid username or password entered." },
      });
    }

    const [userInfo] = await db.query(
      "SELECT * FROM informations WHERE user_id = ?",
      [existingUser[0].id]
    );

    if (userInfo.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "User information already exists." });
    }

    const [id] = await db.query("SELECT id from users WHERE username = ?", [
      username,
    ]);
    await db.query(
      "INSERT INTO informations (name, age, city, country, user_id) VALUES (?, ?, ?, ?, ?)",
      [...data, id[0].id]
    );
    res
      .status(200)
      .json({ success: true, message: "Information added successfully." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

router.get("/logged", verifyToken, async (req, res) => {
  const username = req.user.username;

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    const [products] = await db.query("SELECT * FROM items WHERE user_id =?", [
      existingUser[0].id,
    ]);

    const [cities] = await db.query("SELECT * FROM cities");

    res.status(200).json({ products, cities });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

module.exports = router;
