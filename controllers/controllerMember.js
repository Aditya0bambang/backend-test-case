"use strict";

const { Member, BorrowedBook } = require("../models/index");

class Controller {
  static async checkMember(req, res, next) {
    try {
      const allMember = await Member.findAll({
        include: [
          { model: BorrowedBook, required: false, foreignKey: "userId" },
        ],
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      res.status(200).json({
        statusCode: 200,
        allMember,
      });
    } catch (error) {
      //   next(error);
      console.log(error);
    }
  }
}

module.exports = Controller;
