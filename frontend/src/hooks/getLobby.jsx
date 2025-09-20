import { useEffect, useState, useCallback } from "react";

export function getLobbyInfo(){
    const [readyUsers, setreadyUsers] = useState(null);
    const [chosenWord, setChosenWord] = useState(null);

    const readyLobby = useCallback(async () => {
    try {
      const response = await fetch("/api/lobby", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      setChosenWord(result.word || null);
      setreadyUsers(result.players || null);
      // console.log('done lobby!');
    } catch (error) {
      console.error("Error sending data:", error);
    } finally{
        // console.log('done!');
    }
  }, []);

  useEffect( ()=> {
    readyLobby(); // fetched data
  }, [readyLobby]);


  return { readyUsers, chosenWord, readyLobby }
}