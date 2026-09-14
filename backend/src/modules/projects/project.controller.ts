import { Request, Response } from "express";
import { projectService } from "./project.service";
import { catchAsync } from "../../common/errors/catchAsync";

export const createproject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json(project);
});

export const getprojects = catchAsync(async (_req: Request, res: Response) => {
  const projects = await projectService.getProjects();
  res.json(projects);
});

export const getproject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.getProject(req.params.id as string);
  res.json(project);
});

export const updateproject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.updateProject(
    req.params.id as string,
    req.body,
  );
  res.json(project);
});
export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.id as string);

  res.status(204).send();
});
