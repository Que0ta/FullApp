import { supabase } from "../config/database.js";

export async function getLobbyAdmin(adminUser) {
  const { data, error } = await supabase
    .from("lobbies")
    .select("players") // replace with your column name
    .eq("admin", adminUser);

  return data[0].players;
}

export async function resetLobby(userAdmin) {
  const { data, error } = await supabase
  .from('lobbies')
  .update({word: ''})
  .eq('admin', userAdmin)
  .select('*');

  if (error) {
    console.error('Error resetting lobby:', error.message);
    return null;
  }

  return data || error;
}
