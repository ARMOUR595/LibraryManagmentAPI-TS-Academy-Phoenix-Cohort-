const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { validateAuthor } = require("../middleware/validateMiddleware");
const {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
} = require("../controller/authorController");

router.use(protect);

router.post("/", restrictTo("admin", "librarian"), validateAuthor, createAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", restrictTo("admin", "librarian"), validateAuthor, updateAuthor);
router.delete("/:id", restrictTo("admin"), deleteAuthor);

module.exports = router;