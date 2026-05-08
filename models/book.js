const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    ISBN:      { type: String, required: true, unique: true },
    authors:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    status:    { type: String, enum: ["IN", "OUT"], default: "IN" },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
    issuedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    issueDate:  { type: Date, default: null },
    returnDate: { type: Date, default: null },
    borrowedAt: { type: Date, default: null },   // new field
},
{ timestamps: true });

module.exports = mongoose.model("Book", bookSchema);