import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useSubscriptionPrice = () => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
        const contractAbi = [
          "function subscriptionPrice() view returns (uint256)",
        ];
        const contract = new ethers.Contract(
          "0xF0A79Bf87d0C535a8F38DdB7dD5C84eA4A832d7B",
          contractAbi,
          provider
        );

        const priceWei = await contract.subscriptionPrice();
        const priceEther = ethers.formatUnits(priceWei, 6);
        setPrice(priceEther);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subscription price:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  return { price, loading, error };
};
