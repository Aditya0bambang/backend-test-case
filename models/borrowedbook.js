"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BorrowedBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BorrowedBook.belongsTo(models.Book, { foreignKey: "bookId" });
      BorrowedBook.belongsTo(models.Member, { foreignKey: "userId" });
    }
  }
  BorrowedBook.init(
    {
      bookId: DataTypes.INTEGER,
      // references: { model: "Books", key: "id" },
      // onDelete: "cascade",
      // onUpdate: "cascade",

      userId: DataTypes.INTEGER,
      // references: { model: "Members", key: "id" },
      // onDelete: "cascade",
      // onUpdate: "cascade",

      borrowDate: DataTypes.DATE,
      returnDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BorrowedBook",
    }
  );
  return BorrowedBook;
};
