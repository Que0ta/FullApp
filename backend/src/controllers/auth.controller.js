import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { getSpecificUser, registerUser } from "../repositories/users.repository.js";

export const getDashboard = (req, res) => {
  res.json({ user: req.user.username });
};

export const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await getSpecificUser(login);
    if (!user) {
      return res.json({ status: "not" }); // user not found
    }

    // Compare entered password with hashed password in DB
    const validPass = await bcrypt.compare(password.trim(), user.password);
    if (!validPass) {
      return res.json({ status: "pass" });
    }

    // Create JWT with username
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: 1000 * 60 * 15 }
    );

    // Save JWT in HTTP-only cookie (cannot be read by JS)
    res.cookie("token", token, {
      httpOnly: true, // XSS
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, 
    });

    res.json({ status: "logged", login: user.username });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
};

export const register = async (req, res) => {
  const { login, password } = req.body;
  const updatedPass = await bcrypt.hash(password, 10);
  await registerUser(login, updatedPass);
  return res.redirect("/");
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true, 
    sameSite: "strict",
    expires: new Date(0),
  });
  res.json({ status: "not" });
};
