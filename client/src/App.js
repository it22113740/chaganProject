import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart"; // Import Cart page
import OrderPage from "./pages/OrderPage";
//import Home from './pages/Home'; // Import Home page

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} />         Home page route */}
        <Route path="/cart" element={<Cart />} /> {/* Cart page route */}
        <Route path="/order" element={<OrderPage />} /> {/* Cart page route */}

      </Routes>
    </Router>
  );
};

export default App;
