import { Router } from "express";
import SettingsController from "../controllers/Settings";

const router = Router();

router.get("/", SettingsController.getSettings);
router.get("/version", SettingsController.getApplicationVersion);
router.post("/notifications/discord", SettingsController.testDiscordWebhook);
router.post("/notifications/ntfy", SettingsController.testNtfyWebhook);
router.patch("/", SettingsController.updateSetting);
router.delete("/reset", SettingsController.resetSettings);

export default router;
