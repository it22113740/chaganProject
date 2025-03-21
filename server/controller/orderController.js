import OrderModel from "../model/orderModel.js";
import path from "path";
import fs from "fs";
// Create Order
export const createOrder = async (req, res) => {
  const {
    orderId,
    customerName,
    orderType,
    items,
    deliveryAddress,
    totalAmount,
    paymentStatus,
    deliveryStatus,
    deliveryDate,
  } = req.body;

  if (
    !orderId ||
    !customerName ||
    !orderType ||
    !items ||
    !deliveryAddress ||
    !totalAmount ||
    !paymentStatus ||
    !deliveryStatus ||
    !deliveryDate
  ) {
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
      deliveryDate,
    });

    await newOrder.save();

    return res
      .status(201)
      .json({
        success: true,
        message: "Order created successfully",
        order: newOrder,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
  }
};
// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update order",
        error: error.message,
      });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete order",
        error: error.message,
      });
  }
};

const deliveryDataPath = path.resolve(
  "C:/Users/kanth/OneDrive/Desktop/Chagan/chaganProject/deliveryDashBoard/public/deliveryPerson.json"
);

export const takeOrder = async (req, res) => {
  const { orderId, deliveryPersonId } = req.body;

  try {
    // Find the order and update the delivery person ID
    const order = await OrderModel.findOneAndUpdate(
      { orderId },
      {
        deliveryPersonId,
        deliveryStatus: "pick by deliver person", // Update the delivery status
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Read delivery person data from the JSON file
    const deliveryData = JSON.parse(fs.readFileSync(deliveryDataPath, "utf8"));

    // Check if the delivery person matches the ID
    if (Number(deliveryData.id) !== Number(deliveryPersonId)) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    // Respond with the order and delivery person details
    res.status(200).json({
      order,
      deliveryPerson: {
        name: deliveryData.name,
        phone: deliveryData.phone,
        vehicle: deliveryData.vehicle,
        profilePicture: deliveryData.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




export const completeOrder = async (req, res) => {
    const { orderId, deliveryPersonId } = req.body;
  
    try {
      // Find and update the order with the completed delivery status and payment status
      const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
          deliveryPersonName: deliveryPersonId, // Assuming you are storing the person's name instead of ID
          deliveryStatus: "Delivered", // Set the status to Delivered
          paymentStatus: "Paid", // Set the payment status to Paid
        },
        { new: true }
      );
  
      // Check if the order exists
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Read the delivery person data from the JSON file
      const deliveryData = JSON.parse(fs.readFileSync(deliveryDataPath, "utf8"));
  
      // Since deliveryData is an object, check if it matches the deliveryPersonId
      if (Number(deliveryData.id) !== Number(deliveryPersonId)) {
        return res.status(404).json({ message: "Delivery person not found" });
      }
  
      // Return the order with the delivery person details
      res.status(200).json({
        order,
        deliveryPerson: {
          name: deliveryData.name,
          phone: deliveryData.phone,
          vehicle: deliveryData.vehicle,
          profilePicture: deliveryData.profilePicture,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };