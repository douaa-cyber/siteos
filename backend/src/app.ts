import express from "express";
//import routes from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { notFound } from "./common/middleware/notFound.middleware";
import projectRoutes from "./modules/projects/project.route";
import expenseRoutes from "./modules/expenses/expense.route";
import categoryRoutes from "./modules/categories/category.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
const app = express();
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
