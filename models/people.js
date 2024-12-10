const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const People = sequelize.define(
  "People",
  {
    peopleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    employeeCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "People",
    timestamps: false,
  }
);

module.exports = People;
