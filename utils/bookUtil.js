const { Book } = require('../models/book');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function addResource(req, res) {
    try {
        const { name, shelf_no, category, author } = req.body;

        // Validation checks
        if (!name) return res.status(400).json({ message: 'Name is required' });
        if (!shelf_no || isNaN(Number(shelf_no))) return res.status(400).json({ message: 'Shelf number must be a valid number' });
        if (!category) return res.status(400).json({ message: 'Category is required' });
        if (!author) return res.status(400).json({ message: 'Author is required' });

        // Read existing books to check for duplicates
        const allBooks = await readJSON('utils/book.json');
        const isDuplicate = allBooks.some(book => 
            book.name === name && 
            book.shelf_no === String(shelf_no) && 
            book.category === category && 
            book.author === author
        );

        if (isDuplicate) {
            return res.status(400).json({ message: 'Book already exists' });
        }

        // Create new book
        const newBook = {
            name,
            shelf_no: String(shelf_no),
            category,
            author,
            id: Date.now().toString()
        };

        // Write to the books JSON file
        const updatedBooks = await writeJSON(newBook, 'utils/book.json');
        return res.status(201).json(updatedBooks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewResources(req, res) {
    try {
        const allResources = await readJSON('utils/book.json');
        return res.status(201).json(allResources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addResource, viewResources, 
};