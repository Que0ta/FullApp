import { useState, useContext, useEffect } from "react";
import { useWords } from "../hooks/getWords";
import { loadCustomWords } from "../hooks/customWords";
import { getLobbyInfo } from "../hooks/getLobby";
import "./guessWord.css";

export function GuessWord({ onPressBtn, onSelectAnswer, selectedAnswer }) {
  const { words } = useWords();
  const { customWords } = loadCustomWords();
  const { chosenWord } = getLobbyInfo();
  //   console.log(words, customWords);
  //   console.log('=>',chosenWord);
  const [fullWords, setFullWords] = useState(null);

  useEffect(() => {
    if (customWords && words) {
      const fullList = [...new Set([...words, ...customWords])];
      setFullWords(fullList);
    }
  }, [words, customWords]);

  return (
    <div className="popup-overlay">
      <div className="frame-word">
        <h2>Спробуй відгадати слово)</h2>
        <ul className="word-list">
          {fullWords
            ? fullWords.map((name, index) => (
                <li
                  key={index}
                  onClick={() => onSelectAnswer(name)}
                  className={selectedAnswer === name ? "chosenAnswer" : ""}
                >
                  <span>{name}</span>
                </li>
              ))
            : ""}
        </ul>
        <button className="select-answer" onClick={onPressBtn}>
          Перевірити
        </button>
      </div>
    </div>
  );
}
