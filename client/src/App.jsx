import { Navigate, Route, Routes } from "react-router-dom"
import About from "./pages/About"
import Home from "./pages/Home"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import Parts from "./pages/Parts"
import ServiceBookingPage from "./pages/ServiceBookingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import AdminRedirect from "./pages/AdminRedirect"
import KhaltiReturn from "./pages/KhaltiReturn"
import LegalPage from "./pages/LegalPage"
import ProtectedRoute from "./component/auth/ProtectedRoute"
import AdminRoute from "./component/auth/AdminRoute"


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/services" element={<Services />}/>
        <Route path="/service-booking" element={<ServiceBookingPage />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/parts" element={<Parts />}/>
        <Route path="/privacy" element={<LegalPage type="privacy" />}/>
        <Route path="/terms" element={<LegalPage type="terms" />}/>
        <Route path="/payment/khalti-return" element={<KhaltiReturn />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/admin" element={<AdminRedirect />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
