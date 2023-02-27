const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("storeDb", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "storeSDb.sqlite"),
});

module.exports = { sequelize };
