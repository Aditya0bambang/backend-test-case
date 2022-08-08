const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controllerBook");

router.get("/", Controller.checkBook);

module.exports = router;
