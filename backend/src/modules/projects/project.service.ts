import { projectRepository } from "./project.repository";
import { AppError } from "../../common/errors/AppError";
import { Prisma } from "../../../generated/prisma/client";

interface CreateProjectDTO {
  name: string;
  location: string;
  clientName: string;
  budget: number;
  progress?: number;
  status?: string;
  startDate: Date;
  expectedEndDate: Date;
}

export const projectService = {
  async createProject(data: CreateProjectDTO) {
    // 1. Validate required fields
    if (
      !data.name ||
      !data.location ||
      !data.clientName ||
      data.budget === undefined ||
      !data.startDate ||
      !data.expectedEndDate
    ) {
      throw new AppError("Missing required fields", 400);
    }

    // 2. Validate budget
    if (data.budget <= 0) {
      throw new AppError("Project budget must be greater than 0", 400);
    }

    // 3. Validate progress
    if (
      data.progress !== undefined &&
      (data.progress < 0 || data.progress > 100)
    ) {
      throw new AppError("Progress must be between 0 and 100", 400);
    }

    // 4. Validate dates
    if (data.expectedEndDate <= data.startDate) {
      throw new AppError("Expected end date must be after start date", 400);
    }

    // 5. Build Prisma input
    const prismaData: Prisma.ProjectCreateInput = {
      name: data.name.trim(),
      location: data.location.trim(),
      clientName: data.clientName.trim(),

      budget: new Prisma.Decimal(data.budget),

      progress: data.progress ?? 0,

      status: data.status ?? "ACTIVE",

      startDate: data.startDate,
      expectedEndDate: data.expectedEndDate,
    };

    // 6. Create project
    return projectRepository.create(prismaData);
  },

  async getProjects() {
    return projectRepository.findAll();
  },

  async getProject(id: string) {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return project;
  },

  async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
    // 1. Check project exists
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // 2. Validate progress if provided
    if (data.progress !== undefined) {
      const progress =
        typeof data.progress === "number"
          ? data.progress
          : Number(data.progress);

      if (progress < 0 || progress > 100) {
        throw new AppError("Progress must be between 0 and 100", 400);
      }
    }

    // 3. Update
    return projectRepository.update(id, data);
  },

  async deleteProject(id: string) {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return projectRepository.delete(id);
  },
};
