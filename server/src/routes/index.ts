import { Router } from "express";
import authRoutes from "./auth.routes";
import commentRoutes from "./comment.routes";
import favoritesRoutes from "./favorites.routes";
import historyRoutes from "./history.routes";
import youtubeRoutes from "./youtube.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/youtube", youtubeRoutes);
router.use("/history", historyRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/comments", commentRoutes);

export default router;
