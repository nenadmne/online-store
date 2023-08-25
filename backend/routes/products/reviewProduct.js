const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.get("/product/review/:id", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const itemId = req.params.id;
    const [item] = await db.query("SELECT * FROM products WHERE id=?", [
      itemId,
    ]);
    const [reviews] = await db.query(
      "SELECT reviews.review, reviews.reviewer_rating, reviews.product_id,reviews.time, users.username, products.* " +
        "FROM reviews " +
        "LEFT JOIN users ON reviews.user_id = users.id " +
        "LEFT JOIN products ON reviews.product_id = products.id"
    );
    res.status(200).json({ user, item, reviews });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      message: "Failed to retrieve products. Please try again later.",
    });
  }
});

router.post("/product/review/:id", verifyToken, async (req, res) => {
  try {
    const user = req.user.username;
    const rating = req.body.rating;
    const review = req.body.review;
    const productId = req.params.id;

    const [existingUser] = await db.query(
      `SELECT id FROM users WHERE username=?`,
      [user]
    );
    const existingUserId = existingUser[0].id;

    const [existingReview] = await db.query(
      `SELECT reviews.* 
       FROM reviews 
       INNER JOIN users ON reviews.user_id = users.id 
       WHERE users.username = ? AND reviews.product_id = ?`,
      [user, productId]
    );

    if (existingReview.length > 0) {
      await db.query(
        `UPDATE reviews SET review=?, reviewer_rating=? WHERE id=?`,
        [review, rating, existingReview[0].id]
      );
      res.status(200).json({ message: "Review updated successfully." });
    } else {
      await db.query(
        `INSERT INTO reviews (review, reviewer_rating, user_id, product_id) VALUES (?, ?, ?, ?)`,
        [review, rating, existingUserId, productId]
      );

      res.status(200).json({ message: "Review submitted successfully." });
    }
  } catch (error) {
    console.error("Error submitting or updating review:", error);
    res.status(500).json({
      message: "Failed to submit or update review. Please try again later.",
    });
  }
});

module.exports = router;
