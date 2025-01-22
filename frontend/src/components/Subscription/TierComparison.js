const FeatureRow = ({ feature, isIncluded, isPro = false }) => (
  <li
    className={`flex items-center ${
      isPro ? "text-crypto-ai-primary" : "text-gray-400"
    }`}
  >
    <svg
      className="w-5 h-5 mr-2 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    <span className="text-sm">{feature}</span>
  </li>
);

export const TierComparison = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 rounded-xl border transition-all bg-crypto-neutral border-crypto-neutral-light/20">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Basic Tier</h3>
              <p className="text-sm text-gray-400">Essential Features</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-crypto-neutral-light/30 text-gray-300 text-xs rounded-full">
                Free
              </span>
              <p className="text-sm text-gray-400 mt-1">$0.00 USDT</p>
            </div>
          </div>
          <div className="flex-grow">
            <ul className="space-y-3">
              <FeatureRow feature="BSC Network Support" isIncluded={true} />
              <FeatureRow feature="Polygon Network Support" isIncluded={true} />
              <FeatureRow feature="24h Price Predictions" isIncluded={true} />
              <FeatureRow feature="7-day Price Predictions" isIncluded={true} />
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border transition-all bg-gradient-to-br from-crypto-neutral to-crypto-neutral-light border-crypto-ai-primary/20">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-crypto-ai-primary">
                HODLAI Pro
              </h3>
              <p className="text-sm text-gray-400">Advanced AI Features</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-crypto-ai-primary/20 text-crypto-ai-primary text-xs rounded-full">
                Premium
              </span>
              <div className="mt-1">
                <div className="flex items-center justify-end space-x-1">
                  <p className="text-sm text-crypto-ai-primary">$5.00 USDT</p>
                </div>

                <p className="text-xs text-gray-500 mt-0.5">per month</p>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <ul className="space-y-3">
              <FeatureRow
                feature="BSC Network Support"
                isIncluded={true}
                isPro={true}
              />
              <FeatureRow
                feature="Polygon Network Support"
                isIncluded={true}
                isPro={true}
              />
              <FeatureRow
                feature="Ethereum Network Support"
                isIncluded={true}
                isPro={true}
              />
              <FeatureRow
                feature="24h Price Predictions"
                isIncluded={true}
                isPro={true}
              />
              <FeatureRow
                feature="7-day Price Predictions"
                isIncluded={true}
                isPro={true}
              />
              <FeatureRow
                feature="30-day Price Predictions"
                isIncluded={true}
                isPro={true}
              />
              <FeatureRow
                feature="Telegram Notifications"
                isIncluded={true}
                isPro={true}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
