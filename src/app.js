import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware);

export default app;
