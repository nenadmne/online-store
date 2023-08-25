const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.get("/", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      message: "Failed to retrieve products. Please try again later.",
    });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Deleting product failed. Please try again later." });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const id = req.body.productId;

    const [existingUser] = await db.query(
      `SELECT id FROM users WHERE username=?`,
      [user]
    );

    const [item] = await db.query("SELECT * FROM products WHERE id=?", [id]);

    const [existingItem] = await db.query(
      "SELECT * FROM items WHERE user_id = ? AND product_id=?",
      [existingUser[0].id, id]
    );

    if (existingItem.length > 0) {
      await db.query(
        "UPDATE items SET amount = amount + 1 WHERE user_id = ? AND product_id=?",
        [existingUser[0].id, id]
      );
      const [updatedItem] = await db.query(
        "SELECT * FROM items WHERE user_id = ? AND product_id=?",
        [existingUser[0].id, id]
      );

      return res.status(200).json(updatedItem);
    }

    await db.query(
      "INSERT INTO items (title, description, price, thumbnail, amount, user_id, product_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        item[0].title,
        item[0].description,
        item[0].price,
        item[0].thumbnail,
        1,
        existingUser[0].id,
        id,
      ]
    );

    const [cartItem] = await db.query(
      "SELECT * FROM items WHERE user_id = ? AND product_id=?",
      [existingUser[0].id, id]
    );

    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart. Please try again later." });
  }
});

module.exports = router;
