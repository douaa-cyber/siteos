import { AppError } from "../../common/errors/AppError";
import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  async getProjectDashboard(projectId: string) {
    const project = await dashboardRepository.getProjectData(projectId);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // -----------------------------
    // Financial calculations
    // -----------------------------

    const totalSpent = project.expenses.reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);

    const budget = Number(project.budget);

    const remaining = budget - totalSpent;

    const budgetConsumed = budget > 0 ? (totalSpent / budget) * 100 : 0;

    const progress = project.progress;

    const progressGap = budgetConsumed - progress;

    // -----------------------------
    // Insight
    // -----------------------------

    let insight: {
      type: "success" | "warning" | "danger";
      message: string;
    };

    if (progressGap >= 15) {
      insight = {
        type: "danger",
        message: `Spending is ${Math.round(
          progressGap,
        )}% ahead of project progress.`,
      };
    } else if (progressGap > 5) {
      insight = {
        type: "warning",
        message: `Spending is ${Math.round(
          progressGap,
        )}% ahead of project progress.`,
      };
    } else if (progressGap < -10) {
      insight = {
        type: "success",
        message: "Project progress is ahead of spending.",
      };
    } else {
      insight = {
        type: "success",
        message: "Spending is currently aligned with project progress.",
      };
    }

    // -----------------------------
    // Expenses by category
    // -----------------------------

    const categoryTotals: Record<string, number> = {};

    for (const expense of project.expenses) {
      const categoryName = expense.category.name;

      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }

      categoryTotals[categoryName] += Number(expense.amount);
    }

    const expensesByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    // -----------------------------
    // Recent expenses
    // -----------------------------

    const recentExpenses = project.expenses.slice(0, 5).map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      supplier: expense.supplier,
      paymentMethod: expense.paymentMethod,
      date: expense.date,
      category: expense.category.name,
    }));

    // -----------------------------
    // Response
    // -----------------------------

    return {
      project: {
        id: project.id,
        name: project.name,
        location: project.location,
        clientName: project.clientName,
        budget,
        progress,
        status: project.status,
        startDate: project.startDate,
        expectedEndDate: project.expectedEndDate,
      },

      financial: {
        budget,
        spent: totalSpent,
        remaining,
        budgetConsumed: Number(budgetConsumed.toFixed(2)),
      },

      progress: {
        physical: progress,
        financial: Number(budgetConsumed.toFixed(2)),
        gap: Number(progressGap.toFixed(2)),
      },

      insight,

      expensesByCategory,

      recentExpenses,
    };
  },
};
