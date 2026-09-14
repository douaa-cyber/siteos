import { Router } from "express";
import * as controller from "./project.controller";

const router = Router();

router.post("/", controller.createproject);
router.get("/", controller.getprojects);
router.get("/:id", controller.getproject);
router.patch("/:id", controller.updateproject);

export default router;
