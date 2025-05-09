import React from 'react';
import Card from '../../components/common/Card';

const PropertyOccupancy = ({ occupancyData }) => {
  if (!occupancyData) return null;

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card title="Occupancy Statistics" className="bg-white">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-[rgb(var(--color-primary))/0.1] p-4">
          <p className="text-sm font-medium text-[rgb(var(--color-primary))]">Occupancy Rate</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatPercentage(occupancyData.occupancyRate)}</p>
        </div>
        
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">Occupied Units</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {occupancyData.occupiedUnits} <span className="text-base font-medium text-gray-500">of {occupancyData.totalUnits}</span>
          </p>
        </div>
        
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Vacant Units</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {occupancyData.totalUnits - occupancyData.occupiedUnits} <span className="text-base font-medium text-gray-500">of {occupancyData.totalUnits}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Occupancy Breakdown</h3>
        <div className="mt-4 h-10 w-full overflow-hidden rounded-lg">
          <div className="flex h-full w-full">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${(occupancyData.occupiedUnits / occupancyData.totalUnits) * 100}%` }}
            >
              <span className="flex h-full items-center justify-center text-sm font-medium text-white">
                {formatPercentage(occupancyData.occupiedUnits / occupancyData.totalUnits)} Occupied
              </span>
            </div>
            <div 
              className="h-full bg-yellow-500" 
              style={{ width: `${(occupancyData.underMaintenanceUnits / occupancyData.totalUnits) * 100}%` }}
            >
              {occupancyData.underMaintenanceUnits > 0 && (
                <span className="flex h-full items-center justify-center text-sm font-medium text-white">
                  {formatPercentage(occupancyData.underMaintenanceUnits / occupancyData.totalUnits)} Maintenance
                </span>
              )}
            </div>
            <div 
              className="h-full bg-red-500" 
              style={{ width: `${((occupancyData.totalUnits - occupancyData.occupiedUnits - occupancyData.underMaintenanceUnits) / occupancyData.totalUnits) * 100}%` }}
            >
              {(occupancyData.totalUnits - occupancyData.occupiedUnits - occupancyData.underMaintenanceUnits) > 0 && (
                <span className="flex h-full items-center justify-center text-sm font-medium text-white">
                  {formatPercentage((occupancyData.totalUnits - occupancyData.occupiedUnits - occupancyData.underMaintenanceUnits) / occupancyData.totalUnits)} Vacant
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {occupancyData.occupancyHistory && occupancyData.occupancyHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Occupancy Trend (Last 6 Months)</h3>
          <div className="mt-4 h-64 w-full">
            <div className="flex h-full items-end space-x-4 rounded-md border border-gray-200 p-4">
              {occupancyData.occupancyHistory.map((data, index) => (
                <div key={index} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div 
                    className="w-full bg-[rgb(var(--color-primary))]" 
                    style={{ 
                      height: `${data.rate * 100}%`,
                      minHeight: '10%'
                    }}
                  ></div>
                  <div className="mt-2 text-xs font-medium text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {occupancyData.tenantTurnover && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Tenant Turnover</h3>
          <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Annual Turnover Rate</p>
              <p className="text-xl font-semibold text-gray-900">{formatPercentage(occupancyData.tenantTurnover.annualRate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Tenancy</p>
              <p className="text-xl font-semibold text-gray-900">{occupancyData.tenantTurnover.averageTenancy} months</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">New Tenants (YTD)</p>
              <p className="text-xl font-semibold text-gray-900">{occupancyData.tenantTurnover.newTenantsYTD}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PropertyOccupancy;
