const Book = require("../models/book");
const Student = require("../models/student");
const Staff   = require("../models/staff");

exports.createBook = async (req, res) => {
    try {
        const { title, ISBN, authors, returnDate } = req.body;

        const existing = await Book.findOne({ ISBN });

        if (existing) {
            return res.status(400).json({ message: "A book with this ISBN already exists" });
        }

        const book = await Book.create({ title, ISBN, authors, returnDate });

        return res.status(201).json({ message: "Book created", data: book });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
// added pagination here
exports.getAllBooks = async (req, res) => {
    try {
        // get page and limit from query params, set defaults
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip  = (page - 1) * limit;

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        const books = await Book.find()
            .populate("authors", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const today = new Date();

        const booksWithOverdue = books.map(book => {
            const bookObj = book.toObject();

            if (book.status === "OUT" && book.returnDate) {
                const isOverdue  = today > new Date(book.returnDate);
                const overdueDays = isOverdue
                    ? Math.ceil((today - new Date(book.returnDate)) / (1000 * 60 * 60 * 24))
                    : 0;

                bookObj.overdueInfo = { isOverdue, overdueDays };
            } else {
                bookObj.overdueInfo = null;
            }

            return bookObj;
        });

        return res.status(200).json({
            totalBooks,
            totalPages,
            currentPage:  page,
            hasNextPage:  page < totalPages,
            hasPrevPage:  page > 1,
            data:         booksWithOverdue,
        });
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

        // checks if currently borrowed book is overdue
        let overdueInfo = null;
        if (book.status === "OUT" && book.returnDate) {
            const today = new Date();
            const isOverdue = today > new Date(book.returnDate);
            const overdueDays = isOverdue
                ? Math.ceil((today - new Date(book.returnDate)) / (1000 * 60 * 60 * 24))
                : 0;

            overdueInfo = { isOverdue, overdueDays };
        }

        return res.status(200).json({ 
            data: book,
            overdueInfo 
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, ISBN, authors },
            { returnDocument: "after", runValidators: true }
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
// borrowing logic
exports.borrowBook = async (req, res) => {
    try {
        const { studentId, staffId, returnDate } = req.body;

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.status === "OUT") {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        // finds student and staff at the same time
        const [student, staff] = await Promise.all([
            Student.findById(studentId),
            Staff.findById(staffId),
        ]);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        book.status     = "OUT";
        book.borrowedBy = studentId;
        book.issuedBy   = staffId;
        book.issueDate  = new Date();
        book.borrowedAt = new Date();
        book.returnDate = returnDate;

        await book.save();

        return res.status(200).json({
            message: "Book borrowed successfully",
            data: {
                book:       book.title,
                borrowedBy: {
                    name:      student.name,
                    email:     student.email,
                    studentId: student.studentId,
                },
                issuedBy: {
                    name:    staff.name,
                    email:   staff.email,
                    staffId: staff.staffId,
                    role:    staff.role,
                },
                issueDate:  book.issueDate,
                returnDate: book.returnDate,
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// return logic
exports.returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.status === "IN") {
            return res.status(400).json({ message: "Book has not been borrowed" });
        }

        book.returnedAt = new Date();

        // overdue check after book is return
        const isOverdue = book.returnedAt > book.returnDate;
        const overdueDays = isOverdue
            ? Math.ceil((book.returnedAt - book.returnDate) / (1000 * 60 * 60 * 24))
            : 0;

        book.status     = "IN";
        book.borrowedBy = null;
        book.issuedBy   = null;
        book.issueDate  = null;
        book.borrowedAt = null;
        book.returnDate = null;

        await book.save();

        return res.status(200).json({
            message:     "Book returned successfully",
            returnedAt:  book.returnedAt,
            overdue:     isOverdue,
            overdueDays: overdueDays,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
exports.searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const books = await Book.find({
            title: { $regex: title, $options: "i" }
        }).populate("authors");

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found with that title" });
        }

        return res.status(200).json({ total: books.length, data: books });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.searchByAuthor = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: "Author name is required" });
        }

        const books = await Book.find()
            .populate({
                path: "authors",
                match: { name: { $regex: name, $options: "i" } },
            })
            .then(books => books.filter(book => book.authors.length > 0));

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found for that author" });
        }

        return res.status(200).json({ total: books.length, data: books });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};