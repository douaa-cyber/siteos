import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { catchAsync } from "../../common/errors/catchAsync";

interface CategoryParams {
  id: string;
}

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json(category);
  },
);

export const getCategories = catchAsync(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getCategories();

    res.status(200).json(categories);
  },
);

export const getCategory = catchAsync(
  async (req: Request<CategoryParams>, res: Response) => {
    const category = await categoryService.getCategory(req.params.id);

    res.status(200).json(category);
  },
);

export const updateCategory = catchAsync(
  async (req: Request<CategoryParams>, res: Response) => {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );

    res.status(200).json(category);
  },
);

export const deleteCategory = catchAsync(
  async (req: Request<CategoryParams>, res: Response) => {
    await categoryService.deleteCategory(req.params.id);

    res.status(204).send();
  },
);
