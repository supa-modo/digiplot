import { 
  mockTenants, 
  mockUnits, 
  mockPayments, 
  mockMaintenanceRequests,
  mockNotifications,
  mockReceipts
} from './mockData';

// Tenant Profile
export const getTenantProfile = async (tenantId) => {
  return mockTenants.find(tenant => tenant.id === tenantId);
};

// Tenant Unit
export const getTenantUnit = async (tenantId) => {
  const tenant = mockTenants.find(tenant => tenant.id === tenantId);
  if (!tenant) return null;
  
  return mockUnits.find(unit => unit.id === tenant.unitId);
};

// Payments
export const getTenantPayments = async (tenantId) => {
  return mockPayments.filter(payment => payment.tenantId === tenantId);
};

export const getTenantPaymentReceipt = async (paymentId) => {
  return mockReceipts.find(receipt => receipt.paymentId === paymentId);
};

export const makePayment = async (paymentData) => {
  const newPayment = {
    id: mockPayments.length + 1,
    ...paymentData,
    paymentDate: new Date().toISOString(),
    status: 'pending', // Initially pending, would be updated by M-Pesa callback
    createdAt: new Date().toISOString(),
  };
  
  mockPayments.push(newPayment);
  return newPayment;
};

// Maintenance Requests
export const getTenantMaintenanceRequests = async (tenantId) => {
  return mockMaintenanceRequests.filter(request => request.tenantId === tenantId);
};

export const createMaintenanceRequest = async (requestData) => {
  const newRequest = {
    id: mockMaintenanceRequests.length + 1,
    ...requestData,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockMaintenanceRequests.push(newRequest);
  return newRequest;
};

// Notifications
export const getTenantNotifications = async (tenantId) => {
  return mockNotifications.filter(
    notification => notification.recipientId === tenantId && notification.recipientType === 'tenant'
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
export const getTenantDashboardSummary = async (tenantId) => {
  const tenant = await getTenantProfile(tenantId);
  const unit = await getTenantUnit(tenantId);
  const payments = await getTenantPayments(tenantId);
  const maintenanceRequests = await getTenantMaintenanceRequests(tenantId);
  
  // Get the current month's payment if it exists
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthPayment = payments.find(payment => {
    const paymentDate = new Date(payment.paymentDate);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });
  
  const rentStatus = currentMonthPayment ? 'paid' : 'unpaid';
  const nextPaymentDue = new Date(currentYear, currentMonth + 1, 1);
  
  const pendingMaintenanceCount = maintenanceRequests.filter(
    request => request.status === 'pending'
  ).length;
  
  const inProgressMaintenanceCount = maintenanceRequests.filter(
    request => request.status === 'in_progress'
  ).length;
  
  return {
    tenant,
    unit,
    rentAmount: unit ? unit.rentAmount : 0,
    rentStatus,
    nextPaymentDue,
    pendingMaintenanceCount,
    inProgressMaintenanceCount,
    recentPayments: payments.slice(0, 3), // Last 3 payments
  };
};
