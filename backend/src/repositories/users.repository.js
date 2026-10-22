import { supabase } from "../config/database.js";

export async function getUsers() {
  const { data, error } = await supabase.from("users").select();
  return data;
}

export async function insertNewWord(id, word) {
  const { error } = await supabase
    .from("users")
    .update({ words: word })
    .eq("id", id);
}

export async function registerUser(user, pass) {
  const { error } = await supabase
    .from("users")
    .insert({ username: user, password: pass, balance: 0 });
}

export async function getSpecificUser(login) {
  const { data, error } = await supabase
    .from("users")
    .select("*") // only select what you need
    .eq("username", login)
    .single(); // returns a single object instead of array

  if (error) {
    // console.log("Supabase error:", error);
    return null; // return null if not found or error
  }
  return data; // object { username, password }
}
