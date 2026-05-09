const express = require("express");
const router = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { restrictTo }  = require("../middleware/roleMiddleware");
const { validateBook, validateBorrow } = require("../middleware/validateMiddleware");
const {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    searchByTitle,
    searchByAuthor,
} = require("../controller/bookController");

router.use(protect);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books returned
 *       401:
 *         description: Unauthorized
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - ISBN
 *               - authors
 *             properties:
 *               title:
 *                 type: string
 *                 example: Things Fall Apart
 *               ISBN:
 *                 type: string
 *                 example: 978-0-385-47454-2
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["664f1a2b3c4d5e6f7a8b9c0d"]
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", restrictTo("admin", "librarian"), validateBook, createBook);

/**
 * @swagger
 * /books/{id}/borrow:
 *   patch:
 *     summary: Borrow a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - staffId
 *               - returnDate
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: 664f1a2b3c4d5e6f7a8b9c0d
 *               staffId:
 *                 type: string
 *                 example: 664f1a2b3c4d5e6f7a8b9c0e
 *               returnDate:
 *                 type: string
 *                 example: 2026-06-01
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Book already borrowed
 *       404:
 *         description: Book not found
 */
router.patch("/:id/borrow", restrictTo("admin", "librarian"), validateBorrow, borrowBook);

/**
 * @swagger
 * /books/{id}/return:
 *   patch:
 *     summary: Return a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book has not been borrowed
 *       404:
 *         description: Book not found
 */
router.patch("/:id/return", restrictTo("admin", "librarian"), returnBook);

module.exports = router;