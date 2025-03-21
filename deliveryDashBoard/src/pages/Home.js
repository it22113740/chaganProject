import React, { useEffect, useState } from "react";
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
  Card,
  CardContent,
  Box,
  TextField,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    pickedForDeliveryOrders: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
 
  




  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/order/get-all-orders");
        const data = await response.json();
  
        console.log("Fetched data:", data); // Check what data is coming back
  
        // Check if data contains 'orders' and if it is an array
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
  
          // Filter out orders with "Waiting for deliver person pickup" or "Processing"
          const filteredData = data.orders.filter(
            (order) => order.deliveryStatus !== "Processing"
          );
          setFilteredOrders(filteredData);
          console.log("Filtered Orders:", filteredData); // Check filtered data
  
          // Calculate statistics
          let total = filteredData.length;
          let pending = filteredData.filter((order) => order.deliveryStatus === "Pending").length;
          let pickedForDelivery = filteredData.filter(
            (order) => order.deliveryStatus === "Picked For Delivery"
          ).length;
          let completed = filteredData.filter(
            (order) => order.deliveryStatus === "Delivered"
          ).length;
  
          setStatistics({
            totalOrders: total,
            pendingOrders: pending,
            pickedForDeliveryOrders: pickedForDelivery,
            completedOrders: completed,
          });
        } else {
          console.error("Orders data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  // Handle search input change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);

    // Filter orders by Order ID and exclude "Waiting for deliver person pickup" or "Processing" statuses
    const filtered = orders
      .filter(
        (order) =>
          order.deliveryStatus !== "Waiting for deliver person pickup" &&
          order.deliveryStatus !== "Processing"
      )
      .filter((order) =>
        order.orderId.toString().includes(event.target.value)
      );
    setFilteredOrders(filtered);
  };

  // Handle "Take Order" button click
  // const handleTakeOrder = (orderId) => {
  //   const updatedOrders = orders.map((order) =>
  //     order.orderId === orderId
  //       ? { ...order, deliveryStatus: "Picked For Delivery" }
  //       : order
  //   );
  //   setOrders(updatedOrders);
  //   setFilteredOrders(updatedOrders);

  //   // Update statistics
  //   setStatistics({
  //     ...statistics,
  //     pendingOrders: statistics.pendingOrders - 1,
  //     pickedForDeliveryOrders: statistics.pickedForDeliveryOrders + 1,
  //   });
  // };

  // Handle "Completed" button click
  // const handleCompletedOrder = (orderId) => {
  //   const updatedOrders = orders.map((order) =>
  //     order.orderId === orderId ? { ...order, deliveryStatus: "Delivered" } : order
  //   );
  //   setOrders(updatedOrders);
  //   setFilteredOrders(updatedOrders);

  //   // Update statistics
  //   setStatistics({
  //     ...statistics,
  //     completedOrders: statistics.completedOrders + 1,
  //     pickedForDeliveryOrders: statistics.pickedForDeliveryOrders - 1,
  //   });
  // };

  // Generate Report for Completed Orders as PDF
  const generateCompletedOrdersReport = () => {
    const completedOrders = orders.filter(
      (order) => order.deliveryStatus === "Delivered"
    );

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set title
    doc.setFontSize(18);
    doc.text("Completed Orders Report", 14, 20);

    // Set the column headers
    const headers = [
      "Order ID",
      "Customer Name",
      "Delivery Address",
      "Order Date",
      "Total Amount",
      "Delivery Status",
    ];

    // Set font for the table
    doc.setFontSize(12);
    autoTable(doc, {
      head: [headers],
      body: completedOrders.map((order) => [
        order.orderId,
        order.customerName,
        order.deliveryAddress,
        new Date(order.orderDate).toLocaleDateString(),
        `$${order.totalAmount}`,
        order.deliveryStatus,
      ]),
      startY: 30,
    });

    // Download the PDF
    doc.save("completed_orders_report.pdf");
  };




  const handleTakeOrder = async (orderId) => {
    setIsLoading(true);  // Optional: set loading state
    try {
      // Send POST request to the API endpoint
      const response = await fetch("http://localhost:4000/api/order/take-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),  // Pass orderId to the API
      });

      // Handle the response
      const data = await response.json();
      if (response.ok) {
        console.log("Order taken successfully:", data);
        // Optionally, update state or UI after the order is taken
      } else {
        console.error("Failed to take order:", data.message);
      }
    } catch (error) {
      console.error("Error occurred while taking order:", error);
    } finally {
      setIsLoading(false);  // Stop loading after request completes
    }
  };


  const handleCompletedOrder = async (orderId) => {
    try {
      const response = await fetch("http://localhost:4000/api/order/completeOrder", {
        method: "PUT",  // PUT method for updating order status
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),  // Send orderId in the request body
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Order marked as completed successfully:", data);
        // Optionally, update state or UI to reflect the change
      } else {
        console.error("Failed to complete order:", data.message);
      }
    } catch (error) {
      console.error("Error occurred while completing order:", error);
    }
  };
  

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Delivery Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              textAlign: "center",
              backgroundColor: "primary.light",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{statistics.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              textAlign: "center",
              backgroundColor: "primary.light",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Picked For Delivery</Typography>
              <Typography variant="h4">{statistics.pickedForDeliveryOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              textAlign: "center",
              backgroundColor: "primary.light",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Completed Orders</Typography>
              <Typography variant="h4">{statistics.completedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Search by Order ID"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "50%" }}
        />
      </Box>

      {/* Generate Report Button */}
      <Box sx={{ marginTop: 3, textAlign: "center" }}>
        <Button variant="contained" onClick={generateCompletedOrdersReport}>
          Generate Completed Orders Report (PDF)
        </Button>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.deliveryAddress}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>{order.deliveryStatus}</TableCell>
                <TableCell>
                  {/* Show Take Order button if the status is Pending */}
                  {order.deliveryStatus === "Waiting for deliver person pickup" && (
                    // <Button
                    //   sx={{
                    //     backgroundColor: "#4caf50",
                    //     color: "white",
                    //     "&:disabled": {
                    //       backgroundColor: "#bdbdbd",
                    //     },
                    //   }}
                    //   onClick={() => handleTakeOrder(order.orderId)}
                    // >
                    //   Take Order
                    // </Button>

                    <Button
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      "&:disabled": {
                        backgroundColor: "#bdbdbd",
                      },
                    }}
                    onClick={() => handleTakeOrder(order.orderId)}  // Pass orderId to handleTakeOrder
                    disabled={isLoading}  // Disable button while loading
                  >
                    {isLoading ? "Taking Order..." : "Take Order"}  {/* Loading text */}
                  </Button>

                  )}

                  {/* Show Completed button if the status is Picked for Delivery */}
                  {order.deliveryStatus === "Picked For Delivery" && (
                    <Button
                    sx={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                    }}
                    onClick={() => handleCompletedOrder(order.orderId)}
                  >
                    Completed
                  </Button>
                  
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
