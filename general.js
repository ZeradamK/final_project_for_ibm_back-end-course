const express = require('express');
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
const {sign} = require("jsonwebtoken");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Dummy registration (you'll need to implement a proper registration process)
  users.push({ username, password });
  return res.status(200).json({ message: "Registration successful" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;

  if (!isValid(isbn)) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const bookKeys = Object.keys(books);

  const authorBooks = [];
  bookKeys.forEach(key => {
    const book = books[key];
    if (book.author === author) {
      authorBooks.push(book);
    }
  });

  if (authorBooks.length === 0) {
    return res.status(404).json({ message: `No books found for ${author}` });
  }


  return res.status(200).json(authorBooks);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const bookKeys = Object.keys(books);


  const titleBooks = [];
  bookKeys.forEach(key => {
    const book = books[key];
    if (book.title === title) {
      titleBooks.push(book);
    }
  });

  if (titleBooks.length === 0) {
    return res.status(404).json({ message: `No books found for ${title}` });
  }
  return res.status(200).json(titleBooks);
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json({ reviews: book.reviews });
});

//only registered users can login
public_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Find the user in the users array
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token for the user
  const token = sign({ username: user.username }, "your_secret_key");

  return res.status(200).json({ message: "Login successful", token });
});

public_users.put("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.username; // Assuming username is stored in the session

  if (!isbn || !review || !username) {
    return res.status(400).json({ message: "ISBN, review, and username are required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user already posted a review for this ISBN
  if (book.reviews[username]) {
    book.reviews[username] = review; // Modify existing review
    return res.status(200).json({ message: "Review modified successfully" });
  }

  // Add new review
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

module.exports.general = public_users;

module.exports.general = public_users;
