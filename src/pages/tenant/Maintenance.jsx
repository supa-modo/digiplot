import { useState, useEffect } from 'react';

import { getTenantMaintenanceRequests } from '../../services/mock/tenantService';
import Badge from '../../components/common/Badge';
import { TbTools, TbPlus, TbLoader2, TbX, TbChevronRight, TbFilter, TbArrowUp, TbArrowDown, TbSearch, TbEye, TbMessage, TbCalendarTime } from 'react-icons/tb';
import { Footer } from './components/Footer';
import MaintenanceRequestModal from './components/MaintenanceRequestModal';
import { useAuth } from '../../contexts/AuthContext';

const Maintenance = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Using tenant ID 1 for mock data
        const requests = await getTenantMaintenanceRequests(1);
        setMaintenanceRequests(requests);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        setError('Failed to load maintenance requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Low</span>;
      case 'medium':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Medium</span>;
      case 'high':
        return <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">High</span>;
      case 'emergency':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Emergency</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{priority}</span>;
    }
  };

  const handleRequestSuccess = (newRequest) => {
    // Add the new request to the list
    setMaintenanceRequests([newRequest, ...maintenanceRequests]);
  };

  const getFilteredRequests = () => {
    let filtered = [...maintenanceRequests];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(query) || 
        request.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getRequestStats = () => {
    const total = maintenanceRequests.length;
    const pending = maintenanceRequests.filter(r => r.status === 'pending').length;
    const inProgress = maintenanceRequests.filter(r => r.status === 'in_progress').length;
    const completed = maintenanceRequests.filter(r => r.status === 'completed').length;
    
    return { total, pending, inProgress, completed };
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <TbLoader2 className="mx-auto h-10 w-10 text-primary-plot animate-spin" />
          <p className="mt-4 text-base text-secondary-plot">
            Loading maintenance requests...
          </p>
        </div>
      </div>
    );
  }

  const stats = getRequestStats();

  return (
    <div className="pt-6 pb-10 mx-auto max-w-screen-2xl px-2 md:px-4">
      {/* Welcome & Header Section */}
      <div className="mb-6">
        <div className="px-4 flex items-baseline justify-between mb-2">
          <div>
            <div className="flex items-center mb-1">
              <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                <TbTools className="h-4 w-4 mr-1.5 text-primary-plot" />
                <span>Maintenance & Repairs</span>
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
              Maintenance Requests
            </h1>
          </div>
          
          <button
            onClick={() => setShowRequestModal(true)}
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
            <span className="flex items-center">
              <TbPlus className="mr-2 h-5 w-5" />
              New Request
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Requests Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-secondary-plot/5 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-plot/10">
              <TbTools className="h-6 w-6 text-secondary-plot" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Total Requests</h3>
            <p className="text-sm text-gray-500 mb-1">All maintenance requests</p>
            <p className="text-3xl font-bold text-secondary-plot">{stats.total}</p>
          </div>
        </div>
        
        {/* Pending Requests Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-yellow-50 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <TbLoader2 className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Pending</h3>
            <p className="text-sm text-gray-500 mb-1">Awaiting response</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>
        
        {/* In Progress Requests Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-50 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <TbMessage className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">In Progress</h3>
            <p className="text-sm text-gray-500 mb-1">Being worked on</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
        </div>
        
        {/* Completed Requests Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-gray-100">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-green-50 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <TbCalendarTime className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Completed</h3>
            <p className="text-sm text-gray-500 mb-1">Resolved issues</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <TbSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-plot focus:border-primary-plot block w-full pl-10 p-2.5"
              placeholder="Search requests..."
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-8 py-2.5 text-sm font-medium text-gray-700 focus:border-primary-plot focus:outline-none focus:ring-1 focus:ring-primary-plot"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <TbFilter className="h-4 w-4" />
              </div>
            </div>
            
            <button
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
      </div>

      {/* Maintenance Requests List */}
      <div className="space-y-4 mb-8">
        {getFilteredRequests().length > 0 ? (
          getFilteredRequests().map((request) => (
            <div 
              key={request.id}
              className="relative overflow-hidden rounded-xl bg-white p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 h-full w-1.5" style={{ backgroundColor: getStatusColor(request.status).split(' ')[1].replace('bg-', 'var(--') + ')' }}></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-start">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getStatusColor(request.status)}`}>
                      <TbTools className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{request.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getStatusBadge(request.status)}
                        {request.priority && getPriorityBadge(request.priority)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:text-center">
                  <p className="text-sm font-medium text-gray-500">Submitted On</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(request.createdAt)}</p>
                  
                  {request.assignedTo && (
                    <>
                      <p className="mt-2 text-sm font-medium text-gray-500">Assigned To</p>
                      <p className="text-sm font-semibold text-gray-900">{request.assignedTo}</p>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col md:items-end justify-center">
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-plot/10 px-4 py-2 text-sm font-medium text-primary-plot hover:bg-primary-plot/20 transition-colors"
                  >
                    <TbEye className="mr-1.5 h-5 w-5" />
                    View Details
                  </button>
                  
                  {request.status === 'in_progress' && (
                    <button className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                      <TbMessage className="mr-1.5 h-5 w-5" />
                      Send Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-md border border-gray-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <TbTools className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No maintenance requests found</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery ? 'No results match your search criteria.' : 'You have not submitted any maintenance requests yet.'}
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="mt-4 inline-flex items-center rounded-lg bg-primary-plot px-4 py-2 text-white hover:bg-primary-plot/90 transition-colors"
            >
              <TbPlus className="mr-1.5 h-5 w-5" />
              Submit New Request
            </button>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl opacity-70"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-plot/10 blur-xl opacity-70"></div>
            
            <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-secondary-plot to-primary-plot p-5 text-white">
              <h3 className="text-xl font-bold">Request Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="rounded-full bg-white/20 p-1.5 text-white transition-all hover:bg-white/30"
              >
                <TbX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative z-10 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    <TbTools className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedRequest.title}</h2>
                    <div className="mt-1 flex items-center space-x-2">
                      {getStatusBadge(selectedRequest.status)}
                      {selectedRequest.priority && getPriorityBadge(selectedRequest.priority)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Request ID</p>
                  <p className="text-sm font-semibold text-gray-900">#{selectedRequest.id}</p>
                </div>
              </div>
              
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted On</p>
                  <p className="text-base font-semibold text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                </div>
                
                {selectedRequest.assignedTo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRequest.assignedTo}</p>
                  </div>
                )}
                
                {selectedRequest.completedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed On</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(selectedRequest.completedAt)}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-gray-500">Description</p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-gray-900">{selectedRequest.description}</p>
                </div>
              </div>
              
              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-gray-500">Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRequest.images.map((image, index) => (
                      <div key={index} className="relative h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        <p className="text-sm text-gray-500">{image}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRequest.comments && selectedRequest.comments.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-gray-500">Comments</p>
                  <div className="space-y-4">
                    {selectedRequest.comments.map((comment, index) => (
                      <div key={index} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-900">{comment.author}</p>
                          <p className="text-sm text-gray-500">{formatDate(comment.date)}</p>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedRequest.status !== 'completed' && selectedRequest.status !== 'cancelled' && (
                  <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
                    <TbMessage className="mr-1.5 -mt-0.5 inline-block h-4 w-4" />
                    Add Comment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onRequestSuccess={handleRequestSuccess}
      />
      
      <Footer />
    </div>
  );
};

export default Maintenance;
