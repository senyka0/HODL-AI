const hre = require("hardhat");

async function main() {
  const Subscription = await hre.ethers.getContractFactory("Subscription");
  const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const INITIAL_PRICE = hre.ethers.parseUnits("5", 6);
  console.log("Deploying Subscription contract...");
  const subscription = await Subscription.deploy(USDT_ADDRESS, INITIAL_PRICE);
  await subscription.waitForDeployment();
  const address = await subscription.getAddress();
  console.log("Subscription contract deployed to:", address);
  console.log("Waiting for block confirmations...");
  await subscription.deploymentTransaction().wait(6);
  console.log("Verifying contract on Polygonscan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [USDT_ADDRESS, INITIAL_PRICE],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }

  return address;
}

main()

  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
