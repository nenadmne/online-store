const express = require("express");
const { sign } = require("jsonwebtoken");
const router = express.Router();
const db = require("../../data/store");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = req.body.user;

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (user === "administrator") {
      if (user !== existingUser[0].username) {
        return res.status(422).json({
          message: "Invalid credentials.",
          errors: { credentials: "Invalid username or password entered." },
        });
      }
    } else {
      if (
        existingUser.length === 0 ||
        existingUser[0].username === "administrator"
      ) {
        return res.status(422).json({
          message: "Invalid credentials.",
          errors: { credentials: "Invalid username or password entered." },
        });
      }
    }

    const [storedPassword] = await db.query(
      "SELECT password FROM users WHERE username = ?",
      [username]
    );
    const hashedPassword = storedPassword[0].password;

    const passwordValidation = await bcrypt.compare(password, hashedPassword);

    if (!passwordValidation) {
      return res.status(422).json({
        message: "Invalid credentials.",
        errors: { credentials: "Invalid username or password entered." },
      });
    }

    const KEY = "supersecret";
    const token = sign({ username: username }, KEY, { expiresIn: "8h" });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

router.get("/login", async (req, res) => {
  const username = req.query.username;

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
    } else {
      const [userInfo] = await db.query(
        "SELECT informations.name, informations.city, informations.country, informations.age, users.username FROM users INNER JOIN informations ON users.id = informations.user_id WHERE users.id =?",
        [existingUser[0].id]
      );

      if (userInfo.length === 0) {
        const [usernameInfo] = await db.query(
          "SELECT users.username FROM users WHERE users.id =?",
          [existingUser[0].id]
        );
        res.send(usernameInfo);
      } else {
        res.send(userInfo);
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

module.exports = router;
