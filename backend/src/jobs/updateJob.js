const { updateAllTokenPrices } = require("../services/tokenService");
const { updateAllWallets } = require("../services/walletService");

async function runUpdateJob() {
  try {
    console.log("Starting update job...");
    await updateAllTokenPrices();
    await updateAllWallets();
    console.log("Update job completed successfully");
  } catch (error) {
    console.error("Error in update job:", error);
  }
}

// setInterval(runUpdateJob, 60 * 60 * 1000);

module.exports = { runUpdateJob };
