import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useSubscriptionPrice } from "../../hooks/useSubscriptionPrice";

const POLYGON_CHAIN_ID = "0x89";
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const CONTRACT_ADDRESS = "0xF0A79Bf87d0C535a8F38DdB7dD5C84eA4A832d7B";

export const UpgradeModal = ({ isOpen, onClose }) => {
  const [months, setMonths] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const { price, loading: priceLoading } = useSubscriptionPrice();

  const switchToPolygon = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: POLYGON_CHAIN_ID }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: POLYGON_CHAIN_ID,
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://polygon-rpc.com/"],
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          });
          return true;
        } catch (addError) {
          setError("Failed to add Polygon network");
          return false;
        }
      }
      setError("Failed to switch network");
      return false;
    }
  }, []);

  const checkAndApproveUSDT = useCallback(async (signer, totalAmount) => {
    try {
      setApproving(true);
      const usdtAbi = [
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
      ];

      const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, signer);
      const currentAllowance = await usdtContract.allowance(
        await signer.getAddress(),
        CONTRACT_ADDRESS
      );

      if (currentAllowance < totalAmount) {
        const approveTx = await usdtContract.approve(
          CONTRACT_ADDRESS,
          totalAmount
        );
        await approveTx.wait();
      }

      return true;
    } catch (err) {
      console.error("USDT approval error:", err);
      setError("Failed to approve USDT. Please try again.");
      return false;
    } finally {
      setApproving(false);
    }
  }, []);

  const handleSubscribe = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== POLYGON_CHAIN_ID) {
        const switched = await switchToPolygon();
        if (!switched) return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAbi = [
        "function purchaseSubscription(uint256 months) external",
        "function subscriptionPrice() view returns (uint256)",
      ];
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi,
        signer
      );

      const pricePerMonth = await contract.subscriptionPrice();
      const totalPrice = parseInt(pricePerMonth) * months;

      const approved = await checkAndApproveUSDT(signer, totalPrice);
      if (!approved) return;

      const tx = await contract.purchaseSubscription(months);
      await tx.wait();

      onClose();
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [months, onClose, switchToPolygon, checkAndApproveUSDT]);

  const totalPrice = price ? parseFloat(price) * months : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-crypto-card rounded-2xl shadow-ai-glow p-6 max-w-md w-full mx-4 border border-crypto-neutral-light/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Upgrade to Pro</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="months"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Subscription Duration
            </label>
            <select
              id="months"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-crypto-neutral border border-crypto-neutral-light/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-crypto-ai-primary/50"
            >
              {[1, 3, 6, 12].map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? "Month" : "Months"}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-crypto-neutral/50 rounded-xl border border-crypto-neutral-light/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Price per month:</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-crypto-ai-primary">
                  {priceLoading
                    ? "Loading..."
                    : `$${parseFloat(price).toFixed(2)} USDT`}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-crypto-neutral-light/20">
              <span className="text-sm font-medium text-white">Total:</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-crypto-ai-primary">
                  {priceLoading
                    ? "Loading..."
                    : `$${totalPrice.toFixed(2)} USDT`}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-crypto-error/10 border border-crypto-error/20 rounded-xl">
              <p className="text-sm text-crypto-error">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-crypto-neutral border border-crypto-neutral-light/20 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubscribe}
              disabled={loading || priceLoading || approving}
              className="px-4 py-2 bg-gradient-to-r from-crypto-ai-primary to-crypto-ai-highlight rounded-xl hover:shadow-ai-glow transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
            >
              {approving
                ? "Approving USDT..."
                : loading
                ? "Processing..."
                : "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
