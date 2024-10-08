import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./adminPages/AdminLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./adminComponents/ProtectedRoute";
import Sidebar from "./adminComponents/Sidebar";
import Products from "./adminPages/Products";
import Enquries from "./adminPages/Enquries";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Dashboard*/}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
            <Route path="products" element={<Products />} />
            <Route path="enquiries" element={<Enquries />} />
          </Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
