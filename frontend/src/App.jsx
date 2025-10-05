import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx"; // ✅ updated path
import Navigation from "./pages/Navigation.jsx";
import Registration from "./pages/Register.jsx";
import Game from "./pages/Game.jsx";
import GameWindow from "./pages/GameWindow.jsx";
import OnlineNav from "./pages/onlineNavigation.jsx";
import { createContext, useState } from "react";

export const UserContext = createContext();

// variables for game parameters
export const PlayersContext = createContext();
export const SpyAmount = createContext();


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
