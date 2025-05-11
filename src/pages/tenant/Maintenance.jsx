import { useState, useEffect } from "react";
import { getTenantMaintenanceRequests } from "../../services/mock/tenantService";
import {
  TbTools,
  TbPlus,
  TbLoader2,
  TbX,
  TbChevronRight,
  TbFilter,
  TbArrowUp,
  TbArrowDown,
  TbSearch,
  TbEye,
  TbMessage,
  TbCalendarTime,
  TbBell,
  TbRefresh,
  TbClipboardCheck,
  TbClipboardList,
  TbClipboardX,
  TbAlertTriangle,
  TbInfoCircle,
  TbAdjustments,
  TbCalendarEvent,
  TbSun,
  TbBuildingSkyscraper,
} from "react-icons/tb";
import { FaTools } from "react-icons/fa";
import { Footer } from "./components/Footer";
import EnhancedMaintenanceRequestModal from "./components/EnhancedMaintenanceRequestModal";
import MaintenanceRequestDetails from "./components/MaintenanceRequestDetails";
import { useAuth } from "../../contexts/AuthContext";

const MaintenancePage = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Set time of day greeting
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    const fetchRequests = async () => {
      try {
        // Using tenant ID 1 for mock data
        const requests = await getTenantMaintenanceRequests(1);
        setMaintenanceRequests(requests);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        setError(
          "Failed to load maintenance requests. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
            Pending
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "low":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Low
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Medium
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
            High
          </span>
        );
      case "emergency":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Emergency
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {priority}
          </span>
        );
    }
  };

  const handleRequestSuccess = (newRequest) => {
    // Add the new request to the list
    setMaintenanceRequests([newRequest, ...maintenanceRequests]);
  };

  const getFilteredRequests = () => {
    let filtered = [...maintenanceRequests];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((request) => request.status === activeTab);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((request) => request.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getRequestStats = () => {
    const total = maintenanceRequests.length;
    const pending = maintenanceRequests.filter(
      (r) => r.status === "pending"
    ).length;
    const inProgress = maintenanceRequests.filter(
      (r) => r.status === "in_progress"
    ).length;
    const completed = maintenanceRequests.filter(
      (r) => r.status === "completed"
    ).length;
    const cancelled = maintenanceRequests.filter(
      (r) => r.status === "cancelled"
    ).length;

    return { total, pending, inProgress, completed, cancelled };
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError("");

    try {
      // Using tenant ID 1 for mock data
      const requests = await getTenantMaintenanceRequests(1);
      setMaintenanceRequests(requests);
    } catch (error) {
      console.error("Error refreshing maintenance requests:", error);
      setError(
        "Failed to refresh maintenance requests. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <TbLoader2 className="mx-auto h-10 w-10 text-primary-plot animate-spin" />
          <p className="mt-4 text-base text-secondary-plot">
            Loading maintenance requests...
          </p>
        </div>
      </div>
    );
  }

  const stats = getRequestStats();
  const filteredRequests = getFilteredRequests();

  return (
    <div className="min-h-screen">
      <div className="pt-6 pb-10 mx-auto max-w-screen-2xl px-2 md:px-4">
        {/* Welcome & Header Section */}
        <div className="mb-6">
          <div className="px-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                  <FaTools className="h-4 w-4 mr-1.5 text-primary-plot" />
                  <span>Maintenance & Repairs</span>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-secondary-plot mb-1">
                Your Maintenance Requests
              </h1>
              <div className="flex items-center text-[0.8rem] md:text-sm font-medium text-gray-600">
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

            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <TbRefresh className="mr-1.5 h-4 w-4" />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setShowRequestModal(true)}
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
                <span className="flex items-center">
                  <TbPlus className="mr-2 h-5 w-5" />
                  New Request
                </span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-4 shadow-sm mb-6 mx-4">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-red-50 blur-xl"></div>
            <div className="relative z-10 flex items-start">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <TbX className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="mt-1 text-xs font-medium text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">
                Total Requests
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <TbClipboardList className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <TbBell className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">
                In Progress
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <TbTools className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.inProgress}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">Completed</div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TbClipboardCheck className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </div>
          </div>

          <div className="bg-white hidden lg:block rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">Cancelled</div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <TbClipboardX className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.cancelled}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 mx-4 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbSearch className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search requests..."
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-primary-plot focus:ring-primary-plot"
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

              <div className="text-sm text-gray-500">
                Showing {filteredRequests.length} of{" "}
                {maintenanceRequests.length} requests
              </div>
            </div>

           
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("all")}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                  activeTab === "all"
                    ? "border-primary-plot text-primary-plot"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                All Requests
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                  activeTab === "pending"
                    ? "border-primary-plot text-primary-plot"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("in_progress")}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                  activeTab === "in_progress"
                    ? "border-primary-plot text-primary-plot"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                  activeTab === "completed"
                    ? "border-primary-plot text-primary-plot"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
                  activeTab === "cancelled"
                    ? "border-primary-plot text-primary-plot"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Cancelled
              </button>
            </nav>
          </div>

          {/* Maintenance Requests List */}
          <div className="divide-y divide-gray-100">
            {filteredRequests.length === 0 ? (
              <div className="py-12">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <TbInfoCircle className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No requests found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "No requests match your search criteria."
                      : "You don't have any maintenance requests in this category."}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="inline-flex items-center rounded-md bg-primary-plot px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-plot/90"
                    >
                      <TbPlus className="-ml-0.5 mr-1.5 h-5 w-5" />
                      New Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(request)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        {getStatusBadge(request.status)}
                        <span className="mx-2 text-gray-300">•</span>
                        {getPriorityBadge(request.priority)}
                      </div>
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {request.title}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <TbCalendarTime className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>
                          Submitted on {formatDate(request.createdAt)}
                        </span>

                        {request.updates && request.updates.length > 0 && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <TbMessage className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>
                              {request.updates.length} update
                              {request.updates.length !== 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 md:mt-0 flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(request);
                        }}
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        View Details
                        <TbChevronRight className="ml-1.5 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        {showRequestModal && (
          <EnhancedMaintenanceRequestModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            onRequestSuccess={handleRequestSuccess}
          />
        )}

        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm">
            <div
              className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-secondary-plot to-primary-plot p-5 text-white">
                <h3 className="text-xl font-bold">
                  Maintenance Request Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="rounded-full bg-white/20 p-1.5 text-white transition-all hover:bg-white/30"
                >
                  <TbX className="h-5 w-5" />
                </button>
              </div>

              <MaintenanceRequestDetails
                request={selectedRequest}
                onClose={() => setShowDetailModal(false)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default MaintenancePage;
