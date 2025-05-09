import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardSummary } from '../../services/mock/landlordService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockTenants, mockUnits } from '../../services/mock/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Using landlord ID 1 for mock data
        const data = await getDashboardSummary(1);
        setSummary(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[rgb(var(--color-primary))]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">No data available</h2>
        <p className="mt-2 text-gray-600">Unable to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 sm:mt-0">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Properties</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.totalProperties}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Units</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.totalUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rent Collection</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.rentCollectionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card title="Financial Summary" className="bg-white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">Total Monthly Rent</p>
            <p className="mt-2 text-3xl font-bold text-green-900">{formatCurrency(summary.totalMonthlyRent)}</p>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">Collected This Month</p>
            <p className="mt-2 text-3xl font-bold text-blue-900">{formatCurrency(summary.totalCollectedRent)}</p>
          </div>
          
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">Outstanding</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">
              {formatCurrency(summary.totalMonthlyRent - summary.totalCollectedRent)}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Revenue Trend (Last 6 Months)</h3>
          <div className="mt-4 h-64 w-full">
            {/* This would be a chart in a real implementation */}
            <div className="flex h-full items-end space-x-4 rounded-md border border-gray-200 p-4">
              {summary.revenueData.map((data, index) => (
                <div key={index} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div 
                    className="w-full bg-[rgb(var(--color-primary))]" 
                    style={{ 
                      height: `${(data.revenue / Math.max(...summary.revenueData.map(d => d.revenue))) * 100}%`,
                      minHeight: '10%'
                    }}
                  ></div>
                  <div className="mt-2 text-xs font-medium text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Properties */}
        <Card 
          title="Recent Properties" 
          action={
            <Link to="/landlord/properties">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          }
          className="bg-white"
        >
          {summary.recentProperties.length > 0 ? (
            <div className="space-y-4">
              {summary.recentProperties.map((property) => (
                <div key={property.id} className="rounded-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-500">{property.location}</p>
                    </div>
                    <Link to={`/landlord/properties/${property.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No properties found.</p>
          )}
          
          <div className="mt-4 text-center">
            <Link to="/landlord/properties/new">
              <Button variant="primary">Add New Property</Button>
            </Link>
          </div>
        </Card>

        {/* Maintenance Requests */}
        <Card 
          title="Pending Maintenance Requests" 
          action={
            <Link to="/landlord/maintenance">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          }
          className="bg-white"
        >
          {summary.recentMaintenanceRequests.length > 0 ? (
            <div className="space-y-4">
              {summary.recentMaintenanceRequests.map((request) => (
                <div key={request.id} className="rounded-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-500">
                        Unit: {mockUnits.find(unit => unit.id === request.unitId)?.unitNumber || 'Unknown'} | 
                        Submitted: {formatDate(request.submittedAt)}
                      </p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No pending maintenance requests.</p>
          )}
        </Card>
      </div>

      {/* Recent Payments */}
      <Card 
        title="Recent Payments" 
        action={
          <Link to="/landlord/payments">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        }
        className="bg-white"
      >
        {summary.recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {summary.recentPayments.map((payment) => {
                  const tenant = mockTenants.find(t => t.id === payment.tenantId);
                  const unit = mockUnits.find(u => u.id === payment.unitId);
                  
                  return (
                    <tr key={payment.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {tenant?.name || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {unit?.unitNumber || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <Badge 
                          variant={payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent payments found.</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
