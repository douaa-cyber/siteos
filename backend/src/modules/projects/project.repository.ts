import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";

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
};
