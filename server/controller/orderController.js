import OrderModel from "../model/orderModel.js";

// Create Order
export const createOrder = async (req, res) => {
    const { orderId, customerName, orderType, items, deliveryAddress, totalAmount, paymentStatus, deliveryStatus, deliveryDate } = req.body;

    if (!orderId || !customerName || !orderType || !items || !deliveryAddress || !totalAmount || !paymentStatus || !deliveryStatus || !deliveryDate) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const newOrder = new OrderModel({
            orderId,
            customerName,
            orderDate: new Date(),
            orderType,
            items,
            deliveryAddress,
            totalAmount,
            paymentStatus,
            deliveryStatus,
            deliveryDate
        });

        await newOrder.save();

        return res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
    }
};
// Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
    }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
    }
};

// Update Order
export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
    }
};

// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
    }
};
