import { Router } from "express";
import SettingsController from "../controllers/Settings";

const router = Router();

router.get("/", SettingsController.getSettings);
router.patch("/", SettingsController.updateSetting);
router.get("/version", SettingsController.getApplicationVersion);
router.delete("/reset", SettingsController.resetSetting);

export default router;
