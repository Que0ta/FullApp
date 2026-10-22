import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { frontendDist } from "./config/paths.js";
import { registerRoutes } from "./routes/index.js";

const app = express();

app.use(helmet());


app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), fullscreen=(), payment=(), autoplay=(), clipboard-read=(), clipboard-write=(), usb=()"
  );
  next();
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.PROD_URL, // dev + prod
    credentials: true, // allow sending cookies
  })
);
app.use(express.json());

app.use(express.static(frontendDist));

registerRoutes(app);

export default app;
