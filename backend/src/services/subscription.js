const { ethers } = require("ethers");
const subscriptionAbi = require("./../contracts/Subscription.json");

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  subscriptionAbi.abi,
  provider
);

exports.checkSubscription = async (address) => {
  try {
    const isSubscribed = await contract.checkSubscription(address);
    const expiry = parseInt(await contract.subscriptionExpiry(address));
    const currentTime = Math.floor(Date.now() / 1000);

    if (!isSubscribed || expiry <= currentTime) {
      return {
        type: "free",
        expiry: null,
      };
    }

    return {
      type: "pro",
      expiry: new Date(expiry * 1000).toISOString(),
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return {
      type: "free",
      expiry: null,
    };
  }
};
