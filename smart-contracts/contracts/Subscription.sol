// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Subscription is Ownable, ReentrancyGuard {
    IERC20 public usdtToken;
    uint256 public subscriptionPrice;
    
    mapping(address => uint256) public subscriptionExpiry;
    
    event SubscriptionPurchased(address user, uint256 months, uint256 expiryDate);
    event PriceUpdated(uint256 newPrice);
    
    constructor(address _usdtToken, uint256 _initialPrice) {
        usdtToken = IERC20(_usdtToken);
        subscriptionPrice = _initialPrice;
    }
    
    function setSubscriptionPrice(uint256 _newPrice) external onlyOwner {
        subscriptionPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }
    
    function purchaseSubscription(uint256 months) external nonReentrant {
        require(months > 0, "Invalid months");
        uint256 totalPrice = subscriptionPrice * months;
        
        require(usdtToken.transferFrom(msg.sender, address(this), totalPrice), 
                "Transfer failed");
        
        uint256 newExpiry;
        if (subscriptionExpiry[msg.sender] > block.timestamp) {
            newExpiry = subscriptionExpiry[msg.sender] + (months * 30 days);
        } else {
            newExpiry = block.timestamp + (months * 30 days);
        }
        
        subscriptionExpiry[msg.sender] = newExpiry;
        emit SubscriptionPurchased(msg.sender, months, newExpiry);
    }
    
    function withdrawFunds() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(usdtToken.transfer(owner(), balance), "Transfer failed");
    }
    
    function checkSubscription(address user) external view returns (bool) {
        return subscriptionExpiry[user] > block.timestamp;
    }
}