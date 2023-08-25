const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const bcrypt = require("bcryptjs");
const verifyToken = require("../../auth/verify");

router.get("/user", verifyToken, async (req, res) => {
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
      `SELECT informations.name, informations.city, informations.country, informations.age, users.username 
       FROM users 
       INNER JOIN informations ON users.id = informations.user_id 
       WHERE users.id = ?`,
      [existingUser[0].id]
    );
    const reviewInfo = await db.query(
      `SELECT reviews.*, products.thumbnail FROM reviews 
       INNER JOIN products ON reviews.product_id = products.id 
       WHERE reviews.user_id = ?`,
      [existingUser[0].id]
    );

    if (userInfo.length === 0) {
      const [usernameInfo] = await db.query(
        "SELECT users.username FROM users WHERE users.id =?",
        [existingUser[0].id]
      );
      res.send(usernameInfo);
      return;
    } else {
      res.send({ userInfo, reviewInfo });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

router.delete("/user", verifyToken, async (req, res) => {
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

    await db.query("DELETE FROM users WHERE id = ?", [existingUser[0].id]);
    await db.query("DELETE FROM informations WHERE user_id = ?", [
      existingUser[0].id,
    ]);

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.log("should not be here");
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});

router.put("/user", verifyToken, async (req, res) => {
  const username = req.user.username;
  const { enteredOldPass, enteredNewPass, enteredRepeatedPass } = req.body;

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

    const [storedPassword] = await db.query(
      "SELECT password FROM users WHERE username = ?",
      [username]
    );

    const hashedPassword = storedPassword[0].password;

    if (enteredOldPass && enteredNewPass && enteredRepeatedPass) {
      const passwordValidation = await bcrypt.compare(
        enteredOldPass,
        hashedPassword
      );

      if (!passwordValidation || enteredNewPass !== enteredRepeatedPass) {
        return res.status(422).json({
          message: "Invalid credentials.",
          errors: { credentials: "Invalid username or password entered." },
        });
      }

      const newHashedPassword = await bcrypt.hash(enteredNewPass, 12);

      await db.query(`UPDATE users SET password = ? WHERE id = ?`, [
        newHashedPassword,
        existingUser[0].id,
      ]);

      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully." });
    }

    res.status(400).json({
      message: "Invalid input.",
      errors: {
        input: "All fields are required for password change.",
      },
    });
  } catch (error) {
    console.error("Error during password change:", error);
    res
      .status(500)
      .json({ message: "Password change failed. Please try again later." });
  }
});

module.exports = router;
