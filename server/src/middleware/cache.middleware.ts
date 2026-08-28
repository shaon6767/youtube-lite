import { NextFunction, Request, Response } from "express";
import { redis } from "../config/redis";

// Only caches successful (2xx) responses — a failed YouTube call
// must never get cached, or every request would fail for the TTL window.
export function cache(ttlSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      console.error("Redis read failed", err);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis
          .set(key, JSON.stringify(body), "EX", ttlSeconds)
          .catch((err) => console.error("Redis write failed", err));
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
}
