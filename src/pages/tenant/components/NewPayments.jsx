import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getTenantPayments, getTenantUnit } from '../../../services/mock/tenantService';
import Badge from '../../../components/common/Badge';
import { TbCash, TbCalendarDollar, TbLoader2, TbPlus, TbX, TbDownload, TbCreditCard, TbHome, TbChevronRight, TbCalendar, TbRefresh, TbArrowDown, TbArrowUp, TbFilter } from 'react-icons/tb';
import { Footer } from './Footer';
import PaymentModal from './PaymentModal';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');
  const [stats, setStats] = useState({
    totalPaid: 0,
    lastPayment: null,
    nextDueDate: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using tenant ID 1 for mock data
        const paymentsData = await getTenantPayments(1);
        const unitData = await getTenantUnit(1);
        
        setPayments(paymentsData);
        setUnit(unitData);
        
        // Calculate stats
        const totalPaid = paymentsData
          .filter(p => p.status === 'paid')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        const lastPayment = paymentsData.length > 0 ? 
          paymentsData.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0] : null;
        
        // Mock next due date (5th of next month)
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        nextDueDate.setDate(5);
        
        setStats({
          totalPaid,
          lastPayment,
          nextDueDate
        });
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setError('Failed to load payment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentSuccess = (newPayment) => {
    // Update the payments list with the new payment
    setPayments([newPayment, ...payments]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalPaid: prev.totalPaid + newPayment.amount,
      lastPayment: newPayment
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFilteredPayments = () => {
    let filtered = [...payments];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate);
      const dateB = new Date(b.paymentDate);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <TbLoader2 className="mx-auto h-10 w-10 text-primary-plot animate-spin" />
          <p className="mt-4 text-base text-secondary-plot">
            Loading payment data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-10 mx-auto max-w-screen-2xl px-2 md:px-4">
      {/* Welcome & Header Section */}
      <div className="mb-6">
        <div className="px-4 flex items-baseline justify-between mb-2">
          <div>
            <div className="flex items-center mb-1">
              <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                <TbCalendarDollar className="h-4 w-4 mr-1.5 text-primary-plot" />
                <span>Payments & Billing</span>
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
              Payment Management
            </h1>
          </div>
          
          <button
            onClick={() => setShowPaymentModal(true)}
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
            <span className="flex items-center">
              <TbPlus className="mr-2 h-5 w-5" />
              Make Payment
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-4 shadow-sm mb-6">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-red-50 blur-xl"></div>
          <div className="relative z-10 flex items-start">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <TbX className="h-4 w-4 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button 
                onClick={() => setError('')}
                className="mt-1 text-xs font-medium text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Unit Info Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-secondary-plot/5 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-plot/10">
              <TbHome className="h-6 w-6 text-secondary-plot" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Unit Details</h3>
            <p className="text-sm text-gray-500 mb-4">Your current residence</p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Unit Number</span>
                <span className="text-sm font-medium text-gray-900">{unit?.unitNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Floor</span>
                <span className="text-sm font-medium text-gray-900">{unit?.floor || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Monthly Rent</span>
                <span className="text-sm font-medium text-gray-900">{unit ? formatCurrency(unit.rentAmount) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Payment Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary-plot/5 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-plot/10">
              <TbCalendar className="h-6 w-6 text-primary-plot" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Next Payment</h3>
            <p className="text-sm text-gray-500 mb-4">Due date information</p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Due Date</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(stats.nextDueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount Due</span>
                <span className="text-sm font-medium text-gray-900">{unit ? formatCurrency(unit.rentAmount) : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Stats Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-green-50 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <TbCash className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Payment Stats</h3>
            <p className="text-sm text-gray-500 mb-4">Your payment history</p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Paid (YTD)</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Payment</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.lastPayment ? formatDate(stats.lastPayment.paymentDate) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">M-Pesa</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-plot to-primary-plot p-6 shadow-md">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
          
          <div className="relative z-10">
            <h3 className="mb-1 text-lg font-semibold text-white">Quick Actions</h3>
            <p className="text-sm text-white/80 mb-6">Manage your payments</p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 text-white hover:bg-white/20 transition-colors"
              >
                <span className="flex items-center">
                  <TbCreditCard className="mr-2 h-5 w-5" />
                  Make Payment
                </span>
                <TbChevronRight className="h-5 w-5" />
              </button>
              
              <button className="w-full flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 text-white hover:bg-white/20 transition-colors">
                <span className="flex items-center">
                  <TbDownload className="mr-2 h-5 w-5" />
                  Download Receipt
                </span>
                <TbChevronRight className="h-5 w-5" />
              </button>
              
              <button className="w-full flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 text-white hover:bg-white/20 transition-colors">
                <span className="flex items-center">
                  <TbRefresh className="mr-2 h-5 w-5" />
                  Refresh Data
                </span>
                <TbChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 mb-8">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-secondary-plot">Payment History</h2>
          
          <div className="flex space-x-2">
            {/* Filter dropdown */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 focus:border-primary-plot focus:outline-none focus:ring-1 focus:ring-primary-plot"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <TbFilter className="h-4 w-4" />
              </div>
            </div>
            
            {/* Sort button */}
            <button
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {sortDirection === 'desc' ? (
                <>
                  <TbArrowDown className="mr-1 h-4 w-4" />
                  Newest
                </>
              ) : (
                <>
                  <TbArrowUp className="mr-1 h-4 w-4" />
                  Oldest
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredPayments().length > 0 ? (
                getFilteredPayments().map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatDate(payment.paymentDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{payment.transactionReference}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.status === 'paid' && (
                        <button 
                          className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          <TbDownload className="mr-1 h-4 w-4" />
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{getFilteredPayments().length}</span> payments
          </div>
          
          <div className="flex space-x-2">
            <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        unit={unit}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <Footer />
    </div>
  );
};

export default Payments;
