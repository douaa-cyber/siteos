import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";

interface CreateCompleteProjectInput {
  project: Prisma.ProjectCreateInput;

  categories: string[];

  expenses: {
    categoryName: string;
    description: string;
    amount: number;
    supplier: string;
    paymentMethod: string;
    date: Date;
    notes?: string;
  }[];
}
export const projectRepository = {
  findAll() {
    return prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
    });
  },

  create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
    });
  },

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  },
  async createComplete(data: CreateCompleteProjectInput) {
    return prisma.$transaction(async (tx) => {
      // -----------------------------
      // 1. Create project
      // -----------------------------

      const project = await tx.project.create({
        data: data.project,
      });

      // -----------------------------
      // 2. Create / reuse categories
      // -----------------------------

      const categories = new Map<string, { id: string; name: string }>();

      for (const categoryName of data.categories) {
        const normalizedName = categoryName.trim();

        const category = await tx.category.upsert({
          where: {
            name: normalizedName,
          },
          update: {},
          create: {
            name: normalizedName,
          },
        });

        categories.set(normalizedName.toLowerCase(), category);
      }

      // -----------------------------
      // 3. Create expenses
      // -----------------------------

      for (const expense of data.expenses) {
        const category = categories.get(
          expense.categoryName.trim().toLowerCase(),
        );

        if (!category) {
          throw new Error(
            `Expense category "${expense.categoryName}" does not exist`,
          );
        }

        await tx.expense.create({
          data: {
            projectId: project.id,
            categoryId: category.id,
            description: expense.description.trim(),
            amount: new Prisma.Decimal(expense.amount),
            supplier: expense.supplier.trim(),
            paymentMethod: expense.paymentMethod,
            date: expense.date,
            notes: expense.notes?.trim() || undefined,
          },
        });
      }

      // -----------------------------
      // 4. Return complete project
      // -----------------------------

      return tx.project.findUnique({
        where: {
          id: project.id,
        },
        include: {
          expenses: {
            include: {
              category: true,
            },
            orderBy: {
              date: "desc",
            },
          },
        },
      });
    });
  },
};
