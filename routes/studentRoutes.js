const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { validateStudent } = require("../middleware/validateMiddleware");
const {
    createStudent,
    getAllStudents,
    getStudentById,
} = require("../controller/studentConroller");

router.use(protect);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
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
 *               - studentId
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Emeka Okafor
 *               email:
 *                 type: string
 *                 example: emeka.okafor@student.edu
 *               studentId:
 *                 type: string
 *                 example: STU001
 *               password:
 *                 type: string
 *                 example: Library@1
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error or duplicate email/studentId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/",   restrictTo("admin", "librarian"), validateStudent, createStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/",    restrictTo("admin", "librarian"), getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a single student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 */
router.get("/:id", getStudentById);


module.exports = router;