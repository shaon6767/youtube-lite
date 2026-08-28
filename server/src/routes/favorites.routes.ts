import { Router } from "express";
import {
    addFavorite,
    getFavorites,
    removeFavorite,
} from "../controllers/favorites.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);

router.post("/", addFavorite);
router.get("/", getFavorites);
router.delete("/:videoId", removeFavorite);

export default router;
