import { Router } from "express";
import * as controller from "./expense.controller";

const router = Router();

router.post("/", controller.createExpense);
router.get("/", controller.getExpenses);
router.get("/:id", controller.getExpense);
router.patch("/:id", controller.updateExpense);

export default router;
