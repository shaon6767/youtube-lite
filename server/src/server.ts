import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import "./config/redis";

connectDB().then(() => {
  app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
});
