import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI as string,
  redisUrl: process.env.REDIS_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  youtubeApiKey: process.env.YOUTUBE_API_KEY as string,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};

if (!env.mongoUri || !env.jwtSecret || !env.youtubeApiKey) {
  throw new Error("Missing required env vars. Check .env against .env.example");
}
