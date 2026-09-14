export interface DashboardProject {
  id: string;
  name: string;
  location: string;
  clientName: string;
  budget: number;
  progress: number;
  status: string;
  startDate: string;
  expectedEndDate: string;
}

export interface FinancialSummary {
  budget: number;
  spent: number;
  remaining: number;
  budgetConsumed: number;
}

export interface ProgressSummary {
  physical: number;
  financial: number;
  gap: number;
}

export interface Insight {
  type: "success" | "warning" | "danger";
  message: string;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

export interface RecentExpense {
  id: string;
  description: string;
  amount: number;
  supplier: string;
  paymentMethod: string;
  date: string;
  category: string;
}

export interface DashboardData {
  project: DashboardProject;
  financial: FinancialSummary;
  progress: ProgressSummary;
  insight: Insight;
  expensesByCategory: ExpenseByCategory[];
  recentExpenses: RecentExpense[];
}