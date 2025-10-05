import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLobbyInfo } from "../hooks/getLobby";

import { getStatusGame } from "../hooks/gameStatus";
import { usePostData } from "../hooks/postPlayerCheck";
import { deleteLobby } from "../hooks/deleteLobby";
import { GuessWord } from "../components/guessWord";
import "./GameW.css";

function GameWindow() {
  const navigate = useNavigate();
  const { lobbyReset } = deleteLobby();
  const { readyUsers, readyLobby, chosenWord } = getLobbyInfo();
  const { gameStatus, getResult } = getStatusGame();

  const { postData, error } = usePostData("/api/update-role");

  const [selected, setSelected] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [spyPopup, setSpyPopup] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const statusMap = {
    found: "status-grey",
    kicked: "status-red",
  };

  const imageMap = {
    found: "./spy.png",
    kicked: "./civilian.png",
  };

  if (gameStatus && gameStatus.gameWon === "civilians" && !spyPopup) {
    console.log("won civil!");
    // lobbyReset();
  } else if (gameStatus && gameStatus.gameWon === "spies") {
    console.log("spies won!");
    // lobbyReset();
  }

  const handleNewGame = async () => {
    lobbyReset();
    navigate("/game-settings");
  };

  // added chance for spy win
  const reCheck = async () => {
    if (selectedAnswer === chosenWord) {
      const playerSend = ["", "guessed"];
      const result = await postData(playerSend);
    }
    getResult();
    setSpyPopup(false);
  };

  // selecting answer when spy is found
  const checkData = (word) => {
    if (selectedAnswer === word) setSelectedAnswer("");
    else {
      setSelectedAnswer(word);
    }
    console.log(word);
  };

  // checking players after voting
  const voting = async () => {
    if (selectedRole === "spy") {
      const playerSend = [selected, "found"];
      const result = await postData(playerSend);
      setSpyPopup(true);
      //   console.log(result);
    } else if (selectedRole === "civilian") {
      const playerSend = [selected, "kicked"];
      const result = await postData(playerSend);
      setSpyPopup(false);
      //   console.log(result);
    }
    readyLobby();
    getResult();
  };

  return (
    <div className="game-window">
      {spyPopup ? (
        <GuessWord
          onPressBtn={reCheck}
          onSelectAnswer={checkData}
          selectedAnswer={selectedAnswer}
        />
      ) : (
        ""
      )}
      {gameStatus && gameStatus.gameWon != "" && spyPopup === false && (
        <div className="overlay">
          <div className="side-blur left"></div>
          <div className="center-box">
            <h2>
              {gameStatus.gameWon === "spies" ? "Шпигуни" : "Мирні жителі"}{" "}
              виграли!
            </h2>
            <p>
              {gameStatus.gameWon === "civilians"
                ? `Шпигунів ${readyUsers
                    ?.filter((player) => player.role === "spy")
                    .map((player) => player.name)
                    .join(", ")} було успішно викрито!`
                : "Секретне місце жителів успішно розпізнано!"}
            </p>
            <button className="start-game" onClick={handleNewGame}>
              Розпочати нову гру
            </button>
          </div>
          <div className="side-blur right"></div>
        </div>
      )}
      <div className="players-list">
        {readyUsers?.map((player, index) => (
          <div
            key={index}
            className={`user ${selected === player.name ? "chosen-one" : ""} ${
              player.status && statusMap[player.status]
            }`}
            onClick={() => {
              setSelected(player.name);
              setSelectedRole(player.role);
              readyLobby();
            }}
          >
            <span>{player.name}</span>
            {player.status ? (
              <img
                className="detection-image detection deleteUser"
                width="40px"
                src={imageMap[player.status]}
                alt="check"
              />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <div className="menu-buttons">
        <a className="back-menu" href="/dashboard">
          Назад
        </a>
        <button onClick={voting}>Голосування</button>
      </div>
    </div>
  );
}

export default GameWindow;
