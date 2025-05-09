import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTenant, createTenant, updateTenant, getUnits } from '../../services/mock/landlordService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const TenantForm = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!tenantId;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    unitId: '',
    moveInDate: '',
    moveOutDate: '',
    leaseStartDate: '',
    leaseEndDate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vacant units for dropdown
        const unitsData = await getUnits(null);
        // Filter for vacant units or the current tenant's unit
        const availableUnits = unitsData.filter(unit => 
          unit.status === 'vacant' || 
          (isEditMode && unit.tenantId === parseInt(tenantId, 10))
        );
        setUnits(availableUnits);
        
        if (isEditMode) {
          // Fetch tenant data if in edit mode
          const tenantData = await getTenant(parseInt(tenantId, 10));
          if (tenantData) {
            // Format dates for form inputs
            const formatDate = (dateString) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              return date.toISOString().split('T')[0];
            };
            
            setFormData({
              name: tenantData.name || '',
              email: tenantData.email || '',
              phoneNumber: tenantData.phoneNumber || '',
              unitId: tenantData.unitId || '',
              moveInDate: formatDate(tenantData.moveInDate),
              moveOutDate: formatDate(tenantData.moveOutDate),
              leaseStartDate: formatDate(tenantData.leaseStartDate),
              leaseEndDate: formatDate(tenantData.leaseEndDate),
              emergencyContactName: tenantData.emergencyContactName || '',
              emergencyContactPhone: tenantData.emergencyContactPhone || '',
            });
          } else {
            setError('Tenant not found');
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
  }, [tenantId, isEditMode]);

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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.unitId) {
      errors.unitId = 'Unit is required';
    }
    
    if (!formData.moveInDate) {
      errors.moveInDate = 'Move-in date is required';
    }
    
    if (!formData.leaseStartDate) {
      errors.leaseStartDate = 'Lease start date is required';
    }
    
    if (!formData.leaseEndDate) {
      errors.leaseEndDate = 'Lease end date is required';
    }
    
    // Check if lease end date is after lease start date
    if (formData.leaseStartDate && formData.leaseEndDate) {
      const startDate = new Date(formData.leaseStartDate);
      const endDate = new Date(formData.leaseEndDate);
      
      if (endDate < startDate) {
        errors.leaseEndDate = 'Lease end date must be after lease start date';
      }
    }
    
    // Check if move-out date is after move-in date
    if (formData.moveInDate && formData.moveOutDate) {
      const moveInDate = new Date(formData.moveInDate);
      const moveOutDate = new Date(formData.moveOutDate);
      
      if (moveOutDate < moveInDate) {
        errors.moveOutDate = 'Move-out date must be after move-in date';
      }
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
      const tenantData = {
        ...formData,
        unitId: parseInt(formData.unitId, 10),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode) {
        // Update existing tenant
        const updatedTenant = await updateTenant(parseInt(tenantId, 10), tenantData);
        if (!updatedTenant) {
          throw new Error('Failed to update tenant');
        }
        setSuccess(true);
        
        // Navigate back to tenants list after a short delay
        setTimeout(() => {
          navigate('/landlord/tenants');
        }, 1500);
      } else {
        // Create new tenant
        const newTenant = await createTenant(tenantData);
        
        setSuccess(true);
        
        // Navigate to the tenants list after a short delay
        setTimeout(() => {
          navigate('/landlord/tenants');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving tenant:', error);
      setError(error.message || 'Failed to save tenant. Please try again later.');
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
          {isEditMode ? 'Edit Tenant' : 'Add New Tenant'}
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
                Tenant {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Full Name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              disabled={loading}
              error={validationErrors.name}
            />
            
            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              required
              disabled={loading}
              error={validationErrors.email}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Phone Number"
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+254 700 000000"
              required
              disabled={loading}
              error={validationErrors.phoneNumber}
            />
            
            <div>
              <label htmlFor="unitId" className="label">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                id="unitId"
                name="unitId"
                value={formData.unitId}
                onChange={handleInputChange}
                className={`input ${validationErrors.unitId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                disabled={loading}
                required
              >
                <option value="">Select a unit</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unitNumber} ({unit.bedrooms} bed, {unit.bathrooms} bath)
                  </option>
                ))}
              </select>
              {validationErrors.unitId && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.unitId}</p>
              )}
              {units.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  No vacant units available. Please add a unit or mark an existing unit as vacant first.
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Move-in Date"
              type="date"
              id="moveInDate"
              name="moveInDate"
              value={formData.moveInDate}
              onChange={handleInputChange}
              required
              disabled={loading}
              error={validationErrors.moveInDate}
            />
            
            <Input
              label="Move-out Date (if applicable)"
              type="date"
              id="moveOutDate"
              name="moveOutDate"
              value={formData.moveOutDate}
              onChange={handleInputChange}
              disabled={loading}
              error={validationErrors.moveOutDate}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Lease Start Date"
              type="date"
              id="leaseStartDate"
              name="leaseStartDate"
              value={formData.leaseStartDate}
              onChange={handleInputChange}
              required
              disabled={loading}
              error={validationErrors.leaseStartDate}
            />
            
            <Input
              label="Lease End Date"
              type="date"
              id="leaseEndDate"
              name="leaseEndDate"
              value={formData.leaseEndDate}
              onChange={handleInputChange}
              required
              disabled={loading}
              error={validationErrors.leaseEndDate}
            />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Emergency Contact Name"
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              placeholder="Jane Doe"
              disabled={loading}
            />
            
            <Input
              label="Emergency Contact Phone"
              type="tel"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              placeholder="+254 700 000000"
              disabled={loading}
            />
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
                isEditMode ? 'Update Tenant' : 'Create Tenant'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TenantForm;
