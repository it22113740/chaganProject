import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import orderRouter from "./route/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(
  cors({
    origin: "http://localhost:3001", // adjust as needed
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/order',orderRouter)
//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
