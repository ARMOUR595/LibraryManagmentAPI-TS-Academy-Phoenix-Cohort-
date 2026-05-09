const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, "Please provide a valid email address"]
    },
    studentId: { type: String, required: true, unique: true },
    password:  {
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

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

studentSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);