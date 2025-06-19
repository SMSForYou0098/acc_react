import { useCallback } from "react";
import axios from "axios";

const useFetchTransactions = (api, id, authToken, setData, setLoading) => {
  return useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}user-transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [api, id, authToken, setData, setLoading]);
};

export default useFetchTransactions;
