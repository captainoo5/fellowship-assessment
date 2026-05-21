const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const validateMiddleware = require("../middleware/validateMiddleware");
const { userSchema } = require("../models/user");

router.post("/auth/register", validateMiddleware(userSchema), register);
router.post("/auth/login", validateMiddleware(userSchema), login);

module.exports = router;