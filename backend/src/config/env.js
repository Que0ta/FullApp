import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.SUPER_KEY;
export const PORT = process.env.PORT || 5000;
