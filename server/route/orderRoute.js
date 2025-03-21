// Routes: orderRoutes.js
import express from "express";
import { completeOrder, createOrder, deleteOrder, getAllOrders, takeOrder, updateOrder } from "../controller/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/get-all-orders", getAllOrders);
orderRouter.get("/:id", getAllOrders);
orderRouter.put("/update/:id", updateOrder);
orderRouter.delete("/delete/:id", deleteOrder);
orderRouter.post("/take-order", takeOrder);
orderRouter.put("/completeOrder", completeOrder);



export default orderRouter;
