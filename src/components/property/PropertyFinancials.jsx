import React from 'react';
import Card from '../../components/common/Card';

const PropertyFinancials = ({ financials }) => {
  if (!financials) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card title="Financial Summary" className="bg-white">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">Total Monthly Rent</p>
          <p className="mt-2 text-3xl font-bold text-green-900">{formatCurrency(financials.totalMonthlyRent)}</p>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">Collected This Month</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{formatCurrency(financials.collectedRent)}</p>
        </div>
        
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Outstanding</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">
            {formatCurrency(financials.outstandingRent)}
          </p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Rent Collection</h3>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Collection Rate</p>
              <p className="text-sm font-medium text-gray-900">{formatPercentage(financials.collectionRate)}</p>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div 
                className="h-full rounded-full bg-[rgb(var(--color-primary))]" 
                style={{ width: `${financials.collectionRate * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">Expenses</h3>
          <div className="mt-2 space-y-3">
            {financials.expenses.map((expense, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">{expense.category}</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className="h-full rounded-full bg-[rgb(var(--color-primary))]" 
                    style={{ width: `${(expense.amount / financials.totalExpenses) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
            <p className="text-sm font-medium text-gray-700">Total Expenses</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(financials.totalExpenses)}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Net Income</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Monthly Net Income</p>
          <p className={`text-lg font-semibold ${financials.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(financials.netIncome)}
          </p>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div 
            className={`h-full rounded-full ${financials.netIncome >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(Math.abs(financials.netIncome) / financials.totalMonthlyRent * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyFinancials;
