const express = require("express");
const router = express.Router();
const {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require("../controllers/sweetcontroller");

const { protect, admin } = require("../middleware/authmiddleware");

// Routes
router.post("/", protect, admin, addSweet);
router.get("/", protect, getAllSweets);
router.get("/search", protect, searchSweets);
router.put("/:id", protect, admin, updateSweet);
router.delete("/:id", protect, admin, deleteSweet);
router.post("/:id/purchase", protect, purchaseSweet);
router.post("/:id/restock", protect, admin, restockSweet);

module.exports = router;
