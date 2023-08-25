const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.get("/user/edit", verifyToken, async (req, res) => {
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

    const [user] = await db.query(
      "SELECT informations.name, informations.city, informations.country, informations.age FROM informations INNER JOIN users ON users.id = informations.user_id WHERE users.id =?",
      [existingUser[0].id]
    );
    const [cities] = await db.query(`SELECT * FROM cities`);

    res.send({ user, cities });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

router.put("/user/edit", verifyToken, async (req, res) => {
  "im here";
  const name = req.body.name;
  const age = req.body.age;
  const city = req.body.city;
  const country = req.body.country;
  const username = req.user.username;

  try {
    const [id] = await db.query("SELECT id from users WHERE username = ?", [
      username,
    ]);

    await db.query(
      `UPDATE informations SET name = ?, age = ?, city = ?, country = ? WHERE user_id = ?`,
      [name, age, city, country, id[0].id]
    );

    res
      .status(200)
      .json({ success: true, message: "Information added successfully." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

module.exports = router;
