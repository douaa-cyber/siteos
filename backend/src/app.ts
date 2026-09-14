import express from "express";
//import routes from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { notFound } from "./common/middleware/notFound.middleware";

const app = express();
app.use(express.json());

app.use(notFound);
app.use(errorHandler);

export default app;
