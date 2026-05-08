const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    bio: String,
    createdAt: {type: Date, default: Date.now},
},
{timestamps: true})
module.exports = mongoose.model("Author", authorSchema);