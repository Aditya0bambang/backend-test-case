const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controllerMember");

router.get("/", Controller.checkMember);
router.post("/borrowBooks/:bookId", Controller.borrowBook);
router.post("/returnBooks/:bookId", Controller.returnBook);

module.exports = router;
