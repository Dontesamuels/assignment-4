// server.js
const express = require('express');
const app = express();
app.use(express.json());

// Default home route
app.get('/', (req, res) => {
  res.send('Welcome to the Books API! Use /api/books to see all books.');
});

// Sample data
let books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "Brave New World", author: "Aldous Huxley" }
];

// GET all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// GET a single book by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

// POST - add new book
app.post('/api/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT - update existing book
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  book.title = req.body.title;
  book.author = req.body.author;
  res.json(book);
});

// DELETE - remove book
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Book not found');
  books.splice(index, 1);
  res.status(204).send();
});

// Optional reset route
app.get('/__reset', (req, res) => {
  books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "Brave New World", author: "Aldous Huxley" }
  ];
  res.send('Reset complete');
});

// Run server
if (require.main === module) {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
} else {
  module.exports = app;
}
