const express = require('express');
const router  = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/books', (req, res, next) => {
  Book.find()
    .then(books => {
      res.render("books", {books});
    })
    .catch(error => {
      console.log(error)
    })
});

router.get("/books/add", (req, res, next)=>{
  res.render("book-add")
})

router.post("/books/add", (req, res, next) =>{
  const { title, author, description, rating } = req.body;
  const newBook = new Book({title, author, description, rating});
  newBook.save()
  .then( book => { 
    res.redirect("/books")
  }).catch(err => {
    next(err)
  });
})

router.get("/books/edit", (req, res) =>{
  Book.findOne({"_id" : req.query.book_id})
  .then(book =>{
    res.render("book-edit", { book })
  })
  .catch( err => console.log(err))
})


router.post('/books/edit', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  let bookId = req.query.book_id
  Book.update({"_id": bookId}, { $set: {title, author, description, rating }}, {new: true})
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    next(error)
  })
});

router.get("/authors/add", (req, res, next) =>{
  res.render("author-add")
})

router.post("/authors/add", (req, res, next )=>{
  const {name, lastName, nationality, birthday, pictureUrl} = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl});
  newAuthor.save()
    .then(book =>{
      res.redirect("/books")
    })
    .catch(err => next(err));
})

router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update({ _id: req.query.book_id }, { $push: { reviews: { user, comments }}})
  .then(book => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});

router.get('/book/:id', (req, res)=>{
  let bookId = req.params.id
  Book.findOne({'_id': bookId})
  .populate("author")
  .then((book)=>{
    res.render('book-detail', { book })
  })
  .catch((err)=>{
    console.log(err);
  })
})

module.exports = router;
