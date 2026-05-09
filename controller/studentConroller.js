const Student = require("../models/student");

exports.createStudent = async (req, res) => {
    try {
        const { name, email, studentId, password } = req.body;

        if (!name || !email || !studentId || !password) {
            return res.status(400).json({ message: "All fields including password are required" });
        }

        const existing = await Student.findOne({ $or: [{ email }, { studentId }] });

        if (existing) {
            return res.status(400).json({ message: "Email or studentId already exists" });
        }

        const student = await Student.create({ name, email, studentId, password });

        return res.status(201).json({ message: "Student created", data: student });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        return res.status(200).json({ data: students });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json({ data: student });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};