import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const AppLayout = ({ children }) => (
  <div>
    <Navbar />
    {children}
    <Footer />
  </div>
);

export default AppLayout;
