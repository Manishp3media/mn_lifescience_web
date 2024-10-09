import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./adminPages/AdminLogin";
import ProtectedRoute from "./adminComponents/ProtectedRoute";
import Sidebar from "./adminComponents/Sidebar";
import Products from "./adminPages/Products";
import Enquiries from "./adminPages/Enquries";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1  ml-64">
        <Routes>
          <Route path="products" element={<Products />} />
          <Route path="enquiries" element={<Enquiries />} />
          {/* Add more routes for other dashboard pages here */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;