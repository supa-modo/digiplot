import React from 'react';
import { TbInfoCircle } from 'react-icons/tb';

const ProfileResidenceTab = ({ unit, formatDate }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-secondary-plot">Residence Information</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Property</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{unit?.propertyName || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Unit Number</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{unit?.unitNumber || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Floor</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{unit?.floor || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {unit ? formatCurrency(unit.rentAmount) : 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Lease Start</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{formatDate(unit?.leaseStart)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Lease End</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{formatDate(unit?.leaseEnd)}</p>
          </div>
        </div>
        
        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TbInfoCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Lease Information</h3>
              <p className="mt-2 text-sm text-blue-700">
                Your lease is valid until {formatDate(unit?.leaseEnd)}. Please contact property management
                at least 30 days before expiration if you wish to renew.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileResidenceTab;
