const express             = require("express");
const router              = express.Router();
const { protect }         = require("../middleware/authMiddleware");
const { restrictTo }      = require("../middleware/roleMiddleware");
const { validateStaff }   = require("../middleware/validateMiddleware");
const { createAttendant, getAllAttendants} = require("../controller/staffController");

router.use(protect);


/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - staffId
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mr. Femi Adeyinka
 *               email:
 *                 type: string
 *                 example: femi.adeyinka@library.com
 *               staffId:
 *                 type: string
 *                 example: STF001
 *               role:
 *                 type: string
 *                 enum: [admin, librarian]
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: Library@1
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Validation error or duplicate email/staffId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", restrictTo("admin"), validateStaff, createAttendant);

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", restrictTo("admin", "librarian"), getAllAttendants);

module.exports = router;