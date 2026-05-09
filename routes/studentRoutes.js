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

router.post("/", restrictTo("admin", "librarian"), validateStudent, createStudent);
router.get("/", restrictTo("admin", "librarian"), getAllStudents);
router.get("/:id", getStudentById);

module.exports = router;