import { supabase } from "../config/database.js";
import { getLobbyAdmin, resetLobby } from "../repositories/lobbies.repository.js";
import { chooseSpies } from "../services/spySelection.js";

export const getLobby = async (req, res) => {
  const admin = req.user.username;

  const { data, error } = await supabase
    .from("lobbies")
    .select("*")
    .eq("admin", admin)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message, status: false });
  }
  // data should include: players (JSON), word, id
  res.json({
    lobbyId: data.id,
    word: data.word,
    players: data.players, // array of {id, name, role}
    status: true,
  });
};

export const startGame = async (req, res) => {
  const adminy = req.user.username;
  const { players, spyAmount, wordsList } = req.body;

  // Pick random word
  const validWords = Object.keys(wordsList).filter((word) => wordsList[word]);
  const word = validWords[Math.floor(Math.random() * validWords.length)];

  // Pick spies
  const playerIds = Object.keys(players);
  const spyCount = Math.min(spyAmount.amount, playerIds.length);
  const weights = Object.fromEntries(playerIds.map((id) => [id, 1]));
  const spyIds = chooseSpies(playerIds, spyCount, weights);

  // Build players array with roles
  const playersWithRoles = playerIds.map((id) => ({
    id,
    name: players[id],
    role: spyIds.includes(id) ? "spy" : "civilian",
    status: "",
  }));

  // Needs a double lobby check (for 1 user)
  const { check, err } = await supabase
    .from("lobbies")
    .select("*")
    .eq("admin", adminy)
    .single();

  if (err) {
    return res.status(500).json({ error: err.message });
  } else if (check != undefined) {
    // Save into Supabase
    const { data, error } = await supabase
      .from("lobbies")
      .insert([{ word: word, players: playersWithRoles, admin: adminy }]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to save game" });
    }
    res.json({ word, players: playersWithRoles });
  } else {
    // delete all previous
    const { data, error } = await supabase
      .from("lobbies")
      .delete()
      .eq("admin", adminy); // deletes ALL rows

    // add a new lobby
    const { data2, error2 } = await supabase
      .from("lobbies")
      .insert([{ word: word, players: playersWithRoles, admin: adminy }]);

    if (error2) {
      console.error(error2);
      return res.status(500).json({ error: "Failed to save game" });
    }
    res.json({ word, players: playersWithRoles });
  }
};

export const updateRole = async (req, res) => {
  const admin = req.user.username;
  const [name, status] = req.body;

  const dataOld = await getLobbyAdmin(admin);
  if (status === "guessed"){
    dataOld.forEach((item) => {
      if (item.role === 'civilian') {
        item.status = "kicked";
      }
    });
    
    const { data, error } = await supabase
      .from("lobbies")
      .update({ players: dataOld })
      .eq("admin", admin);

    res.json(true);
  } else {
    dataOld.forEach((item) => {
      if (item.name === name) {
        item.status = status;
      }
    });
  
    const { data, error } = await supabase
      .from("lobbies")
      .update({ players: dataOld })
      .eq("admin", admin);
  
    res.json(true);
  }
};

export const getResults = async(req,res)=>{
  const admin = req.user.username;
  const data = await getLobbyAdmin(admin);
  let gameWon = '';
  let gameStop = false;
  let playersLeft = 0
  let spiesLeft = 0
  
  data.forEach((item) =>{
    if (item.status === '' && item.role === 'civilian') playersLeft ++;
    if (item.status === '' && item.role === 'spy') spiesLeft ++;
    // console.log(item);
  })
  
  if (playersLeft <= spiesLeft){
    gameStop = true;
    gameWon = 'spies';
  } else if (spiesLeft === 0){
    gameStop = true;
    gameWon = 'civilians';
  }
  
  res.json({gameWon});
};

export const resetGame = async(req,res)=>{
  const admin = req.user.username;
  const resetStatus = resetLobby(admin);

  res.json(resetStatus);
};
