import { 
  mockLandlords, 
  mockProperties, 
  mockUnits, 
  mockTenants, 
  mockPayments, 
  mockMaintenanceRequests,
  mockNotifications
} from './mockData';

// Properties
export const getProperties = async (landlordId) => {
  return mockProperties.filter(property => property.landlordId === landlordId);
};

export const getProperty = async (propertyId) => {
  return mockProperties.find(property => property.id === propertyId);
};

export const createProperty = async (propertyData) => {
  const newProperty = {
    id: mockProperties.length + 1,
    ...propertyData,
    createdAt: new Date().toISOString(),
  };
  mockProperties.push(newProperty);
  return newProperty;
};

export const updateProperty = async (propertyId, propertyData) => {
  const index = mockProperties.findIndex(property => property.id === propertyId);
  if (index === -1) return null;
  
  const updatedProperty = {
    ...mockProperties[index],
    ...propertyData,
  };
  
  mockProperties[index] = updatedProperty;
  return updatedProperty;
};

export const deleteProperty = async (propertyId) => {
  const index = mockProperties.findIndex(property => property.id === propertyId);
  if (index === -1) return false;
  
  mockProperties.splice(index, 1);
  return true;
};

// Units
export const getUnits = async (propertyId) => {
  return mockUnits.filter(unit => unit.propertyId === propertyId);
};

export const getAllUnits = async (landlordId) => {
  const properties = await getProperties(landlordId);
  const propertyIds = properties.map(property => property.id);
  return mockUnits.filter(unit => propertyIds.includes(unit.propertyId));
};

export const getUnit = async (unitId) => {
  return mockUnits.find(unit => unit.id === unitId);
};

export const createUnit = async (unitData) => {
  const newUnit = {
    id: mockUnits.length + 1,
    ...unitData,
    createdAt: new Date().toISOString(),
  };
  mockUnits.push(newUnit);
  return newUnit;
};

export const updateUnit = async (unitId, unitData) => {
  const index = mockUnits.findIndex(unit => unit.id === unitId);
  if (index === -1) return null;
  
  const updatedUnit = {
    ...mockUnits[index],
    ...unitData,
  };
  
  mockUnits[index] = updatedUnit;
  return updatedUnit;
};

export const deleteUnit = async (unitId) => {
  const index = mockUnits.findIndex(unit => unit.id === unitId);
  if (index === -1) return false;
  
  mockUnits.splice(index, 1);
  return true;
};

// Tenants
export const getTenants = async (landlordId) => {
  // Get all units for this landlord's properties
  const properties = mockProperties.filter(property => property.landlordId === landlordId);
  const propertyIds = properties.map(property => property.id);
  const units = mockUnits.filter(unit => propertyIds.includes(unit.propertyId));
  const unitIds = units.map(unit => unit.id);
  
  // Return tenants in these units
  return mockTenants.filter(tenant => unitIds.includes(tenant.unitId));
};

export const getTenant = async (tenantId) => {
  return mockTenants.find(tenant => tenant.id === tenantId);
};

export const createTenant = async (tenantData) => {
  const newTenant = {
    id: mockTenants.length + 1,
    ...tenantData,
    createdAt: new Date().toISOString(),
  };
  mockTenants.push(newTenant);
  return newTenant;
};

export const updateTenant = async (tenantId, tenantData) => {
  const index = mockTenants.findIndex(tenant => tenant.id === tenantId);
  if (index === -1) return null;
  
  const updatedTenant = {
    ...mockTenants[index],
    ...tenantData,
  };
  
  mockTenants[index] = updatedTenant;
  return updatedTenant;
};

export const deleteTenant = async (tenantId) => {
  const index = mockTenants.findIndex(tenant => tenant.id === tenantId);
  if (index === -1) return false;
  
  mockTenants.splice(index, 1);
  return true;
};

// Payments
export const getPayments = async (landlordId) => {
  // Similar logic to filter payments for this landlord
  const properties = mockProperties.filter(property => property.landlordId === landlordId);
  const propertyIds = properties.map(property => property.id);
  const units = mockUnits.filter(unit => propertyIds.includes(unit.propertyId));
  const unitIds = units.map(unit => unit.id);
  
  return mockPayments.filter(payment => unitIds.includes(payment.unitId));
};

export const getPaymentsByProperty = async (propertyId) => {
  const units = mockUnits.filter(unit => unit.propertyId === propertyId);
  const unitIds = units.map(unit => unit.id);
  
  return mockPayments.filter(payment => unitIds.includes(payment.unitId));
};

export const getPaymentsByUnit = async (unitId) => {
  return mockPayments.filter(payment => payment.unitId === unitId);
};

// Maintenance Requests
export const getMaintenanceRequests = async (landlordId) => {
  // Similar logic to filter maintenance requests for this landlord
  const properties = mockProperties.filter(property => property.landlordId === landlordId);
  const propertyIds = properties.map(property => property.id);
  const units = mockUnits.filter(unit => propertyIds.includes(unit.propertyId));
  const unitIds = units.map(unit => unit.id);
  
  return mockMaintenanceRequests.filter(request => unitIds.includes(request.unitId));
};

export const getMaintenanceRequestsByProperty = async (propertyId) => {
  const units = mockUnits.filter(unit => unit.propertyId === propertyId);
  const unitIds = units.map(unit => unit.id);
  
  return mockMaintenanceRequests.filter(request => unitIds.includes(request.unitId));
};

export const getMaintenanceRequestsByUnit = async (unitId) => {
  return mockMaintenanceRequests.filter(request => request.unitId === unitId);
};

