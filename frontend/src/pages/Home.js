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
} from "@mui/material";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // Fetch orders data (using the local JSON file for now)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/orders.json"); // Fetch orders data
        const data = await response.json();
        setOrders(data);

        // Calculate statistics
        let total = data.length;
        let pending = 0;
        let completed = data.filter(
          (order) => order.status === "Completed"
        ).length;

        setStatistics({
          totalOrders: total,
          pendingOrders: pending,
          completedOrders: completed,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle "Take Order" button click
  const handleTakeOrder = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "Picked for Delivery" } : order
    );
    setOrders(updatedOrders);
    setStatistics({
      ...statistics,
      pendingOrders: statistics.pendingOrders + 1,
      //completedOrders: statistics.completedOrders + 1,
    });
  };

  // Handle "Completed" button click
  const handleCompletedOrder = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "Completed" } : order
    );
    setOrders(updatedOrders);
    setStatistics({
      ...statistics,
      completedOrders: statistics.completedOrders + 1,
      pendingOrders: statistics.pendingOrders - 1,
    });
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
              <Typography variant="h4">{statistics.pendingOrders}</Typography>
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

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  {/* Show Take Order button if the status is Pending */}
                  {order.status === "Pending" && (
                    <Button
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        "&:disabled": {
                          backgroundColor: "#bdbdbd",
                        },
                      }}
                      onClick={() => handleTakeOrder(order.id)}
                    >
                      Take Order
                    </Button>
                  )}

                  {/* Show Completed button if the status is Picked for Delivery */}
                  {order.status === "Picked for Delivery" && (
                    <Button
                      sx={{
                        backgroundColor: "#3f51b5",
                        color: "white",
                      }}
                      onClick={() => handleCompletedOrder(order.id)}
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
