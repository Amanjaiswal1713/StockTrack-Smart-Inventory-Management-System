import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import connectDB from "./config/db.js";
import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 5000;
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`StockTrack server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/v1/healthcheck`);
    });
    server.on("error", (error) => {
      console.error("Express server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("StockTrack startup failed:", error.message);
    process.exit(1);
  }
};
startServer();
