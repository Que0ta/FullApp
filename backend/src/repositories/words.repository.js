import { supabase } from "../config/database.js";

export async function getWords() {
  const { data, error } = await supabase.from("words").select("word");
  return data;
}
