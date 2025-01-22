const axios = require("axios");

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const SUPPORTED_CHAINS = ["eth", "polygon", "bsc"];

const moralisOptions = {
  headers: {
    accept: "application/json",
    "X-API-Key": MORALIS_API_KEY,
  },
};

async function getWalletTokensAllChains(address) {
  const allTokens = [];

  for (const chain of SUPPORTED_CHAINS) {
    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}`,
        moralisOptions
      );

      if (response.status !== 200) {
        console.error(`Error fetching ${chain} tokens: ${response.statusText}`);
        continue;
      }

      const result = response.data.filter(
        (token) => !token.possible_spam && token.verified_contract
      );
      result.forEach((token) => (token.network = chain));
      allTokens.push(...result);
    } catch (error) {
      console.error(`Error fetching ${chain} tokens:`, error);
    }
  }

  return allTokens;
}

async function getTokenPriceHistory(tokenAddress, chain) {
  try {
    const response = await axios.get(
      `https://deep-index.moralis.io/api/v2.2/pairs/${tokenAddress}/ohlcv?` +
        `chain=${chain}&timeframe=1h&currency=usd&limit=1000&` +
        `toDate=${encodeURIComponent(
          new Date().toISOString()
        )}&fromDate=2015-01-01`,
      moralisOptions
    );

    if (response.status !== 200) {
      console.error(`Error fetching ${chain} prices: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${chain} price history:`, error);
  }
}

module.exports = {
  getWalletTokensAllChains,
  getTokenPriceHistory,
  SUPPORTED_CHAINS,
};
