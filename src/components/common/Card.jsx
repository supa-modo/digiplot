const Card = ({ 
  children, 
  title, 
  subtitle,
  action,
  className = '', 
  bodyClassName = '',
  noPadding = false,
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'px-1'} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
