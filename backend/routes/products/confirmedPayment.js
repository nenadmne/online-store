const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.delete("/user/cart/confirmed-payment", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const [existingUser] = await db.query(
      `SELECT id FROM users WHERE username=?`,
      [user]
    );

    await db.query("DELETE FROM bought_products WHERE user_id=?", [
      existingUser[0].id,
    ]);

    const products = await db.query(
      "SELECT * FROM bought_products WHERE user_id=?",
      [existingUser[0].id]
    );

    res.status(200).json(products);
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

router.get("/user/cart/confirmed-payment", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const [existingUser] = await db.query(
      `SELECT id FROM users WHERE username=?`,
      [user]
    );

    const [products] = await db.query(
      "SELECT * FROM confirmed_orders WHERE user_id=?",
      [existingUser[0].id]
    );

    res.status(200).json(products);
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

module.exports = router;
