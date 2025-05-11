import React, { useState } from "react";
import {
  TbFilter,
  TbArrowUp,
  TbArrowDown,
  TbSearch,
  TbDownload,
  TbInfoCircle,
  TbChevronRight,
  TbCheck,
  TbClock,
  TbX,
  TbFileInvoice,
} from "react-icons/tb";
import Badge from "../../../components/common/Badge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import PaymentDetails from "./PaymentDetails";

const PaymentHistory = ({
  payments,
  filterStatus,
  setFilterStatus,
  sortDirection,
  setSortDirection,
  searchQuery,
  setSearchQuery,
  setSelectedPayment,
}) => {
  const [viewingPayment, setViewingPayment] = useState(null);

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

  return (
    <div className="px-4">
      {viewingPayment ? (
        <div className="mb-8">
          <button
            onClick={() => setViewingPayment(null)}
            className="mb-4 flex items-center text-sm font-medium text-gray-600 hover:text-primary-plot"
          >
            <TbArrowDown className="mr-1 h-4 w-4 rotate-90" />
            Back to Payments
          </button>
          <PaymentDetails
            payment={viewingPayment}
            onClose={() => setViewingPayment(null)}
          />
        </div>
      ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-secondary-plot mb-4">
              Rent Payment History
            </h2>

            {/* Filters and Search */}
            <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-6 py-1.5 text-sm font-medium rounded-md transition ${
                    filterStatus === "all"
                      ? "bg-secondary-plot text-white "
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("paid")}
                  className={`px-6 py-1.5 text-sm font-medium rounded-md transition ${
                    filterStatus === "paid"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-6 py-1.5 text-sm font-medium rounded-md transition ${
                    filterStatus === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus("failed")}
                  className={`px-6 py-1.5 text-sm font-medium rounded-md transition ${
                    filterStatus === "failed"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  Failed
                </button>
              </div>

              <div className="w-full md:w-[40%] flex items-center space-x-2">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbSearch className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot"
                    placeholder="Search payments..."
                  />
                </div>

                <button
                  onClick={() =>
                    setSortDirection(sortDirection === "desc" ? "asc" : "desc")
                  }
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {sortDirection === "desc" ? (
                    <>
                      <TbArrowDown className="mr-1.5 h-4 w-4" />
                      <span>Newest</span>
                    </>
                  ) : (
                    <>
                      <TbArrowUp className="mr-1.5 h-4 w-4" />
                      <span>Oldest</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
              <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="pl-6 py-3 text-xs max-w-[120px] font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                        >
                          <td className="pl-6 py-4 text-sm text-secondary-plot whitespace-nowrap">
                            {index + 1}.
                          </td>
                          <td className="pl-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="pl-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(payment.paymentDate)}
                            </div>
                          </td>
                          <td className="pl-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {payment.reference}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.description || "Rent Payment"}
                            </div>
                          </td>
                          <td className="pl-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {payment.paymentMethod || "N/A"}
                            </div>
                          </td>
                          <td className="pl-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                          </td>
                          <td className="pl-6 py-4 whitespace-nowrap text-sm font-medium max-w-[120px]">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => setViewingPayment(payment)}
                                className="text-primary-plot hover:text-primary-700 transition"
                                title="View details"
                              >
                                <div className="flex items-center space-x-2 underline underline-offset-4">
                                  <TbInfoCircle className="h-5 w-5" />
                                  <span className="sr-only">View Details</span>
                                  <span className="">Details</span>
                                </div>
                              </button>
                              {payment.status === "paid" && (
                                <button
                                  className="text-secondary-plot bg-secondary-plot/10 px-3 py-1 rounded-md hover:text-secondary-700 transition"
                                  title="Download receipt"
                                >
                                  <div className="flex items-center space-x-2 ">
                                    <TbDownload className="h-5 w-5" />
                                    <span className="sr-only">Download Receipt</span>
                                    <span className="">Receipt</span>
                                  </div>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                              <TbFilter className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="mt-2 text-[0.8rem] md:text-sm font-medium text-primary-plot">
                              No payments found
                            </p>
                            <p className="text-xs text-gray-500">
                              {searchQuery
                                ? "Try adjusting your search or filters"
                                : "Make your first payment to see it here"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default PaymentHistory;
