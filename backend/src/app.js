import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import saleRouter from "./routes/sale.routes.js";
import reportRouter from "./routes/report.routes.js";
import reorderRouter from "./routes/reorder.routes.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";
const app = express();
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean,
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const corsError = new Error(
        `CORS blocked request from origin: ${origin}`,
      );
      corsError.statusCode = 403;
      return callback(corsError);
    },
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "1mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);
app.use(cookieParser());
app.use(express.static("public"));
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the StockTrack API",
  });
});
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/sales", saleRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/reorders", reorderRouter);
app.use(notFoundHandler);
app.use(errorHandler);
export { app };
