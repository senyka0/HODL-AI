import { useWeb3 } from "../../context/Web3Context";

export const WalletConnect = () => {
  const { account, loading, error, connectWallet, disconnect } = useWeb3();

  return (
    <div className="space-y-4">
      {!account ? (
        <div className="flex justify-center">
          <button
            onClick={connectWallet}
            disabled={loading}
            className={`px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
              loading
                ? "bg-crypto-neutral cursor-not-allowed"
                : "bg-gradient-to-r from-crypto-accent to-crypto-blue hover:shadow-neon-strong"
            } font-semibold`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Connecting...</span>
              </div>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-crypto-neutral rounded-xl border border-crypto-neutral-light/20">
            <p className="text-sm text-gray-400">Connected Address:</p>
            <p className="font-mono text-sm text-crypto-accent break-all mt-1">
              {account}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={disconnect}
              className="px-6 py-2 bg-crypto-error/20 text-crypto-error rounded-xl hover:bg-crypto-error/30 transition-colors border border-crypto-error/20"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-crypto-error/10 text-crypto-error rounded-xl border border-crypto-error/20">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}; 