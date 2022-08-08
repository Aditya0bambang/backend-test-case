"use strict";

const { Book, Member, BorrowedBook, Penalty } = require("../models/index");

class Controller {
  static async checkMember(req, res, next) {
    try {
      const allMember = await Member.findAll({
        include: [
          { model: BorrowedBook, required: false, foreignKey: "userId" },
        ],
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      allMember.forEach((person, index) => {
        allMember[index].dataValues.BorrowedBooks =
          allMember[index].BorrowedBooks.length;
      });
      res.status(200).json({
        statusCode: 200,
        allMember,
      });
    } catch (error) {
      next(error);
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
      } else if (user.BorrowedBooks.length >= 2) {
        throw new Error("This user already borrow two books");
      }

      const isPenaltized = await Penalty.findOne({ where: { userId: id } });
      if (isPenaltized) {
        let time = new Date();
        let checkDuration = Math.ceil(
          Math.abs(time.getTime() - isPenaltized.durationDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (checkDuration < 4) {
          throw new Error("This user is not allowed to borrow for 3 days");
        } else {
          let isOver = await Penalty.destroy({ where: { userId: id } });
        }
      }
      const book = await Book.findByPk(bookId);
      if (book.stock === 0) {
        throw new Error("Book is already been borrowed");
      }
      const borrow = await BorrowedBook.create({
        bookId: bookId,
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
      next(error);
    }
  }

  static async returnBook(req, res, next) {
    try {
      const bookId = req.params.bookId;
      const { id, name } = req.body;
      const user = await Member.findByPk(id, {
        where: { name },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isBorrowed = await BorrowedBook.findOne({
        where: { bookId, userId: id },
      });
      if (!isBorrowed) {
        throw new Error(`The book is not borrowed by ${user.name}`);
      }
      let time = new Date();
      let checkDuration = Math.ceil(
        Math.abs(time.getTime() - isBorrowed.borrowDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (checkDuration > 7) {
        let date = new Date(time.setDate(time.getDate() + 3));
        const penaltized = Penalty.create({
          userId: id,
          durationDate: date,
        });
      }
      let returned = await BorrowedBook.destroy({ where: { bookId } });
      const bookReturned = await Book.update(
        {
          stock: 1,
        },
        { where: { id: bookId } }
      );
      res.status(201).json({
        statusCode: 201,
        message: "Book Returned",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
