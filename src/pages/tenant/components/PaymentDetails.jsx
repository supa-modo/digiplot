import { useState } from "react";
import { 
  TbFileInvoice, 
  TbCalendar, 
  TbCreditCard, 
  TbReceipt, 
  TbDownload, 
  TbChevronRight, 
  TbClock,
  TbCheck,
  TbX
} from "react-icons/tb";
import Badge from "../../../components/common/Badge";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const PaymentDetails = ({ payment, onClose }) => {
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  const handleDownloadReceipt = () => {
    setDownloadingReceipt(true);
    // Simulate download delay
    setTimeout(() => {
      setDownloadingReceipt(false);
    }, 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "failed":
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <TbCheck className="h-6 w-6 text-green-600" />
          </div>
        );
      case "pending":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <TbClock className="h-6 w-6 text-amber-600" />
          </div>
        );
      case "failed":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <TbX className="h-6 w-6 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <TbCreditCard className="h-6 w-6 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary-plot to-primary-plot p-6 text-white">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {getStatusIcon(payment.status)}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold">Payment {payment.reference}</h3>
                {getStatusBadge(payment.status)}
              </div>
              <p className="text-white/80 text-sm">
                {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(payment.amount)}</p>
          </div>
        </div>
      </div>

      {/* Payment details */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Payment method */}
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <TbCreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
              <p className="mt-1 text-base font-medium text-gray-900">{payment.paymentMethod}</p>
              {payment.phoneNumber && (
                <p className="text-sm text-gray-500">{payment.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Invoice details */}
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <TbFileInvoice className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-500">Invoice Details</h4>
              <p className="mt-1 text-base font-medium text-gray-900">
                Rent for {payment.description || "Unit"}
              </p>
              <p className="text-sm text-gray-500">
                Invoice #{payment.invoiceNumber || payment.reference}
              </p>
            </div>
          </div>

          {/* Transaction details */}
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
              <TbReceipt className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-500">Transaction Details</h4>
              <p className="mt-1 text-base font-medium text-gray-900">
                Transaction #{payment.transactionReference || payment.reference}
              </p>
              <p className="text-sm text-gray-500">
                Processed on {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>

          {/* Payment period */}
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
              <TbCalendar className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-500">Payment Period</h4>
              <p className="mt-1 text-base font-medium text-gray-900">
                {payment.period || "Monthly"}
              </p>
              <p className="text-sm text-gray-500">
                {payment.periodStart && payment.periodEnd
                  ? `${formatDate(payment.periodStart)} - ${formatDate(payment.periodEnd)}`
                  : "Current billing period"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleDownloadReceipt}
            disabled={downloadingReceipt}
            className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <TbDownload className="h-5 w-5 text-green-600" />
                </div>
                <span className="ml-3 font-medium text-gray-900">
                  {downloadingReceipt ? "Generating receipt..." : "Download Receipt"}
                </span>
              </div>
              <TbChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-3 font-medium text-white shadow-md transition hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
