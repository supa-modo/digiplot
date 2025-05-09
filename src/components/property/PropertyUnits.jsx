import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const PropertyUnits = ({ units, propertyId }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('unitNumber');
  const [sortOrder, setSortOrder] = useState('asc');

  if (!units || units.length === 0) {
    return (
      <Card title="Units" className="bg-white">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No units found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new unit.</p>
          <div className="mt-6">
            <Link to={`/landlord/properties/${propertyId}/units/new`}>
              <Button variant="primary">Add New Unit</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // Filter and sort units
  const filteredUnits = units.filter(unit => {
    // Filter by status
    if (filterStatus !== 'all' && unit.status !== filterStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        unit.unitNumber.toLowerCase().includes(query) ||
        (unit.floor && unit.floor.toString().toLowerCase().includes(query)) ||
        (unit.tenantName && unit.tenantName.toLowerCase().includes(query))
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected field
    let comparison = 0;
    
    switch (sortBy) {
      case 'unitNumber':
        comparison = a.unitNumber.localeCompare(b.unitNumber);
        break;
      case 'floor':
        comparison = (a.floor || '').toString().localeCompare((b.floor || '').toString());
        break;
      case 'bedrooms':
        comparison = a.bedrooms - b.bedrooms;
        break;
      case 'rentAmount':
        comparison = a.rentAmount - b.rentAmount;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Count units by status
  const statusCounts = units.reduce((counts, unit) => {
    counts[unit.status] = (counts[unit.status] || 0) + 1;
    return counts;
  }, {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'vacant':
        return 'warning';
      case 'occupied':
        return 'success';
      case 'maintenance':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'vacant':
        return 'Vacant';
      case 'occupied':
        return 'Occupied';
      case 'maintenance':
        return 'Under Maintenance';
      default:
        return status;
    }
  };

  return (
    <Card title="Units" className="bg-white">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-sm font-medium text-blue-800">Total Units</p>
          <p className="text-2xl font-semibold text-blue-900">{units.length}</p>
        </div>
        
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-sm font-medium text-green-800">Occupied</p>
          <p className="text-2xl font-semibold text-green-900">{statusCounts.occupied || 0}</p>
        </div>
        
        <div className="rounded-lg bg-yellow-50 p-3 text-center">
          <p className="text-sm font-medium text-yellow-800">Vacant</p>
          <p className="text-2xl font-semibold text-yellow-900">{statusCounts.vacant || 0}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search units..."
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
        
        <div className="flex items-center space-x-4">
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Units</option>
            <option value="occupied">Occupied</option>
            <option value="vacant">Vacant</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
          
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-[rgb(var(--color-primary))]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="unitNumber">Unit Number</option>
            <option value="floor">Floor</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="rentAmount">Rent</option>
          </select>
          
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

      <div className="mt-2 flex justify-end">
        <Link to={`/landlord/properties/${propertyId}/units/new`}>
          <Button variant="primary" size="sm">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Unit
          </Button>
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Unit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tenant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUnits.map((unit) => (
              <tr key={unit.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{unit.unitNumber}</div>
                  {unit.floor && (
                    <div className="text-sm text-gray-500">Floor {unit.floor}</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {unit.bedrooms} bed, {unit.bathrooms} bath
                  </div>
                  {unit.squareFeet && (
                    <div className="text-sm text-gray-500">{unit.squareFeet} sq ft</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(unit.rentAmount)}</div>
                  <div className="text-sm text-gray-500">per month</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge variant={getStatusBadgeVariant(unit.status)}>
                    {getStatusLabel(unit.status)}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {unit.tenantName ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">{unit.tenantName}</div>
                      {unit.leaseEndDate && (
                        <div className="text-sm text-gray-500">
                          Lease ends: {new Date(unit.leaseEndDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No tenant</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link to={`/landlord/properties/${propertyId}/units/${unit.id}`}>
                      <Button variant="outline" size="xs">
                        View
                      </Button>
                    </Link>
                    <Link to={`/landlord/properties/${propertyId}/units/${unit.id}/edit`}>
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

      {filteredUnits.length === 0 && (
        <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <h3 className="text-sm font-medium text-gray-900">No units found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' 
              ? 'No units match your search criteria.' 
              : 'Get started by creating a new unit.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default PropertyUnits;
