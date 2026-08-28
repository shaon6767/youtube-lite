import { Router } from "express";
import {
    addComment,
    deleteComment,
    getComments,
} from "../controllers/comment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/:videoId", getComments);
router.post("/", requireAuth, addComment);
router.delete("/:id", requireAuth, deleteComment);

export default router;
