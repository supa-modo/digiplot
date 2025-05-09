import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="ml-1 text-[rgb(var(--color-danger))]">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'border-[rgb(var(--color-danger))] focus:border-[rgb(var(--color-danger))] focus:ring-[rgb(var(--color-danger))]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[rgb(var(--color-danger))]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
