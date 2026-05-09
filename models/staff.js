const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const staffSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, "Please provide a valid email address"]
    },
    staffId:  { type: String, required: true, unique: true },
    role:     { type: String, enum: ["librarian", "admin"], default: "librarian" },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [8, "Password must be at least 8 characters"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            "Password must contain an uppercase letter, lowercase letter, number and special character"
        ]
    },
},
{ timestamps: true });

staffSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

staffSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Staff", staffSchema);