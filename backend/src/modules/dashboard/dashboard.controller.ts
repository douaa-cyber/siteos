import { Request, Response } from "express";
import { catchAsync } from "../../common/errors/catchAsync";
import { dashboardService } from "./dashboard.service";

interface ProjectParams {
  projectId: string;
}

export const getProjectDashboard = catchAsync(
  async (req: Request<ProjectParams>, res: Response) => {
    const dashboard = await dashboardService.getProjectDashboard(
      req.params.projectId,
    );

    res.status(200).json(dashboard);
  },
);
