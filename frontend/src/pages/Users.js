import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button, Card, CardContent } from '@mui/material';

const Users = () => {
  const [deliveryPerson, setDeliveryPerson] = useState(null);

  // Fetch delivery person details from the local JSON file
  useEffect(() => {
    const fetchDeliveryPerson = async () => {
      try {
        const response = await fetch('/deliveryPerson.json'); // Fetch delivery person data from the JSON file
        const data = await response.json();
        setDeliveryPerson(data); // Set the delivery person data to the state
      } catch (error) {
        console.error('Error fetching delivery person data:', error);
      }
    };

    fetchDeliveryPerson();
  }, []);

  if (!deliveryPerson) {
    return <div>Loading delivery person profile...</div>;
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f6f8' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Delivery Person Profile
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Profile Picture and Basic Info */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <img
              src={deliveryPerson.profilePicture}
              alt="Profile"
              style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
            />
            <Typography variant="h6">{deliveryPerson.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {deliveryPerson.status}
            </Typography>
          </Paper>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} sm={7}>
          <Card elevation={3} style={{ padding: '20px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body1"><strong>Email:</strong> {deliveryPerson.email}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {deliveryPerson.phone}</Typography>
              
              <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                Vehicle Information
              </Typography>
              <Typography variant="body1"><strong>Vehicle Type:</strong> {deliveryPerson.vehicle}</Typography>
              <Typography variant="body1"><strong>Vehicle Number:</strong> {deliveryPerson.vehicleNumber}</Typography>

              <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                About
              </Typography>
              <Typography variant="body2">{deliveryPerson.bio}</Typography>

              {/* Action Button */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={deliveryPerson.status === 'Picked for Delivery'}
                >
                  {deliveryPerson.status === 'Picked for Delivery' ? 'Order Picked' : 'Take Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Users;
