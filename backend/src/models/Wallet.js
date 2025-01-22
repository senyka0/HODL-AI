const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");

const Wallet = sequelize.define(
  "Wallet",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
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
  },
  {
    tableName: "wallets",
    underscored: true,
    timestamps: true,
  }
);

// Define associations
Wallet.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Wallet, { foreignKey: "user_id" });

module.exports = Wallet;
