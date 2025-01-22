const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Wallet = require("./Wallet");
const Token = require("./Token");

const WalletHolding = sequelize.define(
  "WalletHolding",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "wallet_id",
      references: {
        model: Wallet,
        key: "id",
      },
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "wallet_holdings",
    underscored: true,
    timestamps: true,
  }
);

// Define associations
WalletHolding.belongsTo(Wallet, { foreignKey: "wallet_id" });
WalletHolding.belongsTo(Token, { foreignKey: "token_id" });
Wallet.hasMany(WalletHolding, { foreignKey: "wallet_id" });
Token.hasMany(WalletHolding, { foreignKey: "token_id" });

module.exports = WalletHolding;
