import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";

export const expenseRepository = {
  async create(data: Prisma.ExpenseCreateInput) {
    return prisma.expense.create({
      data,
      include: {
        category: true,
      },
    });
  },

  async findAll() {
    return prisma.expense.findMany({
      include: {
        category: true,
        project: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        project: true,
      },
    });
  },

  async findByProjectId(projectId: string) {
    return prisma.expense.findMany({
      where: {
        projectId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  },

  async update(id: string, data: Prisma.ExpenseUpdateInput) {
    return prisma.expense.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.expense.delete({
      where: { id },
    });
  },
};
