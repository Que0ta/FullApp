import { useState, useContext } from "react";
import "./CustomWord.css";

export function CustomWordAdd({ reloadCustomWords } ) {
  const statusMessage = document.querySelector(".status-header");
  const [word, setWord] = useState("");
  const [addStatus, setaddStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) return; // Don't send empty strings

    try {
      const response = await fetch("/api/add-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // sends cookie
        body: JSON.stringify({ word }),
      });

      const result = await response.json();
      // console.log("Server response:", result);
      setaddStatus(result.status);
      setWord("");
      reloadCustomWords(); // refresh the customWords list in Words.jsx
      console.log('added successfully');
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  if (addStatus === 'false') statusMessage.style.display = "none";
  else if (addStatus === 'success') {
    statusMessage.style.display = "block";
    setTimeout(()=>{
      statusMessage.style.display = 'none';
      statusMessage.classList.remove('success');
      setaddStatus(null);
    }, 1000)
  }

  return (
    <div className="addCustomWord">
      <h4
        className={`status-header ${
          addStatus === "success"
            ? "success"
            : addStatus === "false"
            ? "error"
            : "hidden"
        }`}
      >
        {addStatus === "success"
          ? "Успішно додано!"
          : addStatus === "false"
          ? "Таке слово вже є!"
          : ""}
      </h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Запишіть нове слово тут"
          required
        />
        <button className="add-word" type="submit">
          Додати
        </button>
      </form>
    </div>
  );
}
