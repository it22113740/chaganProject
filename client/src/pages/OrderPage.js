import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom"; // To access cart data passed from the Cart component

const OrderPage = () => {
  const location = useLocation(); // Get cart data passed from Cart component
  const navigate = useNavigate(); // To navigate after cancellation

  const [orderItems, setOrderItems] = useState(location.state?.cartItems || []);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown (in seconds)
  const [orderCanceled, setOrderCanceled] = useState(false);

  useEffect(() => {
    // Simulate status updates after 1 minute (Taken by Delivery Person) and 30 minutes (Delivered)
    const timer1 = setTimeout(() => {
      const updatedStatus = orderItems.reduce((acc, item) => {
        acc[item.id] = "Taken by Delivery Person";
        return acc;
      }, {});
      setStatusUpdates(updatedStatus);
    }, 60000); // 1 minute

    const timer2 = setTimeout(() => {
      const updatedStatus = orderItems.reduce((acc, item) => {
        acc[item.id] = "Delivered";
        return acc;
      }, {});
      setStatusUpdates(updatedStatus);
    }, 1800000); // 30 minutes

    // Countdown timer for Cancel Order (5 minutes)
    const countdown = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1); // Decrease time every second
      } else {
        clearInterval(countdown); // Stop countdown once it reaches 0
      }
    }, 1000);

    // Clean up timers when component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(countdown);
    };
  }, [orderItems, timeLeft]);

  const handleCancelOrder = () => {
    setOrderCanceled(true);
    // Simulate cancellation by navigating to a different page (or any other action you want to perform)
    navigate("/order-canceled"); // Replace with a real cancelation page or confirmation
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f8f8f8" }}>
      {/* Global Processing Status */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff5722" }}>
          Processing
        </Typography>
      </Box>

      {/* Order Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Your Order
      </Typography>

      {/* Order Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, padding: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {statusUpdates[item.id] || "Processing"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Timer and Cancel Button */}
      {!orderCanceled && (
        <Box sx={{ marginTop: 3, textAlign: "center" }}>
          <Typography variant="h6">
            Time Left to Cancel Order: {formatTime(timeLeft)}
          </Typography>

          <Button
            variant="outlined"
            color="secondary"
            sx={{
              padding: "10px 20px",
              fontWeight: "bold",
              borderRadius: "25px",
              textTransform: "none",
              marginTop: 2,
            }}
            onClick={handleCancelOrder}
            disabled={timeLeft <= 0} // Disable cancel button when time runs out
          >
            Cancel Order
          </Button>
        </Box>
      )}

      {/* Return to Cart Button */}
      <Box sx={{ marginTop: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            borderRadius: "25px",
            textTransform: "none",
          }}
          onClick={() => navigate("/cart")}
        >
          Return to Cart
        </Button>
      </Box>
    </div>
  );
};

export default OrderPage;
