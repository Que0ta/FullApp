import "./env.js";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
