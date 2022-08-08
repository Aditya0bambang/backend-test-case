"use strict";

const { Book, Member, BorrowedBook, Penalty } = require("../models/index");

class Controller {
  static async checkMember(req, res) {
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
  static async borrowBook(req, res, next) {
    try {
      const bookId = req.params.bookId;
      const { id, name } = req.body;
      const user = await Member.findByPk(id, {
        where: { name },
        include: [
          { model: BorrowedBook, required: false, foreignKey: "userId" },
        ],
      });

      if (!user) {
        throw new Error("User not found");
      } else if (user.BorrowedBook.length > 2) {
        throw new Error("This user already borrow two books");
      }

      const isPenaltized = await Penalty.findOne({ where: { userId: id } });
      if (isPenaltized) {
        let time = new Date();
        let checkDuration = Math.ceil(
          Math.abs(time.getTime() - isPenaltized.durationDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        // console.log(checkDuration);
        if (checkDuration < 4) {
          throw new Error("This user is not allowed to borrow for 3 days");
        } else {
          let isOver = await Penalty.destroy({ where: { userId: id } });
        }
      }
      //   if (Object.keys(user).length === 0) {
      //     console.log(user);
      //     throw new Error("User not found");
      //   }
      const book = await Book.findByPk(bookId);
      //   console.log(req.params);
      if (book.stock === 0) {
        throw new Error("Book is already been borrowed");
      }
      const borrow = await BorrowedBook.create({
        bookId: id,
        userId: user.id,
        borrowDate: new Date(),
      });
      const bookBorrowed = await Book.update(
        {
          stock: 0,
        },
        { where: { id: bookId } }
      );
      res.status(201).json({
        statusCode: 201,
        message: "Book Borrowed",
        borrowed: {
          title: book.title,
          member: name,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        statusCode: 500,
        error: error.message,
        // errors,
      });
    }
  }
}

module.exports = Controller;
