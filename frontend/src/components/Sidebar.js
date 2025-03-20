import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

const Sidebar = () => {
  return (
    <div style={{ width: 250, height: '100vh', backgroundColor: '#333', color: '#fff' }}>
      <List>
        <ListItem>
          <ListItemText primary="Delivery Person Dashboard" />
        </ListItem>
        <Divider />
        <ListItem button>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <ListItemText primary="Home" />
          </Link>
        </ListItem>
        <ListItem button>
          <Link to="/users" style={{ color: 'inherit', textDecoration: 'none' }}>
            <ListItemText primary="Users" />
          </Link>
        </ListItem>
        <ListItem button>
          <Link to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>
            <ListItemText primary="Settings" />
          </Link>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
