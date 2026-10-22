import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login.jsx";
import Dashboard from "../features/dashboard/pages/Dashboard.jsx"; 
import Navigation from "../features/game/pages/Navigation.jsx";
import Registration from "../features/auth/pages/Register.jsx";
import Game from "../features/game/pages/Game.jsx";
import GameWindow from "../features/game/pages/GameWindow.jsx";
import OnlineNav from "../features/game/pages/OnlineNavigation.jsx";
import { useState } from "react";
import { UserContext, PlayersContext, SpyAmount } from "./contexts.js";




function App() {
  const [user, setUser] = useState(null);
  const [spies, setSpies] = useState({amount: 1});
  const [players, setPlayers] = useState({});

  return (
    <SpyAmount.Provider value={{ spies, setSpies }}>
      <PlayersContext.Provider value={{ players, setPlayers }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/game-single" element={<Game />} />
            <Route path="/game-window" element={<GameWindow />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/game-settings" element={<Navigation />} />
            <Route path="/online-settings" element={<OnlineNav />} />
          </Routes>
        </UserContext.Provider>
      </PlayersContext.Provider>
    </SpyAmount.Provider>
  );
}

export default App;
