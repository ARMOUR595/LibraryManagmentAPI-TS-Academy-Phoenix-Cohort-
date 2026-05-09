const Staff = require("../models/staff");

exports.createAttendant = async (req, res) => {
    try {
    
        const { name, email, staffId, role, password } = req.body;
        
        const existing = await Staff.create({ name, email, staffId, role, password });
        // checking for duplicates
        if (existing) {
            return res.status(400).json({ message: "Email or staffId already exists" });
        }
        // create document
        const attendant = await Staff.create({ name, email, staffId, role });

        return res.status(201).json({ message: "Attendant created", data: attendant });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllAttendants = async (req, res) => {
    try {
        const attendants = await Staff.find().sort({ createdAt: -1 });

        return res.status(200).json({ data: attendants });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
