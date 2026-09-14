import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";

export const categoryRepository = {
  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
    });
  },

  async findAll() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
    });
  },
  async findByName(name: string) {
    return prisma.category.findUnique({
      where: {
        name,
      },
    });
  },

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  },
};
