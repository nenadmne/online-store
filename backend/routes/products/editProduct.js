const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.get("/product/edit/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [existingItem] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existingItem.length === 0) {
      return res.status(422).json({
        message: "Invalid request.",
      });
    }
    const [itemInfo] = await db.query("SELECT * FROM products WHERE id = ?", [
      existingItem[0].id,
    ]);

    res.send(itemInfo);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Product update failed. Please try again later.",
    });
  }
});

module.exports = router;

router.put("/product/edit/:id", verifyToken, async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      price,
      discount_percentage,
      brand,
      stock,
      category,
      thumbnail,
      images,
    } = req.body;

    const [existingItem] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (existingItem) {
      await db.query(
        `UPDATE products SET title = ?, description = ?, price = ?, discount_percentage = ?, brand = ?, stock = ?, category = ?, thumbnail = ?, images = ? WHERE id = ?`,
        [
          title,
          description,
          price,
          discount_percentage,
          brand,
          stock,
          category,
          thumbnail,
          images,
          id,
        ]
      );

      res.sendStatus(200);
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
});
