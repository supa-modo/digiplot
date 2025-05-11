import React from 'react';
import { 
  TbCalendarTime, TbMessage, TbTools, TbX, TbPhoto, 
  TbUser, TbBuilding, TbHome, TbClock, TbClipboardList,
  TbTag, TbInfoCircle, TbAlertTriangle, TbCheck,
  TbCalendarEvent, TbMapPin, TbCategory, TbId
} from 'react-icons/tb';

const MaintenanceRequestDetails = ({ request, onClose }) => {
  if (!request) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <TbClock className="h-5 w-5" />;
      case 'in_progress':
        return <TbTools className="h-5 w-5" />;
      case 'completed':
        return <TbCheck className="h-5 w-5" />;
      case 'cancelled':
        return <TbX className="h-5 w-5" />;
      default:
        return <TbInfoCircle className="h-5 w-5" />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'emergency':
        return 'Emergency';
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'text-gray-800 bg-gray-100 border-gray-200';
      case 'medium':
        return 'text-blue-800 bg-blue-100 border-blue-200';
      case 'high':
        return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'emergency':
        return 'text-red-800 bg-red-100 border-red-200';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low':
        return <TbInfoCircle className="h-5 w-5" />;
      case 'medium':
        return <TbInfoCircle className="h-5 w-5" />;
      case 'high':
        return <TbAlertTriangle className="h-5 w-5" />;
      case 'emergency':
        return <TbAlertTriangle className="h-5 w-5" />;
      default:
        return <TbInfoCircle className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category) => {
    if (!category) return 'General';
    
    const categories = {
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      appliance: 'Appliance',
      structural: 'Structural',
      hvac: 'HVAC',
      other: 'Other'
    };
    
    return categories[category] || category;
  };

  const getCategoryIcon = (category) => {
    if (!category) return '🔧';
    
    const icons = {
      plumbing: '🚿',
      electrical: '💡',
      appliance: '🔌',
      structural: '🏠',
      hvac: '❄️',
      other: '🔧'
    };
    
    return icons[category] || '🔧';
  };

  return (
    <div className="relative z-10 max-h-[70vh] overflow-y-auto">
      {/* Glass morphism header with status */}
      <div className={`sticky top-0 z-20 p-6 ${getStatusColor(request.status)} bg-opacity-20 backdrop-blur-sm border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusColor(request.status)}`}>
              {getStatusIcon(request.status)}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${getPriorityColor(request.priority)}`}>
                  {getPriorityIcon(request.priority)}
                  <span className="ml-1">{getPriorityLabel(request.priority)} Priority</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <TbCalendarTime className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted On</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <TbCategory className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-sm font-semibold text-gray-900">
                  <span className="mr-2">{getCategoryIcon(request.category)}</span>
                  {getCategoryLabel(request.category)}
                </p>
              </div>
            </div>
          </div>
          
          {request.assignedTo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TbUser className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p className="text-sm font-semibold text-gray-900">{request.assignedTo}</p>
                </div>
              </div>
            </div>
          )}
          
          {request.completedAt && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TbCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed On</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(request.completedAt)}</p>
                </div>
              </div>
            </div>
          )}
          
          {request.id && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <TbId className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Request ID</p>
                  <p className="text-sm font-semibold text-gray-900">#{request.id}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Description Section */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <TbInfoCircle className="h-4 w-4 text-gray-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-800">Description</h4>
          </div>
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>
        </div>
        
        {/* Images Section */}
        {request.images && request.images.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <TbPhoto className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">Attached Images ({request.images.length})</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {request.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                  {/* In a real app, you would use actual image URLs */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TbPhoto className="h-10 w-10 text-gray-400" />
                    <span className="sr-only">Image {index + 1}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    {image}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Updates/Timeline Section */}
        {request.updates && request.updates.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                <TbClipboardList className="h-4 w-4 text-indigo-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">Updates & Timeline</h4>
            </div>
            <div className="relative border-l-2 border-primary-plot/30 pl-6 ml-3 space-y-6 py-2">
              {request.updates.map((update, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.65rem] mt-1.5 h-4 w-4 rounded-full bg-primary-plot"></div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900 flex items-center">
                        <TbUser className="mr-1.5 h-4 w-4 text-gray-500" />
                        {update.author}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <TbCalendarTime className="mr-1.5 h-3 w-3" />
                        {formatDate(update.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{update.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Comments Section (if different from updates) */}
        {request.comments && request.comments.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <TbMessage className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">Comments</h4>
            </div>
            <div className="space-y-3">
              {request.comments.map((comment, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      <TbUser className="mr-1.5 h-4 w-4 text-gray-500" />
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <TbCalendarTime className="mr-1.5 h-3 w-3" />
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Close
          </button>
          
          {request.status !== 'completed' && request.status !== 'cancelled' && (
            <button className="inline-flex items-center rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-secondary-plot/90 hover:to-primary-plot/90">
              <TbMessage className="mr-1.5 h-4 w-4" />
              Add Comment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestDetails;