import { Request, Response } from "express";
import { expenseService } from "./expense.service";
import { catchAsync } from "../../common/errors/catchAsync";

interface ExpenseParams {
  id: string;
}

interface ProjectParams {
  projectId: string;
}

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await expenseService.createExpense({
    ...req.body,
    date: new Date(req.body.date),
  });

  res.status(201).json(expense);
});

export const getExpenses = catchAsync(async (_req: Request, res: Response) => {
  const expenses = await expenseService.getExpenses();

  res.status(200).json(expenses);
});

export const getExpense = catchAsync(
  async (req: Request<ExpenseParams>, res: Response) => {
    const expense = await expenseService.getExpense(req.params.id);

    res.status(200).json(expense);
  },
);

export const getExpensesByProject = catchAsync(
  async (req: Request<ProjectParams>, res: Response) => {
    const expenses = await expenseService.getExpensesByProject(
      req.params.projectId,
    );

    res.status(200).json(expenses);
  },
);

export const updateExpense = catchAsync(
  async (req: Request<ExpenseParams>, res: Response) => {
    const expense = await expenseService.updateExpense(req.params.id, req.body);

    res.status(200).json(expense);
  },
);

export const deleteExpense = catchAsync(
  async (req: Request<ExpenseParams>, res: Response) => {
    await expenseService.deleteExpense(req.params.id);

    res.status(204).send();
  },
);
