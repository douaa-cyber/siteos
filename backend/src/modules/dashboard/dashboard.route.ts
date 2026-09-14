import { Router } from "express";
import { getProjectDashboard } from "./dashboard.controller";

const router = Router();

router.get("/projects/:projectId", getProjectDashboard);

export default router;
