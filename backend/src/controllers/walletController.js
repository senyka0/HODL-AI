const Wallet = require("../models/Wallet");
const User = require("../models/User");
const WalletHolding = require("../models/WalletHolding");
const Token = require("../models/Token");
const WalletBalance = require("../models/WalletBalance");
const { updateWalletHoldings } = require("../services/walletService");

exports.addWallet = async (req, res) => {
  try {
    const { address } = req.body;

    const existingWallet = await Wallet.findOne({
      where: {
        userId: req.user.id,
        address: address.toLowerCase(),
      },
    });

    if (existingWallet) {
      return res
        .status(400)
        .json({ error: "Wallet already exists for this user" });
    }

    const wallet = await Wallet.create({
      userId: req.user.id,
      address: address.toLowerCase(),
    });

    await updateWalletHoldings(wallet.id);

    res.status(201).json(wallet);
  } catch (error) {
    console.error("Error adding wallet:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getWallets = async (req, res) => {
  try {
    const userAddress = req.user.address.toLowerCase();

    const user = await User.findOne({
      where: { address: userAddress },
      include: [
        {
          model: Wallet,
          include: [
            { model: WalletHolding, include: [Token] },
            { model: WalletBalance },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.Wallets || []);
  } catch (error) {
    console.error("Error getting wallets:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.refreshWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    if (wallet.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await updateWalletHoldings(wallet.id);

    const updatedWallet = await Wallet.findByPk(id, {
      include: [
        { model: WalletHolding, include: [Token] },
        { model: WalletBalance },
      ],
    });

    res.json(updatedWallet);
  } catch (error) {
    console.error("Error refreshing wallet:", error);
    res.status(500).json({ error: error.message });
  }
};
