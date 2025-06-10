import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transtionRoute  from "./routes/transtionRouter.js";
import job from "./config/cron.js";
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start(); // Start the cron job if in production
// Set the port from environment variable or default to 5002
const Port = process.env.PORT || 5002;

// Miidleware
app.use(rateLimiter)
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Expense Tracker API",
    status: "success",
  });
});

app.use("/api/transactions",transtionRoute);

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is up and running on Port:${Port}`);
  });
});