export const updateMaintenanceRequest = async (requestId, requestData) => {
  const index = mockMaintenanceRequests.findIndex(request => request.id === requestId);
  if (index === -1) return null;
  
  const updatedRequest = {
    ...mockMaintenanceRequests[index],
    ...requestData,
    updatedAt: new Date().toISOString(),
  };
  
  mockMaintenanceRequests[index] = updatedRequest;
  return updatedRequest;
};

export const updateMaintenanceStatus = async (requestId, status) => {
  const index = mockMaintenanceRequests.findIndex(request => request.id === requestId);
  if (index === -1) return false;
  
  mockMaintenanceRequests[index] = {
    ...mockMaintenanceRequests[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  
  return true;
};

// Financial Reports
export const getFinancialSummary = async (landlordId, period = 'month') => {
  // Mock financial summary data
  const totalRevenue = period === 'month' ? 450000 : period === 'quarter' ? 1350000 : 5400000;
  const totalExpenses = period === 'month' ? 180000 : period === 'quarter' ? 540000 : 2160000;
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = netIncome / totalRevenue;
  
  return {
    totalRevenue,
    totalExpenses,
    netIncome,
    profitMargin,
    period
  };
};

export const getOccupancyRates = async (landlordId, period = 'month') => {
  // Mock occupancy data
  const properties = await getProperties(landlordId);
  const totalUnits = 24;
  const occupiedUnits = 21;
  const overallRate = occupiedUnits / totalUnits;
  
  // Mock property-specific occupancy rates
  const byProperty = properties.map(property => ({
    id: property.id,
    name: property.name,
    rate: Math.random() * 0.3 + 0.7 // Random rate between 70% and 100%
  }));
  
  return {
    totalUnits,
    occupiedUnits,
    overallRate,
    byProperty,
    period
  };
};

export const getMaintenanceCosts = async (landlordId, period = 'month') => {
  // Mock maintenance cost data
  const totalCost = period === 'month' ? 45000 : period === 'quarter' ? 135000 : 540000;
  const completedCount = period === 'month' ? 8 : period === 'quarter' ? 24 : 96;
  const averageCost = totalCost / completedCount;
  const pendingCount = 5;
  const estimatedPendingCost = 30000;
  
  // Mock category breakdown
  const byCategory = [
    { name: 'Plumbing', amount: totalCost * 0.3 },
    { name: 'Electrical', amount: totalCost * 0.25 },
    { name: 'HVAC', amount: totalCost * 0.2 },
    { name: 'Structural', amount: totalCost * 0.15 },
    { name: 'Other', amount: totalCost * 0.1 }
  ];
  
  return {
    totalCost,
    completedCount,
    averageCost,
    pendingCount,
    estimatedPendingCost,
    byCategory,
    period
  };
};

export const getRentCollection = async (landlordId, period = 'month') => {
  // Mock rent collection data
  const expectedAmount = period === 'month' ? 500000 : period === 'quarter' ? 1500000 : 6000000;
  const collectedAmount = period === 'month' ? 450000 : period === 'quarter' ? 1350000 : 5400000;
  const outstandingAmount = expectedAmount - collectedAmount;
  const collectionRate = collectedAmount / expectedAmount;
  
  return {
    expectedAmount,
    collectedAmount,
    outstandingAmount,
    collectionRate,
    period
  };
};

// Notifications
export const getLandlordNotifications = async (landlordId) => {
  return mockNotifications.filter(
    notification => notification.recipientId === landlordId && notification.recipientType === 'landlord'
  );
};

export const markNotificationAsRead = async (notificationId) => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.readAt = new Date().toISOString();
  }
  return notification;
};

// Dashboard Summary
export const getDashboardSummary = async (landlordId) => {
  const properties = await getProperties(landlordId);
  const propertyIds = properties.map(property => property.id);
  
  const units = mockUnits.filter(unit => propertyIds.includes(unit.propertyId));
  const unitIds = units.map(unit => unit.id);
  
  const tenants = mockTenants.filter(tenant => unitIds.includes(tenant.unitId));
  const payments = mockPayments.filter(payment => unitIds.includes(payment.unitId));
  const maintenanceRequests = mockMaintenanceRequests.filter(request => unitIds.includes(request.unitId));
  
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(unit => unit.status === 'occupied').length;
  const vacantUnits = units.filter(unit => unit.status === 'vacant').length;
  const totalTenants = tenants.length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });
  
  const totalMonthlyRent = units.reduce((sum, unit) => sum + unit.rentAmount, 0);
  const totalCollectedRent = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingMaintenance = maintenanceRequests.filter(request => request.status === 'pending').length;
  const inProgressMaintenance = maintenanceRequests.filter(request => request.status === 'in_progress').length;
  const completedMaintenance = maintenanceRequests.filter(request => request.status === 'completed').length;
  
  // Calculate monthly revenue for the last 6 months
  const revenueData = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    
    const monthPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate.getMonth() === month.getMonth() && 
             paymentDate.getFullYear() === month.getFullYear();
    });
    
    const monthRevenue = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    revenueData.push({
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      revenue: monthRevenue
    });
  }
  
  return {
    totalProperties,
    totalUnits,
    occupiedUnits,
    vacantUnits,
    occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
    vacancyRate: totalUnits > 0 ? (vacantUnits / totalUnits) * 100 : 0,
    totalTenants,
    totalMonthlyRent,
    totalCollectedRent,
    rentCollectionRate: totalMonthlyRent > 0 ? (totalCollectedRent / totalMonthlyRent) * 100 : 0,
    pendingMaintenance,
    inProgressMaintenance,
    completedMaintenance,
    recentProperties: properties.slice(0, 3),
    recentPayments: payments.slice(0, 5),
    recentMaintenanceRequests: maintenanceRequests.filter(request => request.status === 'pending').slice(0, 5),
    revenueData
  };
};
