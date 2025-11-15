import { Router } from "express";
import ItemsController from "../controllers/Items";

const router = Router();

router.get("/", ItemsController.fetchItems);
router.get("/:id", ItemsController.fetchSpecificItem);
router.get("/search", ItemsController.searchForItem);
router.post("/", ItemsController.createNewItem);
router.patch("/:id", ItemsController.updateItems);
router.delete("/:id", ItemsController.deleteItem);

export default router;
