import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentGateway = ({ open, onClose, onSubmit, cartItems }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setError("All fields are required!");
      return;
    }

    // Payment validation (simplified, you would need to connect to an actual payment API)
    if (cardNumber.length !== 16 || expiryDate.length !== 5 || cvv.length !== 3) {
      setError("Invalid payment details. Please check your inputs.");
      return;
    }

    // Simulate successful payment
    setError("");
    onSubmit();
    navigate("/order",{ state: { cartItems } }); // Redirect to /order after payment
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Paper sx={{ padding: 3, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Payment Gateway
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Card Number"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Expiry Date (MM/YY)"
            fullWidth
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="CVV"
            fullWidth
            type="password"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit Payment
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
};

export default PaymentGateway;
