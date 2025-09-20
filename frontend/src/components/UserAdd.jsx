import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { PlayersContext } from "../App";

function AddUser(  ) {
  const { players, setPlayers } = useContext(PlayersContext);

  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");

  // Compute initial count based on current players
  const initialCount = players && Object.keys(players).length > 0
    ? Math.max(...Object.keys(players).map(Number)) + 1
    : 0;
    
  const [count, setCount] = useState(initialCount);

  const handleAddClick = () => setShowInput(true);

  const handleSave = () => {
    if (!newName.trim()) return;

    setPlayers(prev => ({
      ...prev,
      [initialCount]: newName,
    }));

    setCount(c => c + 1);
    setNewName("");
    setShowInput(false);
  };

  return (
    <div className="add-user">
      {!showInput ? (
        <button className="addUser" onClick={handleAddClick}>
          +
        </button>
      ) : (
        <div className="input-wrapper">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter player name"
          />
          <button className="saveUser" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
