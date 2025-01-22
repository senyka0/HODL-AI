const Wallet = require("../models/Wallet");
const WalletHolding = require("../models/WalletHolding");
const WalletBalance = require("../models/WalletBalance");
const Token = require("../models/Token");
const TokenPrice = require("../models/TokenPrice");
const TokenPrediction = require("../models/TokenPrediction");
const { getWalletTokensAllChains } = require("./moralisService");
const { createToken } = require("./tokenService");

async function updateWalletHoldings(walletId) {
  try {
    const wallet = await Wallet.findByPk(walletId);
    if (!wallet) throw new Error("Wallet not found");
    const tokenAddresses = await Token.findAll({
      attributes: ["id", "address"],
    }).then((tokens) =>
      tokens.map((token) => ({
        id: token.id,
        address: token.address,
      }))
    );

    const tokens = await getWalletTokensAllChains(wallet.address);
    const holdings = [];

    for (const tokenData of tokens) {
      let token = tokenAddresses.find((t) => t.address === tokenData.address);
      if (!token) {
        token = await createToken(tokenData);
      }

      holdings.push({
        walletId,
        tokenId: token.id,
        amount: parseFloat(tokenData.balance) / Math.pow(10, token.decimals),
      });
    }

    await WalletHolding.destroy({ where: { walletId } });
    await WalletHolding.bulkCreate(holdings);
    await updateWalletBalance(walletId);
  } catch (error) {
    console.error("Error updating wallet holdings:", error);
    throw error;
  }
}

async function updateWalletBalance(walletId) {
  try {
    const holdings = await WalletHolding.findAll({
      where: { walletId },
      include: [{ model: Token }],
    });

    let lastBalance = 0;
    let prediction24h = 0;
    let prediction7d = 0;
    let prediction30d = 0;

    for (const holding of holdings) {
      const latestPrice = await TokenPrice.findOne({
        where: { tokenId: holding.tokenId },
        order: [["timestamp", "DESC"]],
      });

      if (!latestPrice) continue;

      const predictions = await TokenPrediction.findAll({
        where: { tokenId: holding.tokenId },
        order: [["timestamp", "ASC"]],
      });

      if (predictions.length === 0) continue;

      const amount = holding.amount;
      lastBalance += amount * parseFloat(latestPrice.price);

      // Find predictions at specific intervals
      const pred24h = predictions.find(
        (p) =>
          p.timestamp.getTime() ===
          latestPrice.timestamp.getTime() + 24 * 3600000
      );
      const pred7d = predictions.find(
        (p) =>
          p.timestamp.getTime() ===
          latestPrice.timestamp.getTime() + 7 * 24 * 3600000
      );
      const pred30d = predictions.find(
        (p) =>
          p.timestamp.getTime() ===
          latestPrice.timestamp.getTime() + 30 * 24 * 3600000
      );

      if (pred24h) prediction24h += amount * parseFloat(pred24h.predictedPrice);
      if (pred7d) prediction7d += amount * parseFloat(pred7d.predictedPrice);
      if (pred30d) prediction30d += amount * parseFloat(pred30d.predictedPrice);
    }

    await WalletBalance.upsert({
      walletId,
      totalBalance: lastBalance,
      change24h: prediction24h,
      change7d: prediction7d,
      change30d: prediction30d,
    });
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    throw error;
  }
}

async function updateAllWallets() {
  const wallets = await Wallet.findAll();

  for (const wallet of wallets) {
    try {
      await updateWalletHoldings(wallet.id);
    } catch (error) {
      console.error(`Error updating wallet ${wallet.address}:`, error);
    }
  }
}

module.exports = {
  updateWalletHoldings,
  updateWalletBalance,
  updateAllWallets,
};
