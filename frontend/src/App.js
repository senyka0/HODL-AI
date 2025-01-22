import { useWeb3 } from "./context/Web3Context";
import { LoginCard } from "./components/Auth/LoginCard";
import { Dashboard } from "./components/Dashboard/Dashboard";

function App() {
  const { subscription } = useWeb3();
  return (
    
      <div className="min-h-screen bg-gradient-to-b from-crypto-darker to-crypto-dark text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-ai-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-crypto-darker/80 to-crypto-dark/80" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
            {!subscription ? <LoginCard /> : <Dashboard />}
          </div>
        </div>
      </div>
  );
}

export default App;
