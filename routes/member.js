const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controllerMember");

router.get("/", Controller.checkMember);

module.exports = router;
