import React from "react";
import PropTypes from "prop-types";

const TenantCard = ({
  children,
  title,
  subtitle,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  variant = "default",
  elevation = "md",
  action,
  icon,
  noPadding = false,
  borderAccent = false,
  ...props
}) => {
  // Elevation classes
  const elevationClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-white",
    primary: "bg-primary-plot/50",
    secondary: "bg-gray-50",
    success: "bg-emerald-50",
    warning: "bg-amber-50",
    danger: "bg-red-50",
  };

  // Border accent classes
  const borderAccentClasses = borderAccent
    ? {
        default: "border-l-4 border-gray-300",
        primary: "border-l-4 border-primary-plot",
        secondary: "border-l-4 border-gray-400",
        success: "border-l-4 border-emerald-500",
        warning: "border-l-4 border-amber-500",
        danger: "border-l-4 border-red-500",
      }
    : { default: "", primary: "", secondary: "", success: "", warning: "", danger: "" };

  // Padding classes
  const paddingClasses = noPadding ? "" : "p-6";

  // Combine all classes
  const cardClasses = `
     ${elevationClasses[elevation]} ${variantClasses[variant]} ${borderAccentClasses[variant]} 
    overflow-hidden transition-all duration-200 ${className}
  `;

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || action || icon) && (
        <div className={`flex items-center justify-between ${noPadding ? "p-4 pb-0" : "pb-4"} ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`${paddingClasses} ${title || subtitle ? (noPadding ? "pt-4" : "") : ""} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

TenantCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "secondary", "success", "warning", "danger"]),
  elevation: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  action: PropTypes.node,
  icon: PropTypes.node,
  noPadding: PropTypes.bool,
  borderAccent: PropTypes.bool,
};

export default TenantCard;
