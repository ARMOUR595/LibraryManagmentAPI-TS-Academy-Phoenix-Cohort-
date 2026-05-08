const Author = require("../models/author");

exports.createAuthor = async (req, res) => {
    try {
        const { name, bio } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const author = await Author.create({ name, bio });

        return res.status(201).json({ message: "Author created", data: author });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find().sort({ createdAt: -1 });

        return res.status(200).json({ data: authors });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        return res.status(200).json({ data: author });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        const { name, bio } = req.body;

        const author = await Author.findByIdAndUpdate(
            req.params.id,
            { name, bio },
            { new: true, runValidators: true }
        );

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        return res.status(200).json({ message: "Author updated", data: author });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        return res.status(200).json({ message: "Author deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};