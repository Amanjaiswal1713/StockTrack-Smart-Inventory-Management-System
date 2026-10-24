import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Features from "../pages/Features/Features";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Suppliers from "../pages/Suppliers/Suppliers";
import SupplierDetails from "../pages/SupplierDetails/SupplierDetails";
import Inventory from "../pages/Inventory/Inventory";
import InventoryLogs from "../pages/InventoryLogs/InventoryLogs";
import Sales from "../pages/Sales/Sales";
import Analytics from "../pages/Analytics/Analytics";
import LowStock from "../pages/LowStock/LowStock";
import DeadStock from "../pages/DeadStock/DeadStock";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import ReorderList from "../pages/ReorderList/ReorderList";
import Profile from "../pages/Profile/Profile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route
              path="/suppliers/:supplierId"
              element={<SupplierDetails />}
            />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/logs" element={<InventoryLogs />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/low-stock" element={<LowStock />} />
            <Route path="/dead-stock" element={<DeadStock />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reorders" element={<ReorderList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
