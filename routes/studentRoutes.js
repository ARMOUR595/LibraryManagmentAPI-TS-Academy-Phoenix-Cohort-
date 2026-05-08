const express = require("express");
const router = express.Router();
const {
    createStudent,
    getAllStudents,
    getStudentById,
} = require("../controller/studentConroller");

router.post("/",    createStudent);
router.get("/",     getAllStudents);
router.get("/:id",  getStudentById);

module.exports = router;