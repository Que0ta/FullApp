import path from "node:path";
import { frontendRoot } from "../config/paths.js";

export const robots = (req, res) => {
  res.sendFile(path.join(frontendRoot, "public/robots.txt"));
};

export const sitemap = (req, res) => {
  res.sendFile(path.join(frontendRoot, "public/sitemap.xml"));
};

export const spa = async (req, res) => {
  res.sendFile(path.join(frontendRoot, "dist/index.html"));
};
