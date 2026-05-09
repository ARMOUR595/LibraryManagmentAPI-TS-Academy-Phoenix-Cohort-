const express             = require("express");
const router              = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { restrictTo }  = require("../middleware/roleMiddleware");
const { validateLogin }   = require("../middleware/validateMiddleware");
const { loginStudent, loginStaff, logout, refreshToken } = require("../controller/loginController");

/**
 * @swagger
 * /login/student/login:
 *   post:
 *     summary: Student login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: emeka.okafor@student.edu
 *               password:
 *                 type: string
 *                 example: Library@1
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Student not found
 */
router.post("/student/login", validateLogin, loginStudent);

/**
 * @swagger
 * /login/staff/login:
 *   post:
 *     summary: Staff login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: femi.adeyinka@library.com
 *               password:
 *                 type: string
 *                 example: Library@1
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Staff not found
 */
router.post("/staff/login", validateLogin, loginStaff);

/**
 * @swagger
 * /login/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: No token provided
 */
router.post("/logout", protect, logout);

/**
 * @swagger
 * /login/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New token returned
 *       401:
 *         description: Invalid or expired token
 */
router.post("/refresh-token", protect, refreshToken);

module.exports = router;