import { useState, useEffect } from 'react';
import { TbTools, TbLoader2, TbCheck, TbX, TbUpload, TbAlertTriangle, TbPhoto, TbTrash } from 'react-icons/tb';
import { createMaintenanceRequest } from '../../../services/mock/tenantService';

const EnhancedMaintenanceRequestModal = ({ isOpen, onClose, onRequestSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    priority: 'medium',
    category: 'plumbing' // Added category field
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Categories for maintenance requests
  const categories = [
    { id: 'plumbing', label: 'Plumbing', icon: '🚿' },
    { id: 'electrical', label: 'Electrical', icon: '💡' },
    { id: 'appliance', label: 'Appliance', icon: '🔌' },
    { id: 'structural', label: 'Structural', icon: '🏠' },
    { id: 'hvac', label: 'HVAC', icon: '❄️' },
    { id: 'other', label: 'Other', icon: '🔧' }
  ];

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setSubmitSuccess(false);
      setError('');
      setSubmitting(false);
      setCurrentStep(1);
      setValidationErrors({});
      setFormData({
        title: '',
        description: '',
        images: [],
        priority: 'medium',
        category: 'plumbing'
      });
      setImagePreview([]);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Generate preview URLs for the selected images
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImagePreview(prev => [...prev, ...previews]);
    
    // In a real app, you would handle file uploads here
    // For this demo, we'll just store the file names
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map(file => file.name)]
    }));
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) {
        errors.title = 'Please enter a title for your request';
      }
      if (!formData.category) {
        errors.category = 'Please select a category';
      }
    } else if (step === 2) {
      if (!formData.description.trim()) {
        errors.description = 'Please provide a description of the issue';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      // Create a new maintenance request
      const newRequest = {
        tenantId: 1, // Mock tenant ID
        unitId: 1, // Mock unit ID
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        // In a real app, you would upload images and get URLs back
        images: formData.images
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await createMaintenanceRequest(newRequest);
      
      setSubmitSuccess(true);
      
      // Notify parent component of success
      onRequestSuccess(result);
      
      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        setSubmitting(false);
        setFormData({
          title: '',
          description: '',
          images: [],
          priority: 'medium',
          category: 'plumbing'
        });
        setImagePreview([]);
      }, 2000);
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      setError('Failed to submit maintenance request. Please try again.');
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium 
                ${currentStep === step 
                  ? 'bg-gradient-to-r from-secondary-plot to-primary-plot text-white' 
                  : currentStep > step 
                    ? 'bg-green-100 text-green-600 border border-green-200' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
            >
              {currentStep > step ? <TbCheck className="h-4 w-4" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-10 h-0.5 ${currentStep > step ? 'bg-primary-plot' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} p-2.5 text-gray-900 focus:border-primary-plot focus:ring-primary-plot`}
                placeholder="e.g., Leaking Faucet, Broken Window"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                      ${formData.category === category.id 
                        ? 'border-primary-plot bg-primary-plot/5 shadow-sm' 
                        : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span className="text-2xl mb-1">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{category.label}</span>
                  </div>
                ))}
              </div>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="priority" className="mb-2 block text-sm font-medium text-gray-700">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-plot focus:ring-primary-plot"
              >
                <option value="low">Low - Not urgent</option>
                <option value="medium">Medium - Needs attention soon</option>
                <option value="high">High - Urgent issue</option>
                <option value="emergency">Emergency - Immediate attention required</option>
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className={`block w-full rounded-lg border ${validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} p-2.5 text-gray-900 focus:border-primary-plot focus:ring-primary-plot`}
                placeholder="Please provide details about the issue. When did it start? Is it getting worse? Any other relevant information..."
              ></textarea>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload Images (Optional)
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8">
                <div className="text-center">
                  <TbPhoto className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-plot focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-plot focus-within:ring-offset-2 hover:text-primary-plot/80"
                    >
                      <span className="">Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
            </div>
            
            {imagePreview.length > 0 && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Selected Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative group w-20 h-20">
                      <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TbPhoto className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                          {image.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TbTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Request Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Title</p>
                    <p className="text-sm text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-sm text-gray-900">
                      {categories.find(c => c.id === formData.category)?.label || formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Priority</p>
                    <p className="text-sm text-gray-900">
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Images</p>
                    <p className="text-sm text-gray-900">{formData.images.length} attached</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm text-gray-900 line-clamp-3">{formData.description}</p>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-[2px]">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal header */}
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-secondary-plot to-primary-plot p-5 text-white">
          <h3 className="text-xl font-bold">New Maintenance Request</h3>
          <button 
            onClick={onClose}
            disabled={submitting}
            className="rounded-full bg-white/20 p-1.5 text-white transition-all hover:bg-white/30"
          >
            <TbX className="h-5 w-5" />
          </button>
        </div>
        
        {/* Modal body */}
        <div className="relative z-10 p-6">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <TbCheck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Request Submitted!</h3>
              <p className="mt-2 text-center text-gray-600">
                Your maintenance request has been submitted successfully. We'll get back to you soon.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-5 py-3 text-center text-white shadow-md transition-all hover:shadow-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
                  <div className="flex">
                    <TbAlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="ml-2">{error}</span>
                  </div>
                </div>
              )}
              
              {renderStepIndicator()}
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={submitting}
                    className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div> // Empty div to maintain spacing
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-secondary-plot/90 hover:to-primary-plot/90"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-secondary-plot/90 hover:to-primary-plot/90"
                  >
                    {submitting ? (
                      <>
                        <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMaintenanceRequestModal;
