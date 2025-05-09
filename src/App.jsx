
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';

// Tenant Pages
import TenantLayout from './layouts/TenantLayout';
import TenantDashboard from './pages/tenant/Dashboard';
import TenantPayments from './pages/tenant/Payments';
import TenantMaintenance from './pages/tenant/Maintenance';
import TenantProfile from './pages/tenant/Profile';

// Landlord Pages
import LandlordLayout from './layouts/LandlordLayout';
import LandlordDashboard from './pages/landlord/Dashboard';
import Properties from './pages/landlord/Properties';
import PropertyForm from './pages/landlord/PropertyForm';
import PropertyDetails from './pages/landlord/PropertyDetails';
import UnitForm from './pages/landlord/UnitForm';
import Tenants from './pages/landlord/Tenants';
import TenantForm from './pages/landlord/TenantForm';
import Maintenance from './pages/landlord/Maintenance';
import Reports from './pages/landlord/Reports';
import Units from './pages/landlord/Units';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Tenant Routes */}
          <Route 
            path="/tenant" 
            element={
              <ProtectedRoute allowedRoles={['tenant']}>
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TenantDashboard />} />
            <Route path="payments" element={<TenantPayments />} />
            <Route path="maintenance" element={<TenantMaintenance />} />
            <Route path="profile" element={<TenantProfile />} />
          </Route>
          
          {/* Landlord Routes */}
          <Route 
            path="/landlord" 
            element={
              <ProtectedRoute allowedRoles={['landlord']}>
                <LandlordLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LandlordDashboard />} />
            
            {/* Properties and Units */}
            <Route path="properties" element={<Properties />} />
            <Route path="properties/new" element={<PropertyForm />} />
            <Route path="properties/:propertyId" element={<PropertyDetails />} />
            <Route path="properties/:propertyId/edit" element={<PropertyForm />} />
            <Route path="properties/:propertyId/units/new" element={<UnitForm />} />
            <Route path="properties/:propertyId/units/:unitId/edit" element={<UnitForm />} />
            <Route path="units" element={<Units />} />
            <Route path="units/new" element={<UnitForm />} />
            <Route path="units/:unitId/edit" element={<UnitForm />} />
            
            {/* Tenants */}
            <Route path="tenants" element={<Tenants />} />
            <Route path="tenants/new" element={<TenantForm />} />
            <Route path="tenants/:tenantId/edit" element={<TenantForm />} />
            
            {/* Maintenance */}
            <Route path="maintenance" element={<Maintenance />} />
            
            {/* Reports */}
            <Route path="reports" element={<Reports />} />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
              <h1 className="text-4xl font-bold text-gray-800">404</h1>
              <p className="mt-2 text-lg text-gray-600">Page not found</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-4 rounded-md bg-[rgb(var(--color-primary))] px-4 py-2 text-white hover:bg-[rgb(var(--color-primary)/0.9)]"
              >
                Go Back
              </button>
            </div>
          } />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
