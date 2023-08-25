const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.post("/product/add", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      brand,
      stock,
      category,
      thumbnail,
      images,
    } = req.body;

    await db.query(
      "INSERT INTO products (title, description, price, discount_percentage, rating, stock, brand, category, thumbnail, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        price,
        discount,
        0,
        stock,
        brand,
        category,
        thumbnail,
        images,
      ]
    );

    const item = await db.query("SELECT * FROM products WHERE title=?", [
      title,
    ]);
    res.status(200).json(item);
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

module.exports = router;
