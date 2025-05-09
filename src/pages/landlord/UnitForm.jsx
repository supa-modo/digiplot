import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUnit, createUnit, updateUnit, getProperties } from '../../services/mock/landlordService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const UnitForm = () => {
  const { unitId, propertyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!unitId;
  
  const [formData, setFormData] = useState({
    propertyId: propertyId ? parseInt(propertyId, 10) : '',
    unitNumber: '',
    floor: '',
    bedrooms: '',
    bathrooms: '',
    rentAmount: '',
    status: 'vacant',
  });
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties for dropdown
        const propertiesData = await getProperties(1); // Mock landlord ID
        setProperties(propertiesData);
        
        if (isEditMode) {
          // Fetch unit data if in edit mode
          const unitData = await getUnit(parseInt(unitId, 10));
          if (unitData) {
            setFormData({
              propertyId: unitData.propertyId,
              unitNumber: unitData.unitNumber,
              floor: unitData.floor,
              bedrooms: unitData.bedrooms.toString(),
              bathrooms: unitData.bathrooms.toString(),
              rentAmount: unitData.rentAmount.toString(),
              status: unitData.status,
            });
          } else {
            setError('Unit not found');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [unitId, propertyId, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.propertyId) {
      errors.propertyId = 'Property is required';
    }
    
    if (!formData.unitNumber) {
      errors.unitNumber = 'Unit number is required';
    }
    
    if (!formData.floor) {
      errors.floor = 'Floor is required';
    }
    
    if (!formData.bedrooms) {
      errors.bedrooms = 'Number of bedrooms is required';
    } else if (isNaN(formData.bedrooms) || parseInt(formData.bedrooms) < 0) {
      errors.bedrooms = 'Bedrooms must be a positive number';
    }
    
    if (!formData.bathrooms) {
      errors.bathrooms = 'Number of bathrooms is required';
    } else if (isNaN(formData.bathrooms) || parseInt(formData.bathrooms) < 0) {
      errors.bathrooms = 'Bathrooms must be a positive number';
    }
    
    if (!formData.rentAmount) {
      errors.rentAmount = 'Rent amount is required';
    } else if (isNaN(formData.rentAmount) || parseFloat(formData.rentAmount) <= 0) {
      errors.rentAmount = 'Rent amount must be a positive number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Format data for API
      const unitData = {
        propertyId: parseInt(formData.propertyId, 10),
        unitNumber: formData.unitNumber,
        floor: formData.floor,
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        rentAmount: parseFloat(formData.rentAmount),
        status: formData.status,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode) {
        // Update existing unit
        const updatedUnit = await updateUnit(parseInt(unitId, 10), unitData);
        if (!updatedUnit) {
          throw new Error('Failed to update unit');
        }
        setSuccess(true);
        
        // Navigate back to units list after a short delay
        setTimeout(() => {
          navigate(`/landlord/properties/${updatedUnit.propertyId}/units`);
        }, 1500);
      } else {
        // Create new unit
        const newUnit = await createUnit(unitData);
        
        setSuccess(true);
        
        // Navigate to the units list after a short delay
        setTimeout(() => {
          navigate(`/landlord/properties/${newUnit.propertyId}/units`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving unit:', error);
      setError(error.message || 'Failed to save unit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[rgb(var(--color-primary))]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Unit' : 'Add New Unit'}
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Unit {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="propertyId" className="label">
              Property <span className="text-red-500">*</span>
            </label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleInputChange}
              className={`input ${validationErrors.propertyId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading || !!propertyId}
              required
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
            {validationErrors.propertyId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.propertyId}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Unit Number"
              type="text"
              id="unitNumber"
              name="unitNumber"
              value={formData.unitNumber}
              onChange={handleInputChange}
              placeholder="e.g., A101"
              required
              disabled={loading}
              error={validationErrors.unitNumber}
            />
            
            <Input
              label="Floor"
              type="text"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              placeholder="e.g., 1"
              required
              disabled={loading}
              error={validationErrors.floor}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Bedrooms"
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              min="0"
              required
              disabled={loading}
              error={validationErrors.bedrooms}
            />
            
            <Input
              label="Bathrooms"
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              required
              disabled={loading}
              error={validationErrors.bathrooms}
            />
          </div>
          
          <Input
            label="Rent Amount (KES)"
            type="number"
            id="rentAmount"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleInputChange}
            min="0"
            required
            disabled={loading}
            error={validationErrors.rentAmount}
          />
          
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input"
              disabled={loading}
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Unit' : 'Create Unit'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UnitForm;
