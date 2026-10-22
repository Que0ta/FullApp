import app from "./app.js";
import { PORT } from "./config/env.js";

// After defining all routes
if (app._router) {
  console.log("Registered Express routes:");
  app._router.stack
    .filter(r => r.route)
    .map(r => r.route.path)
    .forEach(path => console.log(path));
} else {
  console.log("No routes registered yet.");
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));