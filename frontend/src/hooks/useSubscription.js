import { useState, useCallback, useEffect } from "react";

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);

  const checkSubscription = useCallback(async (address) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/auth/subscription/${address}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription(null);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const address = localStorage.getItem("address");
      if (address) {
        checkSubscription(address);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [checkSubscription]);

  return { subscription, checkSubscription };
}; 