import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { generalLimiter } from "./middleware/rateLimiter.middleware";
import routes from "./routes";

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

app.use("/api", routes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  },
);

export default app;
