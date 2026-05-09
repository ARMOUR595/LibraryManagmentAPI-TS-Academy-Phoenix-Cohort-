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

router.get("/search/title", searchByTitle);
router.get("/search/author", searchByAuthor);
router.post("/", restrictTo("admin", "librarian"), validateBook,   createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", restrictTo("admin", "librarian"), validateBook,   updateBook);
router.delete("/:id", restrictTo("admin"),              deleteBook);
router.patch("/:id/borrow", restrictTo("admin", "librarian"), validateBorrow, borrowBook);
router.patch("/:id/return", restrictTo("admin", "librarian"), returnBook);

module.exports = router;