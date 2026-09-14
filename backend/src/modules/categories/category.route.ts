import { Router } from "express";
import * as controller from "./category.controller";

const router = Router();

router.post("/", controller.createCategory);
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategory);
router.patch("/:id", controller.updateCategory);

export default router;
