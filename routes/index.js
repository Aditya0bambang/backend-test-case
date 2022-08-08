const express = require("express");
const Member = require("./member");
const router = express.Router();
const Book = require("./book");

router.use("/books", Book);
router.use("/members", Member);

module.exports = router;
