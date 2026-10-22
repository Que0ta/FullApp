import { verifyToken } from "../middleware/verifyToken.js";
import { limiter } from "../middleware/rateLimiter.js";
import { getDashboard, login, register, logout } from "../controllers/auth.controller.js";
import { getCurrentUser } from "../controllers/users.controller.js";
import { addWord, getCustomWords, deleteWord, listWords } from "../controllers/words.controller.js";
import { getLobby, startGame, updateRole, getResults, resetGame } from "../controllers/game.controller.js";
import { robots, sitemap, spa } from "../controllers/static.controller.js";

// Keep API routes before static fallbacks and preserve middleware order.
export function registerRoutes(app) {
  app.get("/api/dashboard", verifyToken, getDashboard);
  app.get("/api/users", verifyToken, getCurrentUser);
  app.post("/api/add-word", verifyToken, limiter, addWord);
  app.get("/api/custom", verifyToken, getCustomWords);
  app.post("/api/login", login);
  app.post("/api/register", register);
  app.post("/api/logout", logout);
  app.post("/api/delete-word", verifyToken, deleteWord);
  app.get("/api/words", verifyToken, listWords);
  app.get("/api/lobby", verifyToken, getLobby);
  app.post("/api/game-start", verifyToken, startGame);
  app.post("/api/update-role", verifyToken, updateRole);
  app.get("/api/get-results", verifyToken, getResults);
  app.post("/api/reset-lobby", verifyToken, resetGame);
  app.get("/robots.txt", robots);
  app.get("/sitemap.xml", sitemap);
  app.get("/*splat", spa);
}
