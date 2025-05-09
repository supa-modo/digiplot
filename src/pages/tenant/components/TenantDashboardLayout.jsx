import React from "react";
import PropTypes from "prop-types";

const TenantDashboardLayout = ({
  children,
  className = "",
  contentClassName = "",
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={`tenant-dashboard-layout ${className}`} {...props}>
      <div className={`mx-auto ${fullWidth ? "w-full" : "max-w-screen-2xl px-4 sm:px-6 lg:px-8"} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

TenantDashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default TenantDashboardLayout;
