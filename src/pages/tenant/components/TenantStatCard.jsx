import React from "react";
import PropTypes from "prop-types";

const TenantStatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  variant = "default",
  className = "",
  onClick,
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: "bg-white",
    primary: "bg-gradient-to-br from-primary-plot to-primary-plot text-white",
    secondary: "bg-gradient-to-br from-gray-700 to-gray-800 text-white",
    success: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    warning: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
    danger: "bg-gradient-to-br from-red-500 to-red-600 text-white",
    info: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
  };

  // Trend classes
  const trendClasses = {
    up: "text-emerald-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };

  // Trend icon
  const trendIcons = {
    up: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  // Text color based on variant
  const textColorClasses = ["primary", "secondary", "success", "warning", "danger", "info", "purple"].includes(variant)
    ? "text-white"
    : "text-gray-900";

  // Subtitle color based on variant
  const subtitleColorClasses = ["primary", "secondary", "success", "warning", "danger", "info", "purple"].includes(variant)
    ? "text-white/80"
    : "text-gray-500";

  // Combine all classes
  const cardClasses = `
    relative overflow-hidden rounded-xl p-6 shadow-md transition-all duration-200 hover:shadow-lg
    ${variantClasses[variant]} ${className} ${onClick ? "cursor-pointer" : ""}
  `;

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {/* Background decoration */}
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/5 blur-xl"></div>

      <div className="relative flex items-start justify-between">
        <div>
          <h3 className={`text-sm font-medium ${subtitleColorClasses}`}>{title}</h3>
          <p className={`mt-2 text-3xl font-bold ${textColorClasses}`}>{value}</p>
          
          {trend && trendValue && (
            <div className={`mt-2 flex items-center ${trendClasses[trend]}`}>
              {trendIcons[trend]}
              <span className="ml-1 text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`rounded-lg p-2 ${["primary", "secondary", "success", "warning", "danger", "info", "purple"].includes(variant) ? "bg-white/20" : "bg-primary-100"}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

TenantStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  icon: PropTypes.node,
  trend: PropTypes.oneOf(["up", "down", "neutral"]),
  trendValue: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "secondary", "success", "warning", "danger", "info", "purple"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default TenantStatCard;
