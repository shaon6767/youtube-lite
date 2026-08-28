import { Router } from "express";
import {
    addToHistory,
    clearHistory,
    getHistory,
} from "../controllers/history.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);

router.post("/", addToHistory);
router.get("/", getHistory);
router.delete("/", clearHistory);

export default router;
