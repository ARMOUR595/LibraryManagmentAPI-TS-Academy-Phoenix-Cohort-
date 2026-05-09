const jwt             = require("jsonwebtoken");
const Student         = require("../models/student");
const Staff           = require("../models/staff");
const { isBlacklisted } = require("../controller/loginController");

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided" });
        }

        const token = authHeader.split(" ")[1];

        if (isBlacklisted(token)) {
            return res.status(401).json({ message: "Token is invalid. Please login again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === "student") {
            const student = await Student.findById(decoded.id);
            if (!student) {
                return res.status(401).json({ message: "User no longer exists" });
            }
            req.user = student;
            req.role = "student";
        } else {
            const staff = await Staff.findById(decoded.id);
            if (!staff) {
                return res.status(401).json({ message: "User no longer exists" });
            }
            req.user = staff;
            req.role = staff.role;
        }

        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired. Please login again" });
        }
        return res.status(500).json({ message: err.message });
    }
};