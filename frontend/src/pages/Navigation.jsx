import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, PlayersContext, SpyAmount } from "../App";
import { useVerifyUser } from "../hooks/verifyUser";
import { getLobbyInfo } from "../hooks/getLobby";
import AddUser from "../components/UserAdd";
import SpyAmountComponent from "../components/SpyAmount";
import { WordList } from "../components/Words";
import { CustomWordAdd } from "../components/CustomWordAdd";
import "./Navigate.css";
import "./Game.css";

import { loadCustomWords } from "../hooks/customWords";
import { useWords } from "../hooks/getWords";

function Navigation() {
  const navigate = useNavigate();
  const { readyUsers, readyLobby } = getLobbyInfo();
  const { words, checked, setChecked, loading, error } = useWords();
  const { customWords, customWordsFunc } = loadCustomWords();

  const { spies, setSpies } = useContext(SpyAmount);
  const { user, setUser } = useContext(UserContext);
  const { players, setPlayers } = useContext(PlayersContext);

  const [spiesAm, setSpiesAm] = useState(1);
  const [formData, setFormData] = useState(null)
  const [lastID, setLastID] = useState(null); 

  useEffect(() => {
    if (readyUsers) {
      readyUsers.map((item) => {
        console.log(item);
        if (item.id != "0" && !(item.id in players)) {
          setPlayers((prev) => ({
            ...prev,
            [item.id]: item.name,
          }));
        }
      });
    }

  }, [readyUsers, setPlayers]);

  // info to pass before game starts
  const [params, setParams] = useState({
    playersParameter: null,
    spyAmountParameter: null,
    wordsParameter: null,
  });

  const newParams = {
    players: players,
    spyAmount: spies,
    wordsList: formData || checked,
  };

  const [popupOpen, setPopupOpen] = useState(false);

  const handleConfirm = async () => {
    setPopupOpen(false);
    navigate("/game-single");
  };

  const handleStart = async () => {
    setParams(newParams);

    await fetch("/api/game-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newParams),
      credentials: "include",
    });
    setPopupOpen(false); // just close popup, no navigation
    navigate("/game-single");
  };

  const createNewGame = async () => {
    setPopupOpen(false);
  };

  const handleGameStart = async () => {
    setParams(newParams);
    try {
      const data = await fetch("/api/lobby", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await data.json();
      const status = result.status;
      if (status === true && result.word != "") {
        console.log("There is an active game!");
        setPopupOpen(true);
        // navigate("/game-single", {
        //   state: { showPopup: true },
        // });
      }
    } catch (err) {
      console.log(err);
    }

    // запуск нової гри + очищення попередніх записів (backend)
  };

  useEffect(() => {
    handleGameStart();
    // You can perform side effects here, like data fetching, DOM manipulation, etc.
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  //   useEffect(() => {
  //   if (params) {
  //     console.log("Params updated:", params);
  //     // do something after params changes
  //   }
  // }, [params]);

  // Amount spies - passed
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

  useEffect(() => {
    fetch("/api/dashboard", {
      method: "GET",
      credentials: "include", // sends cookie
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/"); // unauthorized
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, [navigate]);

  // handle of delete of user on parameter page
  const handleDelete = (id) => {
    setPlayers((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // update players list
  useEffect(() => {
    if (user) {
      setPlayers((prev) => ({
        ...prev,
        0: user,
      }));
    }
  }, [user, setPlayers]);

  useVerifyUser("/game-settings");
  // console.log("оновлено==", params);

  return (
    <div className="navigation-panel">
      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <p>
              <b>Знайдено незавершену гру.</b>
              <br />
              Бажаєте продовжити ? {location.state?.action}
            </p>
            <div className="popup-buttons">
              <button className="accept" onClick={createNewGame}>
                Створити нову
              </button>
              <button className="decline" onClick={handleConfirm}>
                Так
              </button>
            </div>
          </div>
        </div>
      )}
      <h1>Додані гравці:</h1>
      <ul className="users-list">
        {Object.entries(players).map(([key, value]) => (
          <li className="user" key={key}>
            <span>{value}</span>
            {user != value ? (
              <button className="deleteUser" onClick={() => handleDelete(key)}>
                ✕
              </button>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
      <AddUser />
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
      <div className="menu-buttons">
        <a className="back-menu" href="/dashboard">
          Назад
        </a>
        <button onClick={handleStart}>Нова гра</button>
      </div>
    </div>
  );
}

export default Navigation;
