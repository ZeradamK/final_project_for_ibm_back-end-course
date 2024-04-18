const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username) => {
  // Minimum and maximum length for the username
  const minLength = 4;
  const maxLength = 20;

  // Regular expression pattern for valid usernames (alphanumeric characters and underscores)
  const usernamePattern = /^[a-zA-Z0-9_]+$/;

  // Check if the username length is within the valid range
  if (username.length < minLength || username.length > maxLength) {
    return false;
  }

  // Check if the username matches the pattern (alphanumeric characters and underscores only)
  if (!usernamePattern.test(username)) {
    return false;
  }

  // Username is considered valid if it passes all checks
  return true;
};


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

// Function to assign ISBN numbers to all existing books
const assignISBNs = () => {
  Object.keys(books).forEach((key, index) => {
    books[key].isbn = index + 1; // Assign the numerical key as the ISBN (assuming numerical keys are used)
  });
};



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews.push(review);

  return res.status(200).json({ message: "Review added successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username; // Assuming username is stored in the session

  if (!isbn || !username) {
    return res.status(400).json({ message: "ISBN and username are required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has posted a review for this ISBN
  if (book.reviews[username]) {
    delete book.reviews[username]; // Delete the review

    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res.status(404).json({ message: "Review not found for the user" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.assignISBNs = assignISBNs;
