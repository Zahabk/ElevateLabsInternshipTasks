import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const booksFilePath = path.join(path.resolve(), "books.json");

function getBooks() {
  const data = fs.readFileSync(booksFilePath, "utf-8");
  return JSON.parse(data);
}
function saveBooks(books) {
  const data = fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
}

//get all books
app.get("/books", (req, res) => {
  const allBooks = getBooks();
  return res.json(allBooks);
});

//add new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;

  const books = getBooks();
  const id = books.length + 1;

  if (!title || !author) {
    return res.status(400).json({ error: "All fields required" });
  }

  const newBook = { id, title, author };
  books.push(newBook);
  saveBooks(books);

  return res
    .status(201)
    .json({ message: "Book added successfully", book: newBook });
});

//update book
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;

  const books = getBooks();
  const index = books.findIndex((book) => book.id === parseInt(id));

  if (index === -1) {
    return res.status(401).json({ error: "Book not found" });
  }

  if (title) {
    books[index].title = title;
  }
  if (author) {
    books[index].author = author;
  }

  saveBooks(books);
  return res
    .status(201)
    .json({ message: "Book updated successfully", book: books[index] });
});

//delete book
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  const books = getBooks();
  const index = books.findIndex((book) => book.id === parseInt(id));

  if (index === -1) {
    return res.status(401).json({ error: "Book not found" });
  }

  const deletedBook = books.splice(index,1)[0]

  return res
    .status(201)
    .json({ message: "Book delete successfully", book: books[index] });
});

app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}`);
});
