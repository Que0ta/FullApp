import { useEffect, useState, useCallback } from "react";

export function loadCustomWords() {
  const [customWords, setCustom] = useState(null);
  const [loadingCustom, setLoading] = useState(true);
  const [errorCustom, setError] = useState(null);

  // memoizable func to avoid re-rendering of the same hook
  const customWordsFunc = useCallback(async () => {
    try {
      const response = await fetch("/api/custom", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      setCustom(result);
      setError(null);
    } catch (error) {
      console.error("Error sending data:", error);
    } finally{
        setLoading(false);
    }
  }, []);

  useEffect( ()=> {
    customWordsFunc(); // fetched data
  }, [customWordsFunc]);

  return { customWords, loadingCustom, errorCustom, customWordsFunc, setCustom };
}
