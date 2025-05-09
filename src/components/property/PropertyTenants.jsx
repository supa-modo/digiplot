import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const PropertyTenants = ({ tenants, propertyId }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!tenants || tenants.length === 0) {
    return (
      <Card title="Tenants" className="bg-white">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
          <p className="mt-1 text-sm text-gray-500">There are no tenants for this property.</p>
        </div>
      </Card>
    );
  }

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    // Filter by status
    if (filterStatus === 'active' && tenant.moveOutDate) {
      return false;
    }
    
    if (filterStatus === 'former' && !tenant.moveOutDate) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tenant.name.toLowerCase().includes(query) ||
        tenant.email.toLowerCase().includes(query) ||
        tenant.phoneNumber.includes(query) ||
        tenant.unitNumber.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Count active and former tenants
  const activeTenants = tenants.filter(tenant => !tenant.moveOutDate).length;
  const formerTenants = tenants.filter(tenant => tenant.moveOutDate).length;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card title="Tenants" className="bg-white">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-[rgb(var(--color-primary))/0.1] p-3 text-center">
          <p className="text-sm font-medium text-[rgb(var(--color-primary))]">Total Tenants</p>
          <p className="text-2xl font-semibold text-gray-900">{tenants.length}</p>
        </div>
        
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-sm font-medium text-green-800">Active Tenants</p>
          <p className="text-2xl font-semibold text-green-900">{activeTenants}</p>
        </div>
        
        <div className="rounded-lg bg-yellow-50 p-3 text-center">
          <p className="text-sm font-medium text-yellow-800">Former Tenants</p>
          <p className="text-2xl font-semibold text-yellow-900">{formerTenants}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Tenants</option>
            <option value="active">Active Tenants</option>
            <option value="former">Former Tenants</option>
          </select>
        </div>
        
        <Link to="/landlord/tenants">
          <Button variant="outline" size="sm">
            View All Tenants
          </Button>
        </Link>
      </div>

      {filteredTenants.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Move-in Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Lease Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[rgb(var(--color-primary))/0.1] flex items-center justify-center">
                        <span className="text-[rgb(var(--color-primary))] font-medium">
                          {tenant.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.email}</div>
                        <div className="text-sm text-gray-500">{tenant.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tenant.unitNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(tenant.moveInDate)}</div>
                    {tenant.moveOutDate && (
                      <div className="text-sm text-gray-500">
                        Move-out: {formatDate(tenant.moveOutDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(tenant.leaseStartDate)} - {formatDate(tenant.leaseEndDate)}
                    </div>
                    {tenant.leaseEndDate && new Date(tenant.leaseEndDate) < new Date() && !tenant.moveOutDate && (
                      <div className="text-sm text-red-500">Lease expired</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={tenant.moveOutDate ? 'warning' : 'success'}
                    >
                      {tenant.moveOutDate ? 'Former' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/landlord/tenants/${tenant.id}`}>
                        <Button variant="outline" size="xs">
                          View
                        </Button>
                      </Link>
                      <Link to={`/landlord/tenants/${tenant.id}/edit`}>
                        <Button variant="outline" size="xs">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <h3 className="text-sm font-medium text-gray-900">No tenants found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' 
              ? 'No tenants match your search criteria.' 
              : 'There are no tenants for this property.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default PropertyTenants;
