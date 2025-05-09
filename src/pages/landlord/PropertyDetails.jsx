import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  getProperty, 
  getUnits, 
  getMaintenanceRequestsByProperty,
  getTenants
} from '../../services/mock/landlordService';

// Property detail components
import PropertyInfo from '../../components/property/PropertyInfo';
import PropertyFinancials from '../../components/property/PropertyFinancials';
import PropertyOccupancy from '../../components/property/PropertyOccupancy';
import PropertyUnits from '../../components/property/PropertyUnits';
import PropertyMaintenance from '../../components/property/PropertyMaintenance';
import PropertyTenants from '../../components/property/PropertyTenants';

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotification();
  
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [financials, setFinancials] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        
        // Fetch property details
        const propertyData = await getProperty(parseInt(propertyId, 10));
        if (!propertyData) {
          showError('Property not found');
          navigate('/landlord/properties');
          return;
        }
        setProperty(propertyData);
        
        // Fetch units for this property
        const unitsData = await getUnits(parseInt(propertyId, 10));
        setUnits(unitsData);
        
        // Fetch maintenance requests for this property
        const maintenanceData = await getMaintenanceRequestsByProperty(parseInt(propertyId, 10));
        setMaintenanceRequests(maintenanceData);
        
        // Fetch tenants for this property
        // In a real app, we would have a dedicated API endpoint for this
        // For now, we'll filter tenants based on the units in this property
        const unitIds = unitsData.map(unit => unit.id);
        const tenantsData = await getTenants(propertyData.landlordId);
        const propertyTenants = tenantsData.filter(tenant => unitIds.includes(tenant.unitId));
        
        // Add unitNumber to each tenant for easier display
        const tenantsWithUnitInfo = propertyTenants.map(tenant => {
          const unit = unitsData.find(u => u.id === tenant.unitId);
          return {
            ...tenant,
            unitNumber: unit ? unit.unitNumber : 'Unknown'
          };
        });
        
        setTenants(tenantsWithUnitInfo);
        
        // Calculate financial data
        const totalMonthlyRent = unitsData.reduce((sum, unit) => sum + unit.rentAmount, 0);
        const collectedRent = totalMonthlyRent * 0.85; // Mock data - 85% collection rate
        const outstandingRent = totalMonthlyRent - collectedRent;
        
        // Mock expenses data
        const expenses = [
          { category: 'Maintenance', amount: totalMonthlyRent * 0.15 },
          { category: 'Utilities', amount: totalMonthlyRent * 0.08 },
          { category: 'Property Management', amount: totalMonthlyRent * 0.1 },
          { category: 'Insurance', amount: totalMonthlyRent * 0.05 },
          { category: 'Taxes', amount: totalMonthlyRent * 0.12 }
        ];
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        setFinancials({
          totalMonthlyRent,
          collectedRent,
          outstandingRent,
          collectionRate: collectedRent / totalMonthlyRent,
          expenses,
          totalExpenses,
          netIncome: collectedRent - totalExpenses
        });
        
        // Calculate occupancy data
        const occupiedUnits = unitsData.filter(unit => unit.status === 'occupied').length;
        const underMaintenanceUnits = unitsData.filter(unit => unit.status === 'maintenance').length;
        
        // Mock occupancy history data
        const occupancyHistory = [
          { month: 'Jan', rate: 0.75 },
          { month: 'Feb', rate: 0.79 },
          { month: 'Mar', rate: 0.82 },
          { month: 'Apr', rate: 0.85 },
          { month: 'May', rate: 0.88 },
          { month: 'Jun', rate: occupiedUnits / unitsData.length }
        ];
        
        setOccupancyData({
          totalUnits: unitsData.length,
          occupiedUnits,
          underMaintenanceUnits,
          occupancyRate: occupiedUnits / unitsData.length,
          occupancyHistory,
          tenantTurnover: {
            annualRate: 0.25, // Mock data
            averageTenancy: 18, // Mock data - 18 months
            newTenantsYTD: 3 // Mock data
          }
        });
      } catch (error) {
        console.error('Error fetching property data:', error);
        showError('Failed to load property data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId, navigate, showError, user]);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'units', label: 'Units' },
    { id: 'tenants', label: 'Tenants' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'financials', label: 'Financials' }
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[rgb(var(--color-primary))]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Property not found</h2>
        <p className="mt-2 text-gray-600">The property you're looking for doesn't exist or you don't have access to it.</p>
        <button 
          onClick={() => navigate('/landlord/properties')}
          className="mt-4 rounded-md bg-[rgb(var(--color-primary))] px-4 py-2 text-white hover:bg-[rgb(var(--color-primary))/0.9]"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Property Details</h1>
        <button 
          onClick={() => navigate('/landlord/properties')}
          className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Properties
        </button>
      </div>

      {/* Property Info Card */}
      <PropertyInfo property={property} />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PropertyFinancials financials={financials} />
              <PropertyOccupancy occupancyData={occupancyData} />
            </div>
            <PropertyUnits units={units} propertyId={parseInt(propertyId, 10)} />
            <PropertyMaintenance maintenanceRequests={maintenanceRequests} propertyId={parseInt(propertyId, 10)} />
          </div>
        )}

        {activeTab === 'units' && (
          <PropertyUnits units={units} propertyId={parseInt(propertyId, 10)} />
        )}

        {activeTab === 'tenants' && (
          <PropertyTenants tenants={tenants} propertyId={parseInt(propertyId, 10)} />
        )}

        {activeTab === 'maintenance' && (
          <PropertyMaintenance maintenanceRequests={maintenanceRequests} propertyId={parseInt(propertyId, 10)} />
        )}

        {activeTab === 'financials' && (
          <div className="space-y-6">
            <PropertyFinancials financials={financials} />
            <PropertyOccupancy occupancyData={occupancyData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
