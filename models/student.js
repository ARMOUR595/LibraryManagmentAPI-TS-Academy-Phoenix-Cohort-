const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    // createdAt is added automatically by timestamps: true
},
{ timestamps: true });

module.exports = mongoose.model("Student", studentSchema);