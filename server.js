import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transtionRoute  from "./routes/transtionRouter.js";
dotenv.config();

const app = express();
const Port = process.env.PORT || 5002;

// Miidleware
app.use(rateLimiter)
app.use(express.json());




app.use("/api/transactions",transtionRoute);

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is up and running on Port:${Port}`);
  });
});
