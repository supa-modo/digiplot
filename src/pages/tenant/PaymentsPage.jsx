import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTenantPayments,
  getTenantUnit,
} from "../../services/mock/tenantService";
import {
  TbLoader2,
  TbPlus,
  TbX,
  TbCreditCard,
  TbCoins,
  TbPaywall,
  TbChevronRight,
} from "react-icons/tb";
import { Footer } from "./components/Footer";
import PaymentModal from "./components/PaymentModal";
import PaymentSummaryCards from "./components/PaymentSummaryCards";
import PaymentHistory from "./components/PaymentHistory";
import MpesaIcon from "../../components/common/MpesaIcon";


const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [stats, setStats] = useState({
    totalPaid: 0,
    lastPayment: null,
    nextDueDate: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using tenant ID 1 for mock data
        const paymentsData = await getTenantPayments(1);
        const unitData = await getTenantUnit(1);

        setPayments(paymentsData);
        setUnit(unitData);

        // Calculate stats
        const totalPaid = paymentsData
          .filter((p) => p.status === "paid")
          .reduce((sum, payment) => sum + payment.amount, 0);

        const lastPayment =
          paymentsData.length > 0
            ? paymentsData.sort(
                (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
              )[0]
            : null;

        // Mock next due date (5th of next month)
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        nextDueDate.setDate(5);

        setStats({
          totalPaid,
          lastPayment,
          nextDueDate,
        });
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setError("Failed to load payment data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const pageStyles = {
    wrapper: "flex flex-col min-h-screen",
    content: "flex-grow",
  };

  const handlePaymentSuccess = (newPayment) => {
    // Update the payments list with the new payment
    setPayments([newPayment, ...payments]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalPaid: prev.totalPaid + newPayment.amount,
      lastPayment: newPayment,
    }));
  };

  const getFilteredPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.reference?.toLowerCase().includes(query) ||
          payment.description?.toLowerCase().includes(query) ||
          payment.paymentMethod?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((payment) => payment.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate);
      const dateB = new Date(b.paymentDate);
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className={pageStyles.wrapper}>
        <div
          className={`${pageStyles.content} flex items-center justify-center`}
        >
          <div className="text-center py-20">
            <TbLoader2 className="mx-auto h-10 w-10 text-primary-plot animate-spin" />
            <p className="mt-4 text-[0.8rem] md:text-sm text-secondary-plot">
              Loading payment data...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${pageStyles.wrapper} `}>
      <div
        className={`${pageStyles.content} pt-6 pb-10 md:px-4`}
      >
        {/* Page Header Section */}
        <div className="mb-6">
          <div className="px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                  <TbCoins className="h-4 w-4 mr-1.5 text-primary-plot" />
                  <span>Payments & Receipts</span>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
                Payment Management
              </h1>
              <p className="text-[0.8rem] md:text-sm text-gray-600 mt-1">
                Manage and track all your rental payments in one place
              </p>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-white shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center md:self-start"
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
              <span className="flex items-center">
                <TbPlus size={19} className="mr-2  text-white" />
                <span className="mr-2 text-sm md:text-base font-medium">New Rent Payment</span>

                <TbChevronRight size={19} className="mr-1 text-white" />
                <MpesaIcon
                  width={60}
                  height={20}
                  variant="white"
                  className="mt-0.5"
                />
              </span>
            </button>
          </div>
        </div>

        {!error && (
          <div className="relative overflow-hidden rounded-lg border border-red-100 bg-gradient-to-r from-red-100 to-white px-4 py-3 shadow-sm mb-6 mx-4">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-red-100 blur-xl"></div>
            <div className="relative z-10 flex items-start">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-200">
                <TbX className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}Sample error message for demo & testing</p>
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

        {/* Payment Summary Cards */}
        <PaymentSummaryCards unit={unit} stats={stats} />

        {/* Payment History */}
        <PaymentHistory
          payments={getFilteredPayments()}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedPayment={setSelectedPayment}
        />

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            unit={unit}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PaymentsPage;
