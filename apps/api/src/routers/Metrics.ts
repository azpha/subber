import { Router } from "express";
import MetricsController from "../controllers/Metrics";

const router = Router();

router.get("/cpm", MetricsController.getEstimatedCostPerMonth);
router.get("/topFive", MetricsController.topFiveSpenders);

export default router;
