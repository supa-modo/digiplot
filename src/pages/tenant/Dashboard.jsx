import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTenantDashboardSummary } from "../../services/mock/tenantService";
import { Link } from "react-router-dom";
import Mpesaicon from "../../components/common/MpesaIcon";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  TbAlertTriangle,
  TbLoader2,
  TbCalendarEvent,
  TbHome,
  TbCreditCard,
  TbTools,
  TbChevronRight,
  TbBuildingSkyscraper,
  TbBed,
  TbBath,
  TbStairs,
  TbCalendarTime,
  TbCoin,
  TbRefresh,
  TbArrowUp,
  TbArrowDown,
  TbCheck,
  TbX,
  TbExclamationCircle,
  TbChartBar,
  TbCoins,
  TbArrowRight,
  TbUserCircle,
  TbSun,
  TbClock,
  TbCalendarDollar,
} from "react-icons/tb";

// Import our custom components
import TenantButton from "./components/TenantButton";
import { Footer } from "./components/Footer";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    // Set time of day greeting
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    const fetchSummary = async () => {
      try {
        // Using tenant ID 1 for mock data
        const data = await getTenantDashboardSummary(1);
        setSummary(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <TbLoader2 className="mx-auto h-8 md:h-10 w-8 md:w-10 text-primary-plot animate-spin" />
          <p className="mt-4 text-sm md:text-base  text-secondary-plot">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center ">
            <TbAlertTriangle className="h-10 w-10 text-danger-plot" />
          </div>
          <h2 className="mt-2 text-base md:text-lg font-medium text-red-600">
            No Data Available !!
          </h2>
          <p className="mt-2 text-sm md:text-base max-w-xl text-gray-500">
            We're unable to load your dashboard data at the moment. Please try
            again later or contact support if the issue persists.
          </p>
          <TenantButton
            variant="primary"
            className="mt-6 px-6 py-3 md:py-3.5 rounded-lg flex items-center bg-gradient-to-r to-secondary-plot/80 from-primary-plot"
          >
            <TbRefresh className="mr-1.5" size={19} />
            <span>Refresh Dashboard</span>
          </TenantButton>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="pt-6 pb-6 mx-auto max-w-screen-2xl px-2 md:px-4">
      {/* Welcome Section */}
      <div className="mb-4 md:mb-6">
          <div className="px-4 flex items-baseline justify-between mb-2 lg:mb-0">
              <div className="">
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                    <TbSun className="h-4 w-4 mr-1.5 text-primary-plot" />
                    <span>Good {timeOfDay}</span>
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
                  Welcome back,{" "}
                  <span className="text-primary-plot">
                    {summary.tenant?.name || "Tenant"}
                  </span>
                </h1>
                </div>

                <div className="hidden md:flex items-center mt-1.5 text-[0.8rem] md:text-sm font-medium text-gray-600">
                  <TbCalendarEvent className="h-4 w-4 mr-1.5 text-secondary-plot" />
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

      </div>

      {/* Rent Status Card - Premium Design */}
      <div className="mb-10">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-br from-primary-700 via-secondary-plot to-primary-plot/80">
          {/* Enhanced glass morphism effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

          {/* Decorative elements - more sophisticated */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-plot/20 blur-xl"></div>
          <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-white/5 blur-lg opacity-60"></div>
          <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-white/10 blur-md"></div>
          <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-primary-plot/10 blur-xl opacity-40"></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative px-4 py-5 md:px-10 md:py-10">
            <div className="flex flex-col lg:flex-row justify-between lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
              {/* Left side - Rent info */}
              <div className="space-y-2 md:space-y-4 flex-1">
                <div className="flex items-start  space-x-4 pt-2 md:pt-0">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base md:text-lg lg:text-xl font-bold text-amber-200 tracking-tight">
                      Unit {summary.unit?.unitNumber}
                    </h2>
                    <div className="flex flex-wrap items-center text-white/90 text-xs md:text-sm font-medium">
                        
                      <span className="mx-2 text-white/60">•</span>
                      <div className="flex items-center bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <TbStairs className="mr-1.5 h-4 w-4" />
                        <span>{summary.unit.floor} floor</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 lg:mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-1 h-0.5 bg-white/20 rounded-full"></div>
                    <span className="text-white/60 text-[0.7rem] md:text-xs font-medium uppercase tracking-wider">
                      Rental Payment
                    </span>
                    <div className="flex-1 h-0.5 bg-white/20 rounded-full"></div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-3xl md:text-4xl font-bold text-amber-300 tracking-tight">
                          {formatCurrency(summary.rentAmount)}
                        </span>
                        <span className="ml-2 text-amber-300 text-sm font-medium">
                          /month
                        </span>
                      </div>
                      <p className="text-white/70 text-[0.8rem] md:text-sm mt-1">
                        Due on the 1st of every month
                      </p>
                    </div>

                    <div className="hidden lg:block mt-4 lg:mt-0">
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-[0.8rem] md:text-sm font-medium shadow-lg ${
                          summary.rentStatus === "paid"
                            ? "bg-green-600/40 text-white ring-1 ring-green-400"
                            : "bg-amber-600/40 text-white ring-1 ring-amber-400"
                        }`}
                      >
                        {summary.rentStatus === "paid" ? (
                          <>
                            <TbCheck className="mr-2 h-5 w-5" />
                            <span>Payment Complete</span>
                          </>
                        ) : (
                          <>
                            <TbExclamationCircle className="mr-2 h-5 w-5" />
                            <span>Payment Required</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {summary.rentStatus === "paid" ? (
                    <div className="hidden lg:block  mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center">
                        <TbCalendarEvent className="h-5 w-5 text-white/80 mr-2" />
                        <span className="text-white/90 text-[0.8rem] md:text-sm">
                          Next payment due:{" "}
                        </span>
                        <span className="ml-2 font-semibold text-white text-[0.8rem] md:text-sm">
                          {formatDate(summary.nextPaymentDue)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden lg:block mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center text-white mb-1">
                        <TbAlertTriangle className="h-6 w-6 text-amber-300 mr-2" />
                        <p className="text-[0.8rem] md:text-sm font-medium">
                          Your monthly rent payment is due
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Action */}
              <div className="lg:max-w-xs w-full">
                {summary.rentStatus === "unpaid" ? (
                  <div className="space-y-1.5 md:space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 md:p-5 border border-white/20">
                     <div className="flex lg:hidden items-center text-white px-2 mb-3">
                        <TbAlertTriangle className="h-5 md:h-6 w-5 md:w-6 text-amber-300 mr-2" />
                        <p className="text-[0.8rem] md:text-sm text-amber-100">
                          Your monthly rent payment is due
                        </p>
                      </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3 md:mb-4">
                      <div className="flex justify-between items-center text-[0.8rem]">
                        <span className="text-white/80">Amount due:</span>
                        <span className="font-bold text-amber-200 text-sm">
                          {formatCurrency(summary.rentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[0.8rem] mt-1 md:mt-2">
                        <span className="text-white/80">Due date:</span>
                        <span className="font-medium text-white text-sm">
                          May 1, 2025
                        </span>
                      </div>
                    </div>

                    <Link to="/tenant/payments" className="block">
                      <button className="group relative w-full overflow-hidden bg-gradient-to-r from-white to-gray-100 text-[0.9rem] md:text-[0.95rem] text-secondary-plot px-6 py-3 md:py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                        <span className="relative flex items-center justify-center font-bold">
                          <span>Pay Now -</span>
                          <Mpesaicon
                            width={65}
                            height={20}
                            className="mt-0 md:mt-1 ml-2"
                          />
                        </span>
                      </button>
                    </Link>

                    <p className="text-white/70 font-sans text-xs text-center ">
                      Secure payment processed via M-Pesa
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <TbCheck className="h-5 w-5 text-emerald-300 mr-2" />
                        <span className="text-white font-medium">
                          Payment Complete
                        </span>
                      </div>
                      <div className="bg-green-500/40 text-green-100 text-xs font-medium px-3 py-1 rounded-full">
                        Current
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                          <div className="flex justify-between items-center">
                            <span className="text-white/90 text-sm">
                              Last payment:
                            </span>
                            <span className="font-medium text-white text-sm">
                              {formatDate(
                                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-white/90 text-sm">
                              Amount:
                            </span>
                            <span className="font-medium text-white text-sm">
                              {formatCurrency(summary.rentAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link to="/tenant/payments" className="block w-full">
                        <button className="w-full flex items-center justify-center space-x-2 bg-green-700/70 hover:bg-green-800/80 text-white text-sm font-medium py-2.5 rounded-lg transition-colors duration-200">
                          <span>View Payment History</span>
                          <TbArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview  */}
      <div className="mb-12">
        <div className="md:bg-white md:rounded-2xl md:shadow-lg overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 md:bg-gradient-to-r from-secondary-plot via-primary-plot to-secondary-plot"></div>
          <div className="absolute top-0 right-0 w-24 h-24 md:bg-primary-plot/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 md:bg-secondary-plot/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          {/* Content */}
          <div className="p-3 md:p-6 relative z-10">
            <div className="flex flex-wrap -mx-4">
              {/* Property Info */}
              <div className="w-full lg:w-1/4 px-4 pb-4 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-secondary-plot/20 to-secondary-plot/10 p-3 rounded-xl mr-4 shadow-sm">
                    <TbBuildingSkyscraper className="h-8 w-8 text-secondary-plot" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      Your Property
                    </h3>
                    <div className="flex items-center">
                      <p className="text-xl md:text-2xl font-bold text-secondary-plot">
                        {summary.unit?.unitNumber || "N/A"}
                      </p>
                      <div className="ml-2 px-2 py-0.5 bg-secondary-plot/10 rounded text-[0.7rem] md:text-xs font-medium text-secondary-plot">
                        {summary.unit?.property?.name || "Msima Homes"}
                      </div>
                    </div>
                    <div className="flex items-center mt-1.5 md:mt-2 text-xs text-gray-500">
                      <TbCalendarEvent className="h-4 w-4 mr-1" />
                      <span>
                        Moved in: {formatDate(summary.tenant.moveInDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rent Info */}
              <div className="w-full lg:w-1/4 px-4 pb-4 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-primary-plot/20 to-primary-plot/10 p-3 rounded-xl mr-4 shadow-sm">
                    <TbCoins className="h-8 w-8 text-primary-plot" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      Monthly Rent
                    </h3>
                    <div className="flex items-baseline">
                      <p className="text-xl md:text-2xl font-bold text-primary-plot">
                        {formatCurrency(summary.unit?.rentAmount || 0)}
                      </p>
                      <span className="ml-2 text-xs text-gray-500">
                        due on the 1st
                      </span>
                    </div>
                    <div className="flex items-center mt-1.5 md:mt-2 text-[0.7rem] md:text-xs text-gray-500">
                      <TbBed className="h-5 w-5 mr-1" />
                      <span>{summary.unit.bedrooms} Bedroom Unit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="w-full lg:w-1/4 px-4 pb-4 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-emerald-200/50 to-emerald-100/50 p-3 rounded-xl mr-4 shadow-sm">
                    <TbTools className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-0.5 md:mb-1">
                      Maintenance
                    </h3>
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="flex items-baseline">
                          <p className="text-2xl font-bold text-secondary-plot">
                            {summary.pendingMaintenanceCount}
                          </p>
                          <span className="ml-1 text-xs text-gray-500">
                            pending
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-0.5 md:py-1 rounded-lg text-[0.7rem] md:text-xs font-medium ${
                          summary.pendingMaintenanceCount > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {summary.pendingMaintenanceCount > 0
                          ? "Active"
                          : "None"}
                      </div>
                    </div>
                    <div className="flex items-center mt-1.5 md:mt-2 text-xs text-gray-500">
                      <TbLoader2 className="h-4 w-4 mr-1" />
                      <span>
                        {summary.inProgressMaintenanceCount} in progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lease Info */}
              <div className="w-full lg:w-1/4 px-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-200/50 to-indigo-100/50 p-3 rounded-xl mr-4 shadow-sm">
                    <TbCalendarTime className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      Lease Status
                    </h3>
                    <div className="flex items-center">
                      <p className="text-xl md:text-2xl font-bold text-secondary-plot">
                        {formatDate(summary.tenant?.leaseEndDate || new Date())}
                      </p>
                      <div
                        className={`ml-2 px-2 py-0.5 rounded text-[0.7rem] md:text-xs font-medium ${
                          summary.tenant?.leaseEndDate > new Date()
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {summary.tenant?.leaseEndDate > new Date()
                          ? "Active"
                          : "Expired"}
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-[0.7rem] md:text-xs text-gray-500">
                      <TbRefresh className="h-4 w-4 mr-1" />
                      <span>
                        Renewal:{" "}
                        {summary.tenant?.leaseEndDate > new Date()
                          ? "Available"
                          : "Required"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid  */}
      <div className="mt-10 relative">
        {/* Main Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Maintenance */}
          <div className="flex-1 relative">
            {/* Premium Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base md:text-lg font-bold text-secondary-plot">
                Maintenance Requests
              </h3>
              <Link
                to="/tenant/maintenance"
                className="group flex items-center text-primary-plot hover:text-primary-plot/80 transition-colors duration-200 text-[0.8rem] md:text-sm font-medium bg-primary-plot/5 px-3 py-1 rounded-lg border border-primary-plot/10"
              >
                <span>View All</span>
                <TbChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Stats Overview - Premium Design */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100/50 overflow-hidden group">
                <div className="h-1 bg-amber-400"></div>
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-0.5 md:mb-2">
                    <h4 className="text-[0.7rem] md:text-xs uppercase tracking-wide font-medium text-amber-800/70">
                      Pending Requests
                    </h4>
                    <div className="bg-amber-100 p-1.5 rounded-lg group-hover:bg-amber-200 transition-colors duration-300">
                      <TbExclamationCircle className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-amber-700">
                      {summary.pendingMaintenanceCount}
                    </p>
                    <p className="ml-2 text-sm text-amber-600/70">
                      {summary.pendingMaintenanceCount === 1
                        ? "request"
                        : "requests"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-primary-plot/5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-primary-plot/10 overflow-hidden group">
                <div className="h-1 bg-primary-plot"></div>
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-0.5 md:mb-2">
                    <h4 className="text-[0.7rem] md:text-xs uppercase tracking-wide font-medium text-primary-plot/70">
                      In Progress
                    </h4>
                    <div className="bg-primary-plot/10 p-1.5 rounded-lg group-hover:bg-primary-plot/20 transition-colors duration-300">
                      <TbLoader2 className="h-4 w-4 text-primary-plot" />
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-primary-plot">
                      {summary.inProgressMaintenanceCount}
                    </p>
                    <p className="ml-2 text-sm text-primary-plot/70">
                      {summary.inProgressMaintenanceCount === 1
                        ? "request"
                        : "requests"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button - Premium Design */}
            <Link to="/tenant/maintenance/new" className="block">
              <button className="w-full relative overflow-hidden bg-gradient-to-r from-secondary-plot to-primary-plot text-[0.9rem] md:text-base text-white py-2.5 md:py-3 lg:py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <div className="bg-white/20 rounded-lg p-1.5 mr-3">
                  <TbTools className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <span className="font-medium">Submit New Request</span>
              </button>
            </Link>

            {/* Vertical Divider for larger screens - Enhanced */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
          </div>

          {/* Right Column - Payments */}
          <div className="flex-1">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base md:text-lg font-semibold text-secondary-plot">
                Recent Payments
              </h3>
              <Link
                to="/tenant/payments"
                className="group flex items-center text-primary-plot hover:text-primary-plot/80 transition-colors duration-200 text-[0.8rem] md:text-sm font-medium bg-primary-plot/5 px-3 py-1 rounded-lg border border-primary-plot/10"
              >
                <span>View All</span>
                <TbChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Payment List */}
            {summary.recentPayments && summary.recentPayments.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md px-3 md:px-6 py-4 border border-gray-100">
                <div className="space-y-2.5">
                  {summary.recentPayments.slice(0, 3).map((payment, index) => (
                    <div
                      key={payment.id}
                      className={`flex items-center justify-between py-3 ${
                        index !== 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        {payment.paymentMethod === "card" ? (
                          <TbCreditCard className="h-5 w-5 text-gray-500 mr-3" />
                        ) : (
                          <TbCoins className="h-5 w-5 text-green-600 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(payment.paymentDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            via{" "}
                            {payment.paymentMethod === "card"
                              ? "Credit Card"
                              : "M-Pesa"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-3">
                          <p className="text-sm font-semibold text-secondary-plot">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs border font-medium ${
                            payment.status === "paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : payment.status === "pending"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          {payment.status === "paid"
                            ? "Paid"
                            : payment.status === "pending"
                            ? "Pending"
                            : "Failed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center justify-center">
                <TbCoins className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-gray-600 font-medium mb-1">
                  No recent payments found
                </p>
                <p className="text-gray-500 text-sm mb-4 text-center">
                  When you make payments, they will appear here
                </p>
                <Link to="/tenant/payments">
                  <button className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-secondary-plot to-primary-plot text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <span>Make a Payment</span>
                      <TbArrowRight className="ml-2 " />
                    </div>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer /> 
    </>
  );
};

export default TenantDashboard;
