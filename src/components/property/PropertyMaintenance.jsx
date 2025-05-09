import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const PropertyMaintenance = ({ maintenanceRequests, propertyId }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  if (!maintenanceRequests || maintenanceRequests.length === 0) {
    return (
      <Card title="Maintenance History" className="bg-white">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
          <p className="mt-1 text-sm text-gray-500">There are no maintenance requests for this property.</p>
        </div>
      </Card>
    );
  }

  // Filter maintenance requests
  const filteredRequests = maintenanceRequests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) {
      return false;
    }
    
    if (filterPriority !== 'all' && request.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });

  // Count requests by status
  const statusCounts = maintenanceRequests.reduce((counts, request) => {
    counts[request.status] = (counts[request.status] || 0) + 1;
    return counts;
  }, {});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card title="Maintenance History" className="bg-white">
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-yellow-50 p-3 text-center">
          <p className="text-sm font-medium text-yellow-800">Pending</p>
          <p className="text-2xl font-semibold text-yellow-900">{statusCounts.pending || 0}</p>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-sm font-medium text-blue-800">In Progress</p>
          <p className="text-2xl font-semibold text-blue-900">{statusCounts.in_progress || 0}</p>
        </div>
        
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-sm font-medium text-green-800">Completed</p>
          <p className="text-2xl font-semibold text-green-900">{statusCounts.completed || 0}</p>
        </div>
        
        <div className="rounded-lg bg-red-50 p-3 text-center">
          <p className="text-sm font-medium text-red-800">Cancelled</p>
          <p className="text-2xl font-semibold text-red-900">{statusCounts.cancelled || 0}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        
        <Link to="/landlord/maintenance">
          <Button variant="outline" size="sm">
            View All Maintenance
          </Button>
        </Link>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-start sm:space-y-0">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                    <Badge variant={getPriorityBadgeVariant(request.priority)}>
                      {request.priority?.charAt(0).toUpperCase() + request.priority?.slice(1)}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {getStatusLabel(request.status)}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Unit: <span className="font-medium text-gray-700">{request.unitNumber}</span></p>
                    <p>Reported by: <span className="font-medium text-gray-700">{request.tenantName}</span></p>
                    <p>Date: <span className="font-medium text-gray-700">{formatDate(request.createdAt)}</span></p>
                    {request.completedAt && (
                      <p>Completed: <span className="font-medium text-gray-700">{formatDate(request.completedAt)}</span></p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">{request.description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/landlord/maintenance/${request.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <h3 className="text-sm font-medium text-gray-900">No maintenance requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No maintenance requests match your filter criteria.
          </p>
        </div>
      )}
    </Card>
  );
};

export default PropertyMaintenance;
