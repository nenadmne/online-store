const express = require("express");
const router = express.Router();
const db = require("../../data/store.js");
const verifyToken = require("../../auth/verify");

router.get("/admin/orders", verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT bought_products.*, users.username FROM bought_products INNER JOIN users ON bought_products.user_id = users.id"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

router.post("/admin/orders", verifyToken, async (req, res) => {
  const id = req.body.id;

  try {
    const [users] = await db.query(
      "SELECT * FROM bought_products WHERE user_id=?",
      [id]
    );

    if (users.length > 0) {
      for (const item of users) {
        await db.query(
          "INSERT INTO confirmed_orders (title, price, amount, user_id, thumbnail) VALUES (?, ?, ?, ?, ?)",
          [item.title, item.price, item.amount, item.user_id, item.thumbnail]
        );
      }

      await db.query("DELETE FROM bought_products WHERE user_id=?", [id]);

      res.status(200).json({ message: "Orders confirmed successfully." });
    } else {
      res
        .status(404)
        .json({ message: "No orders found for the specified user." });
    }
  } catch (error) {
    console.error("Error processing orders:", error);
    res
      .status(500)
      .json({ message: "Error processing orders. Please try again later." });
  }
});

router.delete("/admin/orders", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    await db.query("DELETE FROM bought_products WHERE user_id=?", [id]);
    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res
      .status(500)
      .json({ message: "Deleting item failed. Please try again later." });
  }
});

module.exports = router;
