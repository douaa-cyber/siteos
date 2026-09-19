import { projectRepository } from "./project.repository";
import { AppError } from "../../common/errors/AppError";
import { Prisma } from "../../../generated/prisma/client";

export interface CreateProjectDTO {
  name: string;
  location: string;
  clientName: string;

  budget: number;

  progress?: number;
  status?: string;

  startDate: Date;
  expectedEndDate: Date;

  categories?: {
    name: string;
  }[];

  expenses?: {
    categoryName: string;
    description: string;
    amount: number;
    supplier: string;
    paymentMethod: string;
    date: Date;
    notes?: string;
  }[];
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
    const startDate = new Date(data.startDate);
    const expectedEndDate = new Date(data.expectedEndDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(expectedEndDate.getTime())
    ) {
      throw new AppError("Invalid project dates", 400);
    }

    if (expectedEndDate <= startDate) {
      throw new AppError("Expected end date must be after start date", 400);
    }

    // 5. Default categories
    const defaultCategories = [
      "Materials",
      "Labor",
      "Transport",
      "Equipment",
      "Subcontracting",
      "Other",
    ];

    // 6. Normalize custom categories
    const categories = data.categories ?? [];

    const categoryNames = categories.map((category) => category.name.trim());

    const duplicateCategories = categoryNames.filter(
      (name, index) => categoryNames.indexOf(name) !== index,
    );

    if (duplicateCategories.length > 0) {
      throw new AppError(`Duplicate category: ${duplicateCategories[0]}`, 400);
    }

    if (categoryNames.some((name) => !name)) {
      throw new AppError("Category name cannot be empty", 400);
    }

    // 7. Always include default categories
    const finalCategories = [
      ...new Set([...defaultCategories, ...categoryNames]),
    ];

    // 8. Validate expenses
    const expenses = data.expenses ?? [];

    for (const expense of expenses) {
      if (
        !expense.categoryName ||
        !expense.description ||
        expense.amount === undefined ||
        !expense.supplier ||
        !expense.paymentMethod ||
        !expense.date
      ) {
        throw new AppError("All expense fields are required", 400);
      }

      if (expense.amount <= 0) {
        throw new AppError("Expense amount must be greater than 0", 400);
      }

      const expenseDate = new Date(expense.date);

      if (Number.isNaN(expenseDate.getTime())) {
        throw new AppError("Invalid expense date", 400);
      }

      // Normalize the date
      expense.date = expenseDate;

      const expenseCategory = expense.categoryName.trim();

      if (!finalCategories.includes(expenseCategory)) {
        throw new AppError(
          `Expense category "${expense.categoryName}" does not exist`,
          400,
        );
      }
    }

    // 9. Build Prisma project input
    const prismaData: Prisma.ProjectCreateInput = {
      name: data.name.trim(),
      location: data.location.trim(),
      clientName: data.clientName.trim(),

      budget: new Prisma.Decimal(data.budget),

      progress: data.progress ?? 0,

      status: data.status ?? "ACTIVE",

      startDate,
      expectedEndDate,
    };

    // 10. Create everything atomically
    return projectRepository.createComplete({
      project: prismaData,
      categories: finalCategories,
      expenses,
    });
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

    // 2. Validate progress
    if (data.progress !== undefined) {
      const progress =
        typeof data.progress === "number"
          ? data.progress
          : Number(data.progress);

      if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
        throw new AppError("Progress must be between 0 and 100", 400);
      }
    }

    // 3. Prepare update data
    const updateData: Prisma.ProjectUpdateInput = {
      ...data,
    };

    // 4. Normalize startDate
    if (typeof data.startDate === "string") {
      const startDate = new Date(data.startDate);

      if (Number.isNaN(startDate.getTime())) {
        throw new AppError("Invalid start date", 400);
      }

      updateData.startDate = startDate;
    }

    // 5. Normalize expectedEndDate
    if (typeof data.expectedEndDate === "string") {
      const expectedEndDate = new Date(data.expectedEndDate);

      if (Number.isNaN(expectedEndDate.getTime())) {
        throw new AppError("Invalid expected end date", 400);
      }

      updateData.expectedEndDate = expectedEndDate;
    }

    // 6. Update
    return projectRepository.update(id, updateData);
  },

  async deleteProject(id: string) {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return projectRepository.delete(id);
  },
};
