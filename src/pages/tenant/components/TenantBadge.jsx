import React from "react";
import PropTypes from "prop-types";

const TenantBadge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  rounded = "full",
  glow = false,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-gray-200 text-gray-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    premium: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
  };

  // Rounded classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Glow effect
  const glowClasses = glow
    ? {
        default: "",
        primary: "shadow-sm shadow-primary-200",
        secondary: "shadow-sm shadow-gray-200",
        success: "shadow-sm shadow-emerald-200",
        warning: "shadow-sm shadow-amber-200",
        danger: "shadow-sm shadow-red-200",
        info: "shadow-sm shadow-blue-200",
        premium: "shadow-sm shadow-purple-300",
      }
    : { default: "", primary: "", secondary: "", success: "", warning: "", danger: "", info: "", premium: "" };

  // Combine all classes
  const badgeClasses = `
    inline-flex items-center justify-center font-medium
    ${sizeClasses[size]} ${variantClasses[variant]} ${roundedClasses[rounded]} ${glowClasses[variant]}
    ${className}
  `;

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

TenantBadge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "primary", "secondary", "success", "warning", "danger", "info", "premium"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "full"]),
  glow: PropTypes.bool,
};

export default TenantBadge;
