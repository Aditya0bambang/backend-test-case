"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penalty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Penalty.belongsTo(models.Member, { foreignKey: "userId" });
    }
  }
  Penalty.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        // references: { model: "Members", key: "id" },
        // onDelete: "cascade",
        // onUpdate: "cascade",
      },
      durationDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Penalty",
    }
  );
  return Penalty;
};
