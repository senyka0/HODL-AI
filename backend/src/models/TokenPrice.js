const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Token = require("./Token");

const TokenPrice = sequelize.define(
  "TokenPrice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tokenId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "token_id",
      references: {
        model: Token,
        key: "id",
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "token_prices",
    underscored: true,
    timestamps: true,
  }
);

// Define associations
TokenPrice.belongsTo(Token, { foreignKey: "token_id" });
Token.hasMany(TokenPrice, { foreignKey: "token_id" });

module.exports = TokenPrice;
