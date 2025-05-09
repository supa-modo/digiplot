import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProperty, createProperty, updateProperty } from '../../services/mock/landlordService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const PropertyForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!propertyId;
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!isEditMode) return;
      
      try {
        const property = await getProperty(parseInt(propertyId, 10));
        if (property) {
          setFormData({
            name: property.name,
            location: property.location,
            description: property.description || '',
          });
        } else {
          setError('Property not found');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Failed to load property data. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate form data
      if (!formData.name || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode) {
        // Update existing property
        const updatedProperty = await updateProperty(parseInt(propertyId, 10), formData);
        if (!updatedProperty) {
          throw new Error('Failed to update property');
        }
        setSuccess(true);
        
        // Navigate back to properties list after a short delay
        setTimeout(() => {
          navigate('/landlord/properties');
        }, 1500);
      } else {
        // Create new property
        const newProperty = await createProperty({
          ...formData,
          landlordId: 1, // Mock landlord ID
        });
        
        setSuccess(true);
        
        // Navigate to the new property page after a short delay
        setTimeout(() => {
          navigate(`/landlord/properties/${newProperty.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setError(error.message || 'Failed to save property. Please try again later.');
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
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/landlord/properties')}
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
                Property {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Property Name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Sunshine Apartments"
            required
            disabled={loading}
          />
          
          <Input
            label="Location"
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Nairobi, Kenya"
            required
            disabled={loading}
          />
          
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="input"
              placeholder="Describe the property..."
              disabled={loading}
            ></textarea>
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
                isEditMode ? 'Update Property' : 'Create Property'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PropertyForm;
