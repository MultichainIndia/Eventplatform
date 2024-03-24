const express = require("express");
const router = express();
router.use(express.json());
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
module.exports = router;
