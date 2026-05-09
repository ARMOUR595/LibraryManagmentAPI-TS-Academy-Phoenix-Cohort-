const Student = require("../models/student");
const Staff   = require("../models/staff");
const jwt     = require("jsonwebtoken");

const blacklistedTokens = new Set();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email }).select("+password");

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const isMatch = await student.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(student._id, "student");

        return res.status(200).json({
            message: "Login successful",
            token,
            data: {
                id:        student._id,
                name:      student.name,
                email:     student.email,
                studentId: student.studentId,
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;

        const staff = await Staff.findOne({ email }).select("+password");

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        const isMatch = await staff.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(staff._id, staff.role);

        return res.status(200).json({
            message: "Login successful",
            token,
            data: {
                id:      staff._id,
                name:    staff.name,
                email:   staff.email,
                staffId: staff.staffId,
                role:    staff.role,
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.logout = (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        blacklistedTokens.add(token);

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.isBlacklisted = (token) => blacklistedTokens.has(token);

exports.refreshToken = (req, res) => {
    try {
        const token   = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const newToken = generateToken(decoded.id, decoded.role);

        return res.status(200).json({ token: newToken });
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};