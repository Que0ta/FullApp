import { getSpecificUser } from "../repositories/users.repository.js";

export const getCurrentUser = async (req, res) => {
  try {
    const username = req.user.username; // from verifyToken middleware
    const user = await getSpecificUser(username);

    if (!user) {
      return res.status(404).json({ status: "not found" });
    }
    // Send only necessary info (avoid sending password)
    res.json({
      username: user.username,
      balance: user.balance, // assuming user.balance exists
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
};
