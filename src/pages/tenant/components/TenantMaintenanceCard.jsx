import React from "react";
import PropTypes from "prop-types";
import TenantBadge from "./TenantBadge";
import TenantButton from "./TenantButton";

const TenantMaintenanceCard = ({
  title,
  description,
  status,
  priority,
  date,
  category,
  className = "",
  onClick,
  onViewDetails,
  ...props
}) => {
  // Status configuration
  const statusConfig = {
    pending: { variant: "warning", label: "Pending" },
    inProgress: { variant: "info", label: "In Progress" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "danger", label: "Cancelled" },
  };

  // Priority configuration
  const priorityConfig = {
    low: { variant: "default", label: "Low" },
    medium: { variant: "warning", label: "Medium" },
    high: { variant: "danger", label: "High" },
    emergency: { variant: "danger", glow: true, label: "Emergency" },
  };

  // Category icons
  const categoryIcons = {
    plumbing: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    electrical: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    hvac: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    appliance: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    structural: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    other: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  };

  // Card classes
  const cardClasses = `
    rounded-xl border border-gray-200 bg-white p-5 shadow-sm
    transition-all duration-200 hover:shadow-md ${onClick ? "cursor-pointer" : ""} ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            {categoryIcons[category] || categoryIcons.other}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <TenantBadge variant={statusConfig[status]?.variant || "default"} size="sm">
                {statusConfig[status]?.label || status}
              </TenantBadge>
              <TenantBadge 
                variant={priorityConfig[priority]?.variant || "default"} 
                size="sm"
                glow={priorityConfig[priority]?.glow}
              >
                {priorityConfig[priority]?.label || priority}
              </TenantBadge>
              <span className="text-xs text-gray-500">{date}</span>
            </div>
            {description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
        {onViewDetails && (
          <TenantButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            Details
          </TenantButton>
        )}
      </div>
    </div>
  );
};

TenantMaintenanceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onViewDetails: PropTypes.func,
};

export default TenantMaintenanceCard;
