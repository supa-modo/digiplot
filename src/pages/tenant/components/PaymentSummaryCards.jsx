import React from "react";
import {
  TbHomeDot,
  TbCalendarDollar,
  TbCreditCard,
  TbChartBar,
  TbCash,
  TbCalendar,
  TbCoins,
} from "react-icons/tb";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const PaymentSummaryCards = ({ unit, stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 px-4">
      {/* Unit Info Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-primary-plot/15 p-4 md:p-6 shadow-lg ">
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary-plot/10 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3 md:mb-3.5">
            <div className="flex h-11 md:h-12 w-11 md:w-12 items-center justify-center rounded-full bg-primary-plot/10">
              <TbHomeDot className="h-5 md:h-6 w-5 md:w-6 text-primary-plot" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-primary-plot">
                Unit Details
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {unit ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[0.8rem] md:text-sm text-secondary-plot/80">Unit Number</span>
                  <span className="font-medium text-[0.9rem] md:text-base text-primary-700">
                    {unit.unitNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[0.8rem] md:text-sm text-secondary-plot/80">Floor</span>
                  <span className="font-medium text-[0.9rem] md:text-base text-primary-700">{unit.floor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[0.8rem] md:text-sm text-secondary-plot/80">Monthly Rent</span>
                  <span className="font-medium text-[0.9rem] md:text-base text-primary-700">
                    {formatCurrency(unit.rentAmount)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Unit information unavailable</p>
            )}
          </div>
        </div>
      </div>

      {/* Next Payment Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-amber-50 p-6 shadow-lg">
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-amber-600/10 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3 md:mb-3.5">
            <div className="flex h-11 md:h-12 w-11 md:w-12 items-center justify-center rounded-full bg-amber-600/10">
              <TbCalendarDollar className="h-5 md:h-6 w-5 md:w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-amber-600">
                Next Payment
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[0.8rem] md:text-sm text-secondary-plot/80">Due Date</span>
              <span className="font-medium text-[0.9rem] md:text-base text-amber-700">
                {stats.nextDueDate
                  ? formatDate(stats.nextDueDate)
                  : "Not scheduled"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[0.8rem] md:text-sm text-secondary-plot/80">Amount Due</span>
              <span className="font-medium text-[0.9rem] md:text-base text-amber-700">
                {unit ? formatCurrency(unit.rentAmount) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[0.8rem] md:text-sm text-secondary-plot/80">Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 border border-amber-300 text-amber-800">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-secondary-plot/10 p-6 shadow-lg">
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-secondary-plot/10 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3 md:mb-3.5">
            <div className="flex h-11 md:h-12 w-11 md:w-12 items-center justify-center rounded-full bg-secondary-plot/10">
              <TbCoins className="h-5 md:h-6 w-5 md:w-6 text-secondary-plot" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-secondary-plot">
                Last Payment
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {stats.lastPayment ? (
              <>
                <div className="flex justify-between  text-secondary-plot/80 items-center">
                  <span className="text-[0.8rem] md:text-sm ">Date</span>
                  <span className="font-medium text-[0.9rem] md:text-base text-secondary-plot">
                    {formatDate(stats.lastPayment.paymentDate)}
                  </span>
                </div>
                <div className="flex justify-between  text-secondary-plot/80 items-center">
                  <span className="text-[0.8rem] md:text-sm ">Amount</span>
                  <span className="font-medium text-[0.9rem] md:text-base text-secondary-plot">
                    {formatCurrency(stats.lastPayment.amount)}
                  </span>
                </div>
                <div className="flex justify-between  text-secondary-plot/80 items-center">
                  <span className="text-[0.8rem] md:text-sm ">Method</span>
                  <span className="font-medium text-[0.9rem] md:text-base text-secondary-plot">
                    {stats.lastPayment.paymentMethod || "N/A"}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No payment history available</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Stats Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-plot to-primary-plot p-4 md:p-6 text-white shadow-md">
        {/* Enhanced glass morphism effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2 md:mb-2.5">
            <div className="flex h-11 md:h-12 w-11 md:w-12 items-center justify-center rounded-full bg-white/20">
              <TbChartBar className="h-5 md:h-6 w-5 md:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-white">
                Payment Stats
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <p className="text-xs md:text-[0.8rem] text-white/80">Total Paid (YTD)</p>
              <p className="text-2xl font-bold mt-0.5">
                {formatCurrency(stats.totalPaid)}
              </p>
            </div>
            
            <div className="pt-1.5">
              <div className="h-1 w-full bg-white/20 rounded-full mb-2">
                <div 
                  className="h-1 bg-white rounded-full" 
                  style={{ width: `${Math.min(100, (stats.totalPaid / (unit?.rentAmount * 12)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-white/80">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCards;
