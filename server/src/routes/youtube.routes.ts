import { Router } from "express";
import {
    categories,
    popular,
    related,
    search,
    videoDetails,
} from "../controllers/youtube.controller";
import { cache } from "../middleware/cache.middleware";
import { searchLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.get("/search", searchLimiter, cache(3600), search);
router.get("/popular", cache(3600), popular);
router.get("/categories", cache(86400), categories);
router.get("/video/:videoId", cache(3600), videoDetails);
router.get("/video/:videoId/related", cache(3600), related);

export default router;
