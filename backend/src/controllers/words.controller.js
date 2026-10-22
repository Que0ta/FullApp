import { supabase } from "../config/database.js";
import { getSpecificUser, insertNewWord } from "../repositories/users.repository.js";
import { getWords } from "../repositories/words.repository.js";

export const addWord = async (req, res) => {
  const username = req.user.username;
  const wantedWord = req.body;
  const user = await getSpecificUser(username);
  const allWords = user.words || [];
  const double = allWords.includes(wantedWord.word.toLowerCase());
  if (double === false) {
    allWords.push(wantedWord.word);
    const insertio = await insertNewWord(user.id, allWords);
  } else {
    res.status(200).json({
      status: "false",
      data: allWords,
    });
  }
  res.status(200).json({
    status: "success",
    data: allWords,
  });
};

export const getCustomWords = async (req, res) => {
  const username = req.user.username;
  const user = await getSpecificUser(username);
  const allWords = user.words || [];
  res.json(allWords);
};

export const deleteWord = async (req, res) => {
  const username = req.user.username;
  const deleteWord = req.body.word;
  const user = await getSpecificUser(username);
  const words = user.words;
  if (words.includes(deleteWord)) {
    // console.log('exists!');
    const { data, error } = await supabase
      .from("users")
      .select("words")
      .eq("id", user.id)
      .single();

    if (!error) {
      const newWords = data.words.filter((w) => w !== deleteWord);

      await supabase
        .from("users")
        .update({ words: newWords })
        .eq("id", user.id);
    }
    console.log(data, error);
  } else {
    console.log("not completed!");
  }
  res.json("Success!");
};

export const listWords = async (req, res) => {
  // console.log('fetch words');
  const data = await getWords();
  const wordList = [];
  data.forEach((keyWord) => {
    wordList.push(keyWord.word);
  });
  return res.json(wordList);
};
