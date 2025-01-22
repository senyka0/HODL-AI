const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Wallet = require("./Wallet");

const WalletBalance = sequelize.define(
  "WalletBalance",
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
    totalBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "total_balance",
    },
    change24h: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "change_24h",
    },
    change7d: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "change_7d",
    },
    change30d: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "change_30d",
    },
  },
  {
    tableName: "wallet_balances",
    underscored: true,
    timestamps: true,
  }
);

// Define associations
WalletBalance.belongsTo(Wallet, { foreignKey: "wallet_id" });
Wallet.hasMany(WalletBalance, { foreignKey: "wallet_id" });

module.exports = WalletBalance;
