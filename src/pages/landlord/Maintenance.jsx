import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMaintenanceRequests, updateMaintenanceStatus } from '../../services/mock/landlordService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Maintenance = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using landlord ID 1 for mock data
        const requestsData = await getMaintenanceRequests(1);
        setMaintenanceRequests(requestsData);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        setError('Failed to load maintenance requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStatusChange = async (requestId, newStatus) => {
    setStatusUpdating(requestId);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = await updateMaintenanceStatus(requestId, newStatus);
      if (success) {
        setMaintenanceRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { ...request, status: newStatus, updatedAt: new Date().toISOString() } 
              : request
          )
        );
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again later.');
    } finally {
      setStatusUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'low':
        return 'default';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      case 'emergency':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Filter and sort maintenance requests
  const filteredAndSortedRequests = maintenanceRequests
    .filter(request => {
      // Search filter
      const matchesSearch = 
        searchQuery === '' || 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      
      // Priority filter
      const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'priority') {
        const priorityOrder = { emergency: 3, high: 2, medium: 1, low: 0 };
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'status') {
        const statusOrder = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 };
        return sortOrder === 'asc'
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
      return 0;
    });

  // Count requests by status
  const statusCounts = maintenanceRequests.reduce((counts, request) => {
    counts[request.status] = (counts[request.status] || 0) + 1;
    return counts;
  }, {});

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[rgb(var(--color-primary))]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
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

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-100 text-yellow-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.pending || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.in_progress || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.completed || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.cancelled || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search requests..."
            className="input pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="filterStatus" className="text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="filterStatus"
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="filterPriority" className="text-sm font-medium text-gray-700">
              Priority:
            </label>
            <select
              id="filterPriority"
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sortBy"
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Maintenance Requests List */}
      {filteredAndSortedRequests.length > 0 ? (
        <div className="space-y-6">
          {filteredAndSortedRequests.map((request) => (
            <Card key={request.id} className="bg-white">
              <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                    <Badge variant={getPriorityBadgeVariant(request.priority)}>
                      {request.priority?.charAt(0).toUpperCase() + request.priority?.slice(1)} Priority
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status === 'in_progress' ? 'In Progress' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Unit: <span className="font-medium text-gray-700">{request.unitNumber}</span></p>
                    <p>Tenant: <span className="font-medium text-gray-700">{request.tenantName}</span></p>
                    <p>Submitted: <span className="font-medium text-gray-700">{formatDateTime(request.createdAt)}</span></p>
                    {request.status !== 'pending' && (
                      <p>Last Updated: <span className="font-medium text-gray-700">{formatDateTime(request.updatedAt)}</span></p>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">{request.description}</p>
                  </div>
                  
                  {request.images && request.images.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {request.images.map((image, index) => (
                        <div key={index} className="h-16 w-16 overflow-hidden rounded-md">
                          <img src={image} alt={`Maintenance request ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Link to={`/landlord/maintenance/${request.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  
                  {request.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={statusUpdating === request.id}
                      onClick={() => handleStatusChange(request.id, 'in_progress')}
                    >
                      {statusUpdating === request.id ? 'Updating...' : 'Start Work'}
                    </Button>
                  )}
                  
                  {request.status === 'in_progress' && (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full"
                      disabled={statusUpdating === request.id}
                      onClick={() => handleStatusChange(request.id, 'completed')}
                    >
                      {statusUpdating === request.id ? 'Updating...' : 'Mark Complete'}
                    </Button>
                  )}
                  
                  {(request.status === 'pending' || request.status === 'in_progress') && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      disabled={statusUpdating === request.id}
                      onClick={() => handleStatusChange(request.id, 'cancelled')}
                    >
                      {statusUpdating === request.id ? 'Updating...' : 'Cancel Request'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' 
              ? 'No maintenance requests match your search criteria.' 
              : 'There are no maintenance requests in the system yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
