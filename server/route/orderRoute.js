// Routes: orderRoutes.js
import express from "express";
import { createOrder, deleteOrder, getAllOrders, updateOrder } from "../controller/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/get-all-orders", getAllOrders);
orderRouter.get("/:id", getAllOrders);
orderRouter.put("/update/:id", updateOrder);
orderRouter.delete("/delete/:id", deleteOrder);

export default orderRouter;
