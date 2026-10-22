import path from "node:path";
import { fileURLToPath } from "node:url";

export const frontendRoot = fileURLToPath(new URL("../../../frontend/", import.meta.url));
export const frontendDist = path.join(frontendRoot, "dist");
