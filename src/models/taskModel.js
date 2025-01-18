const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("TODO", "IN_PROGRESS", "COMPLETED"),
      defaultValue: "TODO",
    },
  },
  {
    timestamps: true,
  }
);

Task.associate = (models) => {
  Task.belongsTo(models.User);
};
module.exports = Task;
