const express = require("express");
const router = express.Router();
const db = require("../../data/store");
const verifyToken = require("../../auth/verify");

router.get("/admin/users", verifyToken, async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users WHERE username <> ?", [
      "administrator",
    ]);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

router.post("/admin/users", verifyToken, async (req, res) => {
  const searchedUser = req.body.search;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username <> ?", [
      "administrator",
    ]);

    let filteredUsers = users;
    if (searchedUser !== "") {
      filteredUsers = users.filter((user) => {
        return user.username.includes(searchedUser);
      });
    }
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

router.delete("/admin/users", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    await db.query("DELETE FROM users WHERE id=?", [id]);
    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Adding item failed. Please try again later." });
  }
});

module.exports = router;
