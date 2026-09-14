import prisma from "../../config/prisma";

export const dashboardRepository = {
  async getProjectData(projectId: string) {
    return prisma.project.findUnique({
      where: {
        id: projectId,
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
  },
};
