const express = require("express");
const router = express.Router();
const {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
} = require("../controller/bookController");

router.post("/",            createBook);
router.get("/",             getAllBooks);
router.get("/:id",          getBookById);
router.put("/:id",          updateBook);
router.delete("/:id",       deleteBook);
router.patch("/:id/borrow", borrowBook);

module.exports = router;