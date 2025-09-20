// components/WordList.tsx
import { useState, useEffect } from "react";
import { useWords } from "../hooks/getWords";
import { loadCustomWords } from "../hooks/customWords";
import "./Words.css";

export function WordList({ customWordsLoad, onData, updateDel }) {
  const { words, checked, setChecked, loading, error } = useWords();
  const {
    customWords = [],
    loadingCustom,
    errorCustom,
    customWordsFunc,
    setCustom
  } = loadCustomWords();
  // Fetch custom words after component mounts
  // Needs to be fixed later
  // MARK: FIX NEEDED (re-renders too much)
  // Solved 9/7/2025 !!!
  const wordCustomShow = customWordsLoad || [];

  if (loading) return <p>Loading words...</p>;
  if (loadingCustom) return <p>Loading customWords...</p>;

  if (error) return <p>Error: {error}</p>;
  if (errorCustom) return <p>Error with custom words: {error}</p>;

  if (!words.length) return <p>No words found.</p>;

  const handleToggle = (word) => {
    const newChecked = { ...checked, [word]: !checked[word] };
    setChecked(newChecked);
    onData(newChecked); // pass the updated state immediately
  };

  const checkToggle = () => {
    const allWords = [...words, ...wordCustomShow];
    const newChecked = {};
    if (allSelected) {
      // Deselect all
      allWords.forEach((w) => (newChecked[w] = false));
      setChecked(newChecked);
    } else {
      // Select all
      allWords.forEach((w) => (newChecked[w] = true));
      setChecked(newChecked);
    }
    onData(newChecked); // pass the updated state immediately
  };

  const handleDelete = async (word) => {
    // Remove locally first
    setCustom(customWords.filter((w) => w !== word));
    
    // Also remove from checked
    setChecked((prev) => {
      const newChecked = { ...prev };
      delete newChecked[word];
      return newChecked;
    });
    
    // Send POST request to your backend endpoint
    try {
      const response = await fetch("/api/delete-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ word }), // send the word you want to delete
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete word on server");
      }
      updateDel();
      console.log("Word deleted on server:", word);
    } catch (error) {
      console.error(error);
    }
  };
  

  const allWords = [...words, ...customWords];
  const allSelected = allWords.every((w) => checked[w]);
  
  // check status of words =>
    // console.log(checked);

  return (
    <div className="frame-word">
      <h3>
        {" "}
        Список вибраних слів
        <br /> <i>(деактивовані - сірий колір)</i>{" "}
      </h3>
      <button
        className={`choose-all ${allSelected ? "" : "selected"}`}
        onClick={checkToggle}
      >
        {allSelected ? "Зняти всі" : "Вибрати усі"}
      </button>
      <ul className="word-list">
        {words.map((word, index) => (
          <li
            key={index}
            className={checked[word] ? "selected" : ""}
            onClick={() => handleToggle(word)}
          >
            <span>{word}</span>
          </li>
        ))}
        {wordCustomShow.map((word, index) => (
          <li
            key={index}
            className={`custom ${checked[word] ? "selected" : ""}`}
            onClick={() => handleToggle(word)}
          >
            <span>{word}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent toggle
                handleDelete(word);
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
