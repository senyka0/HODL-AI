const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Subscription", function () {
  let Subscription;
  let subscription;
  let MockUSDT;
  let usdt;
  let owner;
  let user1;
  let user2;
  const INITIAL_PRICE = ethers.parseUnits("5", 6);
  const MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    MockUSDT = await ethers.getContractFactory("MockERC20");
    usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.waitForDeployment();

    Subscription = await ethers.getContractFactory("Subscription");
    subscription = await Subscription.deploy(await usdt.getAddress(), INITIAL_PRICE);
    await subscription.waitForDeployment();

    await usdt.mint(user1.address, ethers.parseUnits("1000", 6));
    await usdt.mint(user2.address, ethers.parseUnits("1000", 6));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await subscription.owner()).to.equal(owner.address);
    });

    it("Should set the correct USDT token address", async function () {
      expect(await subscription.usdtToken()).to.equal(await usdt.getAddress());
    });

    it("Should set the initial subscription price", async function () {
      expect(await subscription.subscriptionPrice()).to.equal(INITIAL_PRICE);
    });
  });

  describe("Price Management", function () {
    it("Should allow owner to update price", async function () {
      const newPrice = ethers.parseUnits("10", 6);
      await subscription.setSubscriptionPrice(newPrice);

      expect(await subscription.subscriptionPrice()).to.equal(newPrice);
    });

    it("Should emit PriceUpdated event", async function () {
      const newPrice = ethers.parseUnits("10", 6);
      await expect(subscription.setSubscriptionPrice(newPrice))
        .to.emit(subscription, "PriceUpdated")
        .withArgs(newPrice);
    });

    it("Should not allow non-owner to update price", async function () {
      const newPrice = ethers.parseUnits("10", 6);

      await expect(subscription.connect(user1).setSubscriptionPrice(newPrice))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Subscription Purchase", function () {
    beforeEach(async function () {
      await usdt.connect(user1).approve(subscription.getAddress(), ethers.parseUnits("1000", 6));
    });

    it("Should allow user to purchase subscription", async function () {
      const months = 1;
      await subscription.connect(user1).purchaseSubscription(months);
      
      const expiry = await subscription.subscriptionExpiry(user1.address);
      expect(expiry).to.be.above(Math.floor(Date.now() / 1000));
    });

    it("Should extend existing subscription", async function () {
      await subscription.connect(user1).purchaseSubscription(1);
      const firstExpiry = await subscription.subscriptionExpiry(user1.address);
      await subscription.connect(user1).purchaseSubscription(1);
      const secondExpiry = await subscription.subscriptionExpiry(user1.address);

      expect(secondExpiry).to.be.above(firstExpiry);
      expect(secondExpiry - firstExpiry).to.be.closeTo(MONTH_IN_SECONDS, 5);
    });

    it("Should fail if months is 0", async function () {
      await expect(subscription.connect(user1).purchaseSubscription(0))
        .to.be.revertedWith("Invalid months");
    });

    it("Should fail if insufficient USDT allowance", async function () {
      await usdt.connect(user1).approve(subscription.getAddress(), 0);
      await expect(subscription.connect(user1).purchaseSubscription(1))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });
  });

  describe("Subscription Status", function () {
    it("Should correctly report subscription status", async function () {
      expect(await subscription.checkSubscription(user1.address)).to.be.false;

      await usdt.connect(user1).approve(subscription.getAddress(), ethers.parseUnits("1000", 6));
      await subscription.connect(user1).purchaseSubscription(1);

      expect(await subscription.checkSubscription(user1.address)).to.be.true;
    });
  });

  describe("Fund Management", function () {
    it("Should allow owner to withdraw funds", async function () {
      await usdt.connect(user1).approve(subscription.getAddress(), ethers.parseUnits("1000", 6));
      await subscription.connect(user1).purchaseSubscription(1);

      const initialBalance = await usdt.balanceOf(owner.address);
      await subscription.withdrawFunds();
      const finalBalance = await usdt.balanceOf(owner.address);

      expect(finalBalance - initialBalance).to.equal(INITIAL_PRICE);
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(subscription.connect(user1).withdrawFunds())
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
}); 