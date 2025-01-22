import { useState, useCallback } from "react";
import { ethers } from "ethers";

export const AddWalletModal = ({ isOpen, onClose, onAdd }) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      try {
        if (!ethers.isAddress(address)) {
          throw new Error("Invalid Ethereum address");
        }

        await onAdd({ address });
        setAddress("");
        onClose();
      } catch (err) {
        setError(err.message);
      }
    },
    [address, onAdd, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-crypto-card rounded-2xl shadow-ai-glow p-6 max-w-md w-full mx-4 border border-crypto-neutral-light/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add Wallet</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Wallet Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-crypto-neutral border border-crypto-neutral-light/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-crypto-ai-primary/50"
              placeholder="0x..."
            />
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
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-crypto-ai-primary to-crypto-ai-highlight rounded-xl hover:shadow-ai-glow transition-all transform hover:scale-105"
            >
              Add Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
