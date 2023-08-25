const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.get("/user/cart", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const [existingUser] = await db.query(
      `SELECT * FROM users WHERE username=?`,
      [user]
    );

    const [items] = await db.query("SELECT * FROM items WHERE user_id ", [
      existingUser[0].id,
    ]);

    const [existingItems] = await db.query(
      "SELECT * FROM bought_products WHERE user_id = ?",
      [existingUser[0].id]
    );

    if (existingItems.length === 0) {
      for (const item of items) {
        await db.query(
          "INSERT INTO bought_products (title, price, thumbnail, amount, user_id) VALUES (?, ?, ?, ?, ?)",
          [
            item.title,
            item.price,
            item.thumbnail,
            item.amount,
            existingUser[0].id,
          ]
        );
      }
      const [boughtItems] = await db.query(
        "SELECT * FROM bought_products WHERE user_id=?",
        [existingUser[0].id]
      );
      res.status(200).json(boughtItems);
    } else {
      res.status(200).json(existingItems);
    }
  } catch (error) {
    console.error("Error deleting items:", error);
    res
      .status(500)
      .json({ message: "Deleting items failed. Please try again later." });
  }
});

router.post("/user/cart", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const id = req.body.productId;
    const [existingUser] = await db.query(
      `SELECT * FROM users WHERE username=?`,
      [user]
    );

    await db.query(
      "UPDATE items SET amount = amount - 1 WHERE user_id = ? AND product_id=?",
      [existingUser[0].id, id]
    );

    const [item] = await db.query(
      "SELECT * FROM items WHERE user_id = ? AND product_id=?",
      [existingUser[0].id, id]
    );

    if (item[0].amount === 0) {
      await db.query("DELETE FROM items WHERE user_id = ? AND product_id=?", [
        existingUser[0].id,
        id,
      ]);
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Deleting product failed. Please try again later." });
  }
});

router.delete("/user/cart", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const [existingUser] = await db.query(
      `SELECT * FROM users WHERE username=?`,
      [user]
    );

    await db.query("DELETE FROM items WHERE user_id = ?", [existingUser[0].id]);
    res.status(200).json({ message: "Items successfully deleted." });
  } catch (error) {
    console.error("Error deleting items:", error);
    res
      .status(500)
      .json({ message: "Deleting items failed. Please try again later." });
  }
});

module.exports = router;
