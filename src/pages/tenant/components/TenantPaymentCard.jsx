import React from "react";
import PropTypes from "prop-types";
import TenantBadge from "./TenantBadge";

const TenantPaymentCard = ({
  amount,
  date,
  status,
  method,
  description,
  className = "",
  onClick,
  ...props
}) => {
  // Status configuration
  const statusConfig = {
    paid: { variant: "success", label: "Paid" },
    pending: { variant: "warning", label: "Pending" },
    failed: { variant: "danger", label: "Failed" },
    processing: { variant: "info", label: "Processing" },
  };

  // Payment method icons
  const methodIcons = {
    card: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    bank: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
        />
      </svg>
    ),
    cash: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    other: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  // Card classes
  const cardClasses = `
    flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm
    transition-all duration-200 hover:shadow-md ${onClick ? "cursor-pointer" : ""} ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      <div className="flex items-center">
        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          {methodIcons[method] || methodIcons.other}
        </div>
        <div>
          <p className="font-medium text-gray-900">{date}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">{amount}</p>
        <TenantBadge variant={statusConfig[status]?.variant || "default"} size="sm" className="mt-1">
          {statusConfig[status]?.label || status}
        </TenantBadge>
      </div>
    </div>
  );
};

TenantPaymentCard.propTypes = {
  amount: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default TenantPaymentCard;
