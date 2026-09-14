import { expenseRepository } from "./expense.repository";
import { AppError } from "../../common/errors/AppError";
import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../config/prisma";

interface CreateExpenseDTO {
  projectId: string;
  categoryId: string;
  description: string;
  amount: number;
  supplier: string;
  paymentMethod: string;
  date: Date;
  notes?: string;
}

export const expenseService = {
  async createExpense(data: CreateExpenseDTO) {
    if (
      !data.projectId ||
      !data.categoryId ||
      !data.description ||
      data.amount === undefined ||
      !data.supplier ||
      !data.paymentMethod ||
      !data.date
    ) {
      throw new AppError("Missing required fields", 400);
    }

    if (data.amount <= 0) {
      throw new AppError("Expense amount must be greater than 0", 400);
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: {
        id: data.projectId,
      },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const prismaData: Prisma.ExpenseCreateInput = {
      description: data.description.trim(),
      amount: new Prisma.Decimal(data.amount),
      supplier: data.supplier.trim(),
      paymentMethod: data.paymentMethod,
      date: data.date,
      notes: data.notes?.trim(),

      project: {
        connect: {
          id: data.projectId,
        },
      },

      category: {
        connect: {
          id: data.categoryId,
        },
      },
    };

    return expenseRepository.create(prismaData);
  },

  async getExpenses() {
    return expenseRepository.findAll();
  },

  async getExpensesByProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return expenseRepository.findByProjectId(projectId);
  },

  async getExpense(id: string) {
    const expense = await expenseRepository.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    return expense;
  },

  async updateExpense(id: string, data: Prisma.ExpenseUpdateInput) {
    const expense = await expenseRepository.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    if (data.amount !== undefined) {
      const amount =
        typeof data.amount === "number" ? data.amount : Number(data.amount);

      if (amount <= 0) {
        throw new AppError("Expense amount must be greater than 0", 400);
      }
    }

    return expenseRepository.update(id, data);
  },

  async deleteExpense(id: string) {
    const expense = await expenseRepository.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    return expenseRepository.delete(id);
  },
};
