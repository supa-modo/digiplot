import React from "react";
import PropTypes from "prop-types";

const TenantButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  icon = null,
  iconPosition = "left",
  ...props
}) => {
  // Base classes
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none ";
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs ",
    md: "px-4 py-2 text-sm ",
    lg: "px-6 py-3 text-base ",
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-plot to-primary-plot/80 text-white hover:from-primary-plot/90 hover:to-primary-plot/80 shadow-md hover:shadow-lg disabled:from-primary-plot/30 disabled:to-primary-plot/20",
    secondary: "bg-white text-primary-plot border border-primary-plot hover:bg-primary-plot/60 shadow-sm hover:shadow disabled:text-primary-plot/30 disabled:border-primary-plot/40 disabled:bg-white",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 disabled:text-gray-300 disabled:border-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-300",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-md hover:shadow-lg disabled:from-red-400 disabled:to-red-300",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 focus:ring-emerald-500 shadow-md hover:shadow-lg disabled:from-emerald-400 disabled:to-emerald-300",
  };
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Disabled classes
  const disabledClasses = disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer";
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      
      {/* Animated hover effect for primary buttons */}
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-lg overflow-hidden">
          <span className="absolute inset-0 rounded-lg opacity-0 hover:opacity-20 bg-white transition-opacity duration-300"></span>
        </span>
      )}
    </button>
  );
};

TenantButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "danger", "success"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
};

export default TenantButton;
