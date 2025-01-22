const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEthereumAddress: (value) => {
          if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
            throw new Error("Invalid Ethereum address");
          }
        },
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["polygon", "bsc", "eth"]],
      },
    },
  },
  {
    tableName: "tokens",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Token;
