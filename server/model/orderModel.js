import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
     //here add relavent ucustomer id connect from customer table
     customerName: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    orderType: { type: String, enum: ["Gym Equipment", "Food"], required: true },
    items: [{
        id: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
       
    }],
    deliveryAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Pending"], required: true },
    deliveryStatus: { type: String, enum: ["Waiting for deliver person pickup","pick by deliver person", "Processing","Delivered"], required: true },
    deliveryDate: { type: Date, required: true }
});

const OrderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default OrderModel;