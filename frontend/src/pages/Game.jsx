import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getLobbyInfo } from "../hooks/getLobby";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { div } from "framer-motion/client";
import "./Game.css";

export default function Game() {
  const navigate = useNavigate();

  // animation rotation frames
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-360, 0, 360], [-180, 0, 180]);

  const { readyUsers } = getLobbyInfo();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0); // 0 = front, 1 = back, 2 = black

  if (!readyUsers || readyUsers.length === 0) {
    return <div className="loading">Loading lobby...</div>;
  }

  const player = readyUsers[index];

  const skipRole = () => {
    if (index + 1 < readyUsers.length) setIndex((prev) => prev + 1);
  }

  const handleClick = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // if on black card, show the role again
      setStep(1);
    }
    if (step < 2) setStep(step + 1);
  };

  const handleDragEnd = (_event, info) => {
    const swipeThreshold = 80; // distance
    const velocityThreshold = 1000; // speed

    if (
      step === 2 &&
      (Math.abs(info.offset.y) > swipeThreshold ||
        Math.abs(info.velocity.y) > velocityThreshold)
    )
      if (index + 1 >= readyUsers.length) {
        // 👉 last player reached → navigate
        navigate("/game-window"); // change "/results" to your target route
      } else {
        // 👉 otherwise just go to next player
        setStep(0);
        setIndex((prev) => prev + 1);
      }
  };

  return (
    <div className="game-container">
      <h1>Дізнайтесь свою роль</h1>

      <div className="card-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={player.id + "-" + step}
            drag={step === 2 ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.25}
            dragMomentum={false}
            style={{ y, rotate }} // 👈 just attach here
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            initial={step === 2 ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={step === 2 ? { y: 0, opacity: 0 } : { y: -10, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`card ${
              step === 0
                ? "card-front"
                : step === 1
                ? "card-back"
                : "card-black"
            }`}
          >
            {step === 0 && <span className="card-text">{player.name}</span>}
            {step === 1 && <span className="card-text">{player.role === 'spy' ? "Шпигун" : chosenWord}</span>}
            {/* step === 2 has no content inside card */}
            {step === 2 && (
              <p className="hint">
                Свайпніть вгору чи вниз, щоб побачити наступного гравця
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="menu-buttons">
        <button className={`${index + 2 > readyUsers.length ? "hidden" : ""}`} onClick={skipRole}>Пропустити</button>
        <a className="skip-button" href="/game-window">Перейти до гри</a>
      </div>
      <p className="progress">
        {index + 1} / {readyUsers.length}
      </p>
    </div>
  );
}
