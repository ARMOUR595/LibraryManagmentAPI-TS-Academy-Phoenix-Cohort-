const express             = require("express");
const router              = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { restrictTo }  = require("../middleware/roleMiddleware");
const { validateLogin }   = require("../middleware/validateMiddleware");
const { loginStudent, loginStaff, logout, refreshToken } = require("../controller/loginController");

router.post("/student/login", validateLogin, loginStudent);
router.post("/staff/login", validateLogin, loginStaff);
router.post("/logout", protect, logout);
router.post("/refresh-token", protect, refreshToken);

module.exports = router;