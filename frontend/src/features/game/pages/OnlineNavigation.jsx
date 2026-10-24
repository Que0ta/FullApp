import { useState, useEffect, useContext, useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, PlayersContext, SpyAmount } from "../../../app/contexts.js";

import SpyAmountComponent from "../components/SpyAmount.jsx";

import { WordList } from "../../words/components/Words.jsx";
import { CustomWordAdd } from "../../words/components/CustomWordAdd.jsx";

import { useCustomWords } from "../../words/hooks/useCustomWords.js";
import { useWords } from "../../words/hooks/useWords.js";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser.js";

export default function OnlineNav() {
  const navigate = useNavigate();
  const { words, checked, setChecked, loading, error } = useWords();
  const { customWords, customWordsFunc } = useCustomWords();
  const { currentUser } = useCurrentUser();

  // Lobby game code
  const [gameCode, setGameCode] = useState(10000);

  // Players list
  const [onlinePlayers, setOnlinePlayers] = useState({});
  // Form data to send info of full lobby after slight updates
  const [formData, setFormData] = useState(null);
  // Spy amount
  const [spiesAm, setSpiesAm] = useState(1);
  const { spies, setSpies } = useContext(SpyAmount);

  const handleAmountPass = (data) => {
    setSpiesAm(data);
    setSpies({ amount: data });
    // console.log('amount =>',data);
  };
  // checked words list - passed
  const handleFormSubmit = (data) => {
    setFormData(data);
    setChecked(data);
    // console.log('check =>',data);
  };

  // handle of delete of user on parameter page
  const handleDelete = (id) => {
    setPlayers((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const generateGameCode = () => {
    const min = 100000;
    const max = 999999;
    setGameCode(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  useEffect(() => {
    generateGameCode();
  }, []);

  // update players list
  useEffect(() => {
    if (currentUser) {
      setOnlinePlayers((prev) => ({
        ...prev,
        0: currentUser,
      }));
    }
  }, [currentUser, setOnlinePlayers]);

  return (
    <div>
      <h2> Поділися з друзями: {gameCode} </h2>
      <ul className="users-list">
        {Object.entries(onlinePlayers).map(([key, value]) => (
          <li className="user" key={key}>
            <span>{value}</span>
            {currentUser != value ? (
              <button className="deleteUser" onClick={() => handleDelete(key)}>
                ✕
              </button>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
      <SpyAmountComponent
              amountPass={handleAmountPass}
              countUpdate={handleAmountPass}
            />
      <WordList
        customWordsLoad={customWords}
        onData={handleFormSubmit}
        updateDel={customWordsFunc}
      />
      <CustomWordAdd reloadCustomWords={customWordsFunc} />
    </div>
  );
}
