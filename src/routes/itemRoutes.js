const express = require("express");
const router = express.Router();
const { createItem, getAllItems, getItemById, deleteItem } = require("../controllers/itemController");
const validateMiddleware = require("../middleware/validateMiddleware");
const { itemSchema } = require("../models/items");
const protectRoute = require("../middleware/authMiddleware");

router.post("/items", validateMiddleware(itemSchema), protectRoute, createItem);
router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.delete("/items/:id", protectRoute, deleteItem);

module.exports = router;
