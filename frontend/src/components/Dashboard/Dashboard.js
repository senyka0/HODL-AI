import { useCallback, useState, useEffect } from "react";
import { useWeb3 } from "../../context/Web3Context";
import { AddWalletModal } from "../Wallet/AddWalletModal";
import { UpgradeModal } from "../Subscription/UpgradeModal";

export const Dashboard = () => {
  const { account, subscription } = useWeb3();
  const [wallets, setWallets] = useState([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallets = useCallback(async () => {
    try {
      const response = await fetch("/api/wallets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch wallets");
      }

      const data = await response.json();
      setWallets(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleAddWallet = useCallback(
    async (walletData) => {
      try {
        const response = await fetch("/api/wallets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(walletData),
        });

        if (!response.ok) {
          throw new Error("Failed to add wallet");
        }

        await fetchWallets();
      } catch (err) {
        console.error("Error adding wallet:", err);
        throw err;
      }
    },
    [fetchWallets]
  );

  const handleDeleteWallet = useCallback(
    async (id) => {
      try {
        const response = await fetch(`/api/wallets/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete wallet");
        }

        await fetchWallets();
      } catch (err) {
        console.error("Error deleting wallet:", err);
        setError(err.message);
      }
    },
    [fetchWallets]
  );

  return (
    <div className="w-full max-w-7xl">
      <div className="bg-crypto-card rounded-2xl shadow-ai-glow p-8 space-y-8 border border-crypto-neutral-light/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-crypto-ai-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-crypto-ai-primary">
              HODLAI Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-crypto-neutral rounded-xl border border-crypto-neutral-light/20">
                <p className="text-xs text-gray-400">Connected Address</p>
                <p className="text-sm font-mono text-crypto-ai-primary truncate max-w-[200px]">
                  {account}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-xl border ${
                  subscription?.type === "pro"
                    ? "bg-crypto-ai-primary/10 border-crypto-ai-primary/20"
                    : "bg-crypto-neutral border-crypto-neutral-light/20"
                }`}
              >
                <p className="text-xs text-gray-400">Subscription</p>
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-sm font-semibold ${
                      subscription?.type === "pro"
                        ? "text-crypto-ai-primary"
                        : "text-gray-300"
                    }`}
                  >
                    {subscription?.type === "pro"
                      ? "Pro Plan till " +
                        new Date(subscription.expiry).toLocaleDateString(
                          "de-DE"
                        )
                      : "Free Plan"}
                  </p>
                  {subscription?.type !== "pro" && (
                    <button
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="text-xs px-2 py-1 bg-gradient-to-r from-crypto-ai-secondary to-crypto-ai-highlight rounded-lg hover:shadow-ai-glow transition-all transform hover:scale-105"
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Tracked Wallets
            </h3>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-crypto-ai-primary to-crypto-ai-highlight rounded-xl hover:shadow-ai-glow transition-all transform hover:scale-105 text-sm font-semibold flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Wallet</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-crypto-error/10 border border-crypto-error/20 rounded-xl">
              <p className="text-sm text-crypto-error">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-crypto-neutral-light/10">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    Address
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    Current Balance
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    24H Prediction
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    7D Prediction
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    30D Prediction
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      Loading wallets...
                    </td>
                  </tr>
                ) : wallets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No wallets added yet. Click "Add Wallet" to get started.
                    </td>
                  </tr>
                ) : (
                  wallets.map((wallet) => (
                    <tr
                      key={wallet.id}
                      className="border-b border-crypto-neutral-light/10 hover:bg-crypto-neutral/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-crypto-ai-primary">
                          {wallet.address}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-300">
                          N/A$ (N/A%)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-300">
                          N/A$ (N/A%)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-300">
                          N/A$ (N/A%)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-300">
                          N/A$ (N/A%)
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteWallet(wallet.id)}
                          className="text-sm text-crypto-error hover:text-crypto-error/80 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onAdd={handleAddWallet}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
};
