exports.validateAuthor = (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    next();
};

exports.validateBook = (req, res, next) => {
    const { title, ISBN, authors } = req.body;

    if (!title || !ISBN) {
        return res.status(400).json({ message: "Title and ISBN are required" });
    }

    if (!authors || !Array.isArray(authors) || authors.length === 0) {
        return res.status(400).json({ message: "At least one author ID is required" });
    }

    next();
};

exports.validateBorrow = (req, res, next) => {
    const { studentId, staffId, returnDate } = req.body;

    if (!studentId || !staffId || !returnDate) {
        return res.status(400).json({ message: "studentId, staffId, and returnDate are required" });
    }

    next();
};

exports.validateStudent = (req, res, next) => {
    const { name, email, studentId, password } = req.body;

    if (!name || !email || !studentId || !password) {
        return res.status(400).json({ message: "All fields including password are required" });
    }

    next();
};

exports.validateStaff = (req, res, next) => {
    const { name, email, staffId, password } = req.body;

    if (!name || !email || !staffId || !password) {
        return res.status(400).json({ message: "All fields including password are required" });
    }

    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    next();
};