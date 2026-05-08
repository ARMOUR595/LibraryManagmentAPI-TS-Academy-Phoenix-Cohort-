const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    staffId:  { type: String, required: true, unique: true },
},
{ timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);