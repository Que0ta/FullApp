// hooks/useWords.ts
import { useEffect, useState } from "react";

export function useWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState({}); // { word1: true, word2: false }
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch("/api/words", {
          method: "GET",
          credentials: "include",
        }); // replace with your backend URL
        if (!res.ok) throw new Error("Failed to fetch words");

        const data = await res.json();
        setWords(data); // assuming backend returns { words: ["word1","word2"] }

        const initialChecked = {};
        (data || []).forEach(word => { initialChecked[word] = true });
        setChecked(initialChecked);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  return { words, setWords, checked, setChecked, loading, error };
}
