const Book = require("../models/book");

exports.createBook = async (req, res) => {
    try {
        const { title, ISBN, authors, returnDate } = req.body;

        if (!title || !ISBN) {
            return res.status(400).json({ message: "Title and ISBN are required" });
        }

        if (!authors || !Array.isArray(authors) || authors.length === 0) {
            return res.status(400).json({ message: "At least one author ID is required" });
        }

        const book = await Book.create({ title, ISBN, authors, returnDate });

        return res.status(201).json({ message: "Book created", data: book });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate("authors", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: books });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("authors")
            .populate("borrowedBy")
            .populate("issuedBy");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ data: book });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { title, ISBN, authors } = req.body;

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, ISBN, authors },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book updated", data: book });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: "Book deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.borrowBook = async (req, res) => {
    try {
        const { studentId, staffId, returnDate } = req.body;

        if (!studentId || !staffId || !returnDate) {
            return res.status(400).json({ message: "studentId, staffId, and returnDate are required" });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.status === "OUT") {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        book.status     = "OUT";
        book.borrowedBy = studentId;
        book.issuedBy   = staffId;
        book.issueDate  = new Date();
        book.borrowedAt = new Date();
        book.returnDate = returnDate;

        await book.save();

        return res.status(200).json({ message: "Book borrowed successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};