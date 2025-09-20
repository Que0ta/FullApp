import { useState } from "react";

export function usePostData(url) {
  const [error, setError] = useState(null);

  const postData = async (body) => {
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      return await res.json(); // return the response
    } catch (err) {
      setError(err);
      console.error(err);
      throw err; // optional: let component handle error
    }
  };

  return { postData, error };
}
