const express = require("express");
const router = express.Router();
const {
    createAttendant,
    getAllAttendants,
} = require("../controller/staffController");

router.post("/",    createAttendant);
router.get("/",     getAllAttendants);

module.exports = router;