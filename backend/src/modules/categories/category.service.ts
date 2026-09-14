import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../common/errors/AppError";
import { categoryRepository } from "./category.repository";

interface CreateCategoryDTO {
  name: string;
}

export const categoryService = {
  async createCategory(data: CreateCategoryDTO) {
    if (!data.name) {
      throw new AppError("Category name is required", 400);
    }

    const name = data.name.trim();

    if (!name) {
      throw new AppError("Category name cannot be empty", 400);
    }

    const existingCategory = await categoryRepository.findByName(name);

    if (existingCategory) {
      throw new AppError("Category already exists", 409);
    }

    const prismaData: Prisma.CategoryCreateInput = {
      name,
    };

    return categoryRepository.create(prismaData);
  },

  async getCategories() {
    return categoryRepository.findAll();
  },

  async getCategory(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  },

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (data.name !== undefined) {
      const name = typeof data.name === "string" ? data.name.trim() : "";

      if (!name) {
        throw new AppError("Category name cannot be empty", 400);
      }

      const existingCategory = await categoryRepository.findByName(name);

      if (existingCategory && existingCategory.id !== id) {
        throw new AppError("Category already exists", 409);
      }

      data.name = name;
    }

    return categoryRepository.update(id, data);
  },

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return categoryRepository.delete(id);
  },
};
