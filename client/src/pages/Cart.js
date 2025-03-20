import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import PaymentGateway from "../components/PaymentGateway" // Import the PaymentGateway component
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const initialCart = [
    {
      id: 1,
      name: "Dumbbell Set",
      description: "Adjustable dumbbells for strength training.",
      price: 59.99,
      quantity: 1,
    },
    {
      id: 2,
      name: "Yoga Mat",
      description: "Non-slip yoga mat for all floor exercises.",
      price: 19.99,
      quantity: 2,
    },
    {
      id: 3,
      name: "Resistance Bands",
      description: "Set of 5 resistance bands for strength training.",
      price: 29.99,
      quantity: 1,
    },
    {
      id: 4,
      name: "Kettlebell",
      description: "Cast iron kettlebell for functional training.",
      price: 39.99,
      quantity: 1,
    },
  ];

  const [cartItems, setCartItems] = useState(initialCart);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  const handleCheckoutClick = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentSubmit = () => {
    // After successful payment, close the modal
    setIsPaymentOpen(false);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "30px", backgroundColor: "#f8f8f8" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Cart
      </Typography>

      {/* Cart Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, padding: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    style={{
                      width: "50px",
                      padding: "8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{
                      padding: "6px 12px",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cart Summary */}
      <Box
        sx={{
          marginTop: 3,
          padding: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Cart Summary</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "250px" }}>
          <Typography variant="body1">Total Price:</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>

        {/* Checkout Button */}
        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "10px 20px",
              fontWeight: "bold",
              borderRadius: "25px",
              textTransform: "none",
            }}
            disabled={cartItems.length === 0}
            onClick={handleCheckoutClick}
          >
            Checkout
          </Button>
        </Box>
      </Box>

      {/* Payment Gateway Modal */}
      <PaymentGateway open={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onSubmit={handlePaymentSubmit} cartItems={cartItems}/>
    </div>
  );
};

export default Cart;
