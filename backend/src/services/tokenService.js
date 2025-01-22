const Token = require("../models/Token");
const TokenPrice = require("../models/TokenPrice");
const TokenPrediction = require("../models/TokenPrediction");
const { getTokenPriceHistory } = require("./moralisService");

async function createToken(tokenData) {
  try {
    const [token, created] = await Token.findOrCreate({
      where: {
        address: tokenData.token_address,
      },
      defaults: {
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
        network: tokenData.network,
      },
    });

    if (created) {
      await fetchAndStoreInitialPrices(token.id, token.address, token.network);
    }

    return token;
  } catch (error) {
    console.error("Error in createToken:", error);
    throw error;
  }
}

async function updateTokenPrices(tokenId, tokenAddress, chain) {
  const priceHistory = await getTokenPriceHistory(tokenAddress);

  if (priceHistory[chain] && priceHistory[chain].length > 0) {
    const prices = priceHistory[chain].map((item) => ({
      tokenId,
      timestamp: new Date(item.timestamp),
      price: item.close,
    }));

    await TokenPrice.destroy({ where: { tokenId } });
    await TokenPrice.bulkCreate(prices);
    await generatePricePredictions(tokenId);
  }
}

async function fetchAndStoreInitialPrices(tokenId, tokenAddress, chain) {
  const priceHistory = await getTokenPriceHistory(tokenAddress, chain);
  console.log(priceHistory);
  if (priceHistory.length > 0) {
    const prices = priceHistory.map((item) => ({
      tokenId,
      timestamp: new Date(item.timestamp),
      price: item.open,
    }));

    await TokenPrice.bulkCreate(prices);
    // await generatePricePredictions(tokenId);
  }
}

async function generatePricePredictions(tokenId) {
  const prices = await TokenPrice.findAll({
    where: { tokenId },
    order: [["timestamp", "ASC"]],
    raw: true,
  });
}

async function updateAllTokenPrices() {
  const tokens = await Token.findAll();

  for (const token of tokens) {
    try {
      await updateTokenPrices(token.id, token.address, token.network);
    } catch (error) {
      console.error(
        `Error updating prices for token ${token.address} on ${token.network}:`,
        error
      );
    }
  }
}

module.exports = {
  createToken,
  updateAllTokenPrices,
  generatePricePredictions,
};
