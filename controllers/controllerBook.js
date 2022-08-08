"use strict";

const { Book } = require("../models/index");

class Controller {
  static async checkBook(req, res, next) {
    try {
      const availableBook = await Book.findAll({
        where: { stock: 1 },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      res.status(200).json({
        statusCode: 200,
        availableBook,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
