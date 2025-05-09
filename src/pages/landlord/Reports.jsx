import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getFinancialSummary, 
  getOccupancyRates, 
  getMaintenanceCosts,
  getRentCollection
} from '../../services/mock/landlordService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('month'); // month, quarter, year
  const [financialSummary, setFinancialSummary] = useState(null);
  const [occupancyRates, setOccupancyRates] = useState(null);
  const [maintenanceCosts, setMaintenanceCosts] = useState(null);
  const [rentCollection, setRentCollection] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Using landlord ID 1 for mock data
        const financialData = await getFinancialSummary(1, dateRange);
        const occupancyData = await getOccupancyRates(1, dateRange);
        const maintenanceData = await getMaintenanceCosts(1, dateRange);
        const rentData = await getRentCollection(1, dateRange);
        
        setFinancialSummary(financialData);
        setOccupancyRates(occupancyData);
        setMaintenanceCosts(maintenanceData);
        setRentCollection(rentData);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getDateRangeLabel = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    
    if (dateRange === 'month') {
      return formatter.format(now);
    } else if (dateRange === 'quarter') {
      const quarter = Math.floor(now.getMonth() / 3) + 1;
      return `Q${quarter} ${now.getFullYear()}`;
    } else if (dateRange === 'year') {
      return now.getFullYear().toString();
    }
    return '';
  };

  const handleExportReport = async () => {
    setExportLoading(true);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download a PDF or CSV
      alert('Report exported successfully! In a real app, this would download a PDF or CSV file.');
    } catch (error) {
      console.error('Error exporting report:', error);
      setError('Failed to export report. Please try again later.');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[rgb(var(--color-primary))]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
              Time Period:
            </label>
            <select
              id="dateRange"
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <Button
            variant="outline"
            onClick={handleExportReport}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </span>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
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
      )}

      {/* Financial Summary */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Financial Summary - {getDateRangeLabel()}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialSummary?.totalRevenue || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100 text-red-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialSummary?.totalExpenses || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Income</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialSummary?.netIncome || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-100 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profit Margin</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPercentage(financialSummary?.profitMargin || 0)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Rent Collection */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Rent Collection</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Collected Rent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(rentCollection?.collectedAmount || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100 text-red-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Outstanding Rent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(rentCollection?.outstandingAmount || 0)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Collection Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPercentage(rentCollection?.collectionRate || 0)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Occupancy Rates */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Occupancy</h2>
          <Card className="bg-white">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Overall Occupancy Rate</p>
                  <p className="text-3xl font-semibold text-gray-900">{formatPercentage(occupancyRates?.overallRate || 0)}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">Occupied Units</p>
                    <p className="text-sm font-medium text-gray-900">{occupancyRates?.occupiedUnits || 0} of {occupancyRates?.totalUnits || 0}</p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-[rgb(var(--color-primary))]" 
                      style={{ width: `${((occupancyRates?.occupiedUnits || 0) / (occupancyRates?.totalUnits || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">Vacant Units</p>
                    <p className="text-sm font-medium text-gray-900">{(occupancyRates?.totalUnits || 0) - (occupancyRates?.occupiedUnits || 0)} of {occupancyRates?.totalUnits || 0}</p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-red-500" 
                      style={{ width: `${(((occupancyRates?.totalUnits || 0) - (occupancyRates?.occupiedUnits || 0)) / (occupancyRates?.totalUnits || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-500">Occupancy by Property</p>
                  <div className="mt-2 space-y-2">
                    {occupancyRates?.byProperty?.map((property, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">{property.name}</p>
                          <p className="text-sm font-medium text-gray-900">{formatPercentage(property.rate)}</p>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div 
                            className="h-full rounded-full bg-[rgb(var(--color-primary))]" 
                            style={{ width: `${property.rate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Maintenance Costs */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Maintenance Costs</h2>
          <Card className="bg-white">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Maintenance Costs</p>
                  <p className="text-3xl font-semibold text-gray-900">{formatCurrency(maintenanceCosts?.totalCost || 0)}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Requests</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Count</p>
                    <p className="text-sm font-medium text-gray-900">{maintenanceCosts?.completedCount || 0}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Average Cost</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(maintenanceCosts?.averageCost || 0)}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-500">Cost by Category</p>
                  <div className="mt-2 space-y-2">
                    {maintenanceCosts?.byCategory?.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">{category.name}</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</p>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div 
                            className="h-full rounded-full bg-[rgb(var(--color-primary))]" 
                            style={{ width: `${(category.amount / (maintenanceCosts?.totalCost || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-500">Pending Maintenance</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Count</p>
                    <p className="text-sm font-medium text-gray-900">{maintenanceCosts?.pendingCount || 0}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Estimated Cost</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(maintenanceCosts?.estimatedPendingCost || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
