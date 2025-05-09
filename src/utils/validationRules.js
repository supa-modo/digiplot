/**
 * Common validation rules for form fields
 */

// Required field validation
export const required = (value, message = 'This field is required') => {
  if (value === undefined || value === null || value === '') {
    return message;
  }
  return '';
};

// Email validation
export const email = (value, message = 'Please enter a valid email address') => {
  if (!value) return '';
  
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return message;
  }
  return '';
};

// Phone number validation
export const phoneNumber = (value, message = 'Please enter a valid phone number') => {
  if (!value) return '';
  
  // Basic phone validation - can be adjusted for specific formats
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(value.replace(/[\s()-]/g, ''))) {
    return message;
  }
  return '';
};

// Min length validation
export const minLength = (min) => (value, message = `Must be at least ${min} characters`) => {
  if (!value) return '';
  
  if (value.length < min) {
    return message;
  }
  return '';
};

// Max length validation
export const maxLength = (max) => (value, message = `Must be no more than ${max} characters`) => {
  if (!value) return '';
  
  if (value.length > max) {
    return message;
  }
  return '';
};

// Number validation
export const number = (value, message = 'Please enter a valid number') => {
  if (!value) return '';
  
  if (isNaN(Number(value))) {
    return message;
  }
  return '';
};

// Min value validation
export const min = (minValue) => (value, message = `Must be at least ${minValue}`) => {
  if (!value) return '';
  
  if (Number(value) < minValue) {
    return message;
  }
  return '';
};

// Max value validation
export const max = (maxValue) => (value, message = `Must be no more than ${maxValue}`) => {
  if (!value) return '';
  
  if (Number(value) > maxValue) {
    return message;
  }
  return '';
};

// Date validation
export const date = (value, message = 'Please enter a valid date') => {
  if (!value) return '';
  
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return message;
  }
  return '';
};

// Date comparison validation (after another date)
export const dateAfter = (otherDate, otherFieldName = 'the previous date') => 
  (value, message = `Date must be after ${otherFieldName}`) => {
    if (!value || !otherDate) return '';
    
    const date1 = new Date(value);
    const date2 = new Date(otherDate);
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return 'Invalid date format';
    }
    
    if (date1 <= date2) {
      return message;
    }
    return '';
  };

// Date comparison validation (before another date)
export const dateBefore = (otherDate, otherFieldName = 'the next date') => 
  (value, message = `Date must be before ${otherFieldName}`) => {
    if (!value || !otherDate) return '';
    
    const date1 = new Date(value);
    const date2 = new Date(otherDate);
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return 'Invalid date format';
    }
    
    if (date1 >= date2) {
      return message;
    }
    return '';
  };

// Matches another field validation
export const matches = (otherValue, otherFieldName = 'the other field') => 
  (value, message = `Must match ${otherFieldName}`) => {
    if (!value) return '';
    
    if (value !== otherValue) {
      return message;
    }
    return '';
  };

// Compose multiple validation rules
export const compose = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return '';
};

// Create a validator function for a form schema
export const createValidator = (schema) => (values) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const fieldValidators = schema[field];
    const value = values[field];
    
    if (Array.isArray(fieldValidators)) {
      // Multiple validators for this field
      for (const validator of fieldValidators) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else if (typeof fieldValidators === 'function') {
      // Single validator for this field
      const error = fieldValidators(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

// Example usage:
// const validateForm = createValidator({
//   name: required,
//   email: compose(required, email),
//   age: compose(required, number, min(18)),
//   password: compose(required, minLength(8)),
//   confirmPassword: compose(
//     required, 
//     matches(values.password, 'password')
//   )
// });
