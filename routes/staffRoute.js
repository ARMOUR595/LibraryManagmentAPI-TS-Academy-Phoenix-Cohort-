const express = require("express");
const router = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { restrictTo }  = require("../middleware/roleMiddleware");
const { validateStaff } = require("../middleware/validateMiddleware");
const {
    createAttendant,
    getAllAttendants,
   
} = require("../controller/staffController");

router.use(protect);

router.post("/", restrictTo("admin"), validateStaff, createAttendant);
router.get("/", restrictTo("admin", "librarian"), getAllAttendants);


module.exports = router;