import { useState, useEffect } from 'react';
import { TbCash, TbLoader2, TbCheck, TbX, TbLock, TbPhone, TbShieldLock } from 'react-icons/tb';
import { makePayment } from '../../../services/mock/tenantService';
import Mpesaicon from '../../../components/common/MpesaIcon';

const PaymentModal = ({ isOpen, onClose, unit, onPaymentSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (unit) {
      setPaymentAmount(unit.rentAmount.toString());
    }
    
    // Reset state when modal opens
    if (isOpen) {
      setPaymentSuccess(false);
      setError('');
      setPaymentProcessing(false);
    }
  }, [unit, isOpen]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setError('');
    
    if (!phoneNumber && paymentMethod === 'mpesa') {
      setError('Please enter a valid phone number');
      setPaymentProcessing(false);
      return;
    }
    
    try {
      // Simulate M-Pesa payment process
      const paymentData = {
        tenantId: 1, // Mock tenant ID
        unitId: unit.id,
        amount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card',
        transactionReference: `${paymentMethod.toUpperCase()}${Math.floor(Math.random() * 1000000)}`,
        phoneNumber: phoneNumber
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await makePayment(paymentData);
      
      setPaymentSuccess(true);
      
      // Notify parent component of success
      onPaymentSuccess(result);
      
      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
        setPaymentProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-plot/10 blur-xl opacity-70"></div>
        
        {/* Modal header */}
        <div className="relative z-10 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-secondary-plot to-primary-plot p-5 text-white">
          <h3 className="text-xl font-bold">Make Payment</h3>
          <button 
            onClick={onClose}
            disabled={paymentProcessing}
            className="rounded-full bg-white/20 p-1.5 text-white transition-all hover:bg-white/30"
          >
            <TbX className="h-5 w-5" />
          </button>
        </div>
        
        {/* Modal body */}
        <div className="relative z-10 p-6">
          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <TbCheck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Payment Successful!</h3>
              <p className="mt-2 text-center text-gray-600">
                Your payment of {formatCurrency(parseFloat(paymentAmount))} has been processed successfully.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-5 py-3 text-center text-white shadow-md transition-all hover:shadow-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
                  <div className="flex">
                    <TbX className="h-5 w-5 text-red-600" />
                    <span className="ml-2">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`flex cursor-pointer items-center rounded-lg border p-4 transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-primary-plot bg-primary-plot/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('mpesa')}
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Mpesaicon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500">Pay with M-Pesa</p>
                    </div>
                  </div>
                  
                  <div
                    className={`flex cursor-pointer items-center rounded-lg border p-4 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary-plot bg-primary-plot/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <TbCash className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Card</p>
                      <p className="text-xs text-gray-500">Pay with card</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {paymentMethod === 'mpesa' && (
                <div className="mb-6">
                  <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <TbPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-primary-plot focus:ring-primary-plot"
                      placeholder="Enter your M-Pesa number"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <TbCash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-primary-plot focus:ring-primary-plot"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
                <div className="flex">
                  <TbShieldLock className="h-5 w-5 text-blue-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs">Your payment information is secure and encrypted</p>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={paymentProcessing}
                className="w-full rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-5 py-3 text-center text-white shadow-md transition-all hover:shadow-lg disabled:opacity-70"
              >
                {paymentProcessing ? (
                  <span className="flex items-center justify-center">
                    <TbLoader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <TbLock className="mr-2 h-5 w-5" />
                    Pay {formatCurrency(parseFloat(paymentAmount || 0))}
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
