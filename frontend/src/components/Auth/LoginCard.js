import { WalletConnect } from "../Wallet/WalletConnect";
import { TierComparison } from "../Subscription/TierComparison";

export const LoginCard = () => {
  return (
    <div className="w-full max-w-4xl">
      <div className="bg-crypto-card rounded-2xl shadow-ai-glow p-8 space-y-8 border border-crypto-neutral-light/10 backdrop-blur-xl">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-ai-primary via-crypto-ai-highlight to-crypto-ai-secondary bg-clip-text text-transparent">
              HODLAI
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            AI-Powered Crypto Portfolio Analysis & Predictions
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-crypto-ai-primary rounded-full mr-2 animate-pulse" />
              Real-time Analysis
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-crypto-ai-secondary rounded-full mr-2 animate-pulse" />
              ML Predictions
            </span>
          </div>
        </div>
        <WalletConnect />
        <TierComparison />
      </div>
    </div>
  );
}; 