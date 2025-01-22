import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useSubscription } from "../hooks/useSubscription";

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { subscription, checkSubscription } = useSubscription();

  useEffect(() => {
    const checkConnection = async () => {
      const token = localStorage.getItem("token");
      if (window.ethereum && token) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkSubscription(accounts[0]);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Error checking connection:", err);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkSubscription(accounts[0]);
        } else {
          setAccount(null);
          localStorage.removeItem("token");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, [checkSubscription]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      const { ethereum } = window;
      if (!ethereum || !ethereum.isMetaMask) {
        throw new Error("MetaMask not found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      setAccount(address);

      const nonceResponse = await fetch(`/api/auth/nonce/${address}`, {
        credentials: 'include'
      });
      
      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce");
      }
      const { message } = await nonceResponse.json();

      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          signature,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || "Failed to verify signature");
      }

      const { token } = await verifyResponse.json();
      localStorage.setItem("token", token);
      await checkSubscription(address);
    } catch (err) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to connect wallet");
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = useCallback(() => {
    setAccount(null);
    localStorage.removeItem("token");
  }, []);

  const value = {
    account,
    loading,
    error,
    subscription,
    connectWallet,
    disconnect,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}; 