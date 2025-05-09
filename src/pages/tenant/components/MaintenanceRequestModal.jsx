import { useState, useEffect } from 'react';
import { TbTools, TbLoader2, TbCheck, TbX, TbUpload, TbAlertTriangle, TbPhoto } from 'react-icons/tb';
import { createMaintenanceRequest } from '../../../services/mock/tenantService';

const MaintenanceRequestModal = ({ isOpen, onClose, onRequestSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setSubmitSuccess(false);
      setError('');
      setSubmitting(false);
      setFormData({
        title: '',
        description: '',
        images: [],
        priority: 'medium'
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
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Generate preview URLs for the selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
    
    // In a real app, you would handle file uploads here
    // For this demo, we'll just store the file names
    setFormData((prev) => ({
      ...prev,
      images: files.map(file => file.name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a title for your request');
      setSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a description of the issue');
      setSubmitting(false);
      return;
    }

    try {
      // Create a new maintenance request
      const newRequest = {
        tenantId: 1, // Mock tenant ID
        unitId: 1, // Mock unit ID
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
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
          priority: 'medium'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-plot/10 blur-xl opacity-70"></div>
        
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
              
              <div className="mb-6">
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                  Issue Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-plot focus:ring-primary-plot"
                  placeholder="e.g., Leaking Faucet, Broken Window"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="priority" className="mb-2 block text-sm font-medium text-gray-700">
                  Priority
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
              
              <div className="mb-6">
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-plot focus:ring-primary-plot"
                  placeholder="Please describe the issue in detail..."
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload Images (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 border-gray-300 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <TbUpload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input 
                      id="images" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                
                {imagePreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {imagePreview.map((src, index) => (
                      <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                        <img 
                          src={src} 
                          alt={`Preview ${index}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
                <div className="flex">
                  <TbTools className="h-5 w-5 text-blue-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">Maintenance Request Tips</p>
                    <p className="text-xs">Provide as much detail as possible to help us resolve your issue quickly.</p>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-5 py-3 text-center text-white shadow-md transition-all hover:shadow-lg disabled:opacity-70"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <TbLoader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <TbTools className="mr-2 h-5 w-5" />
                    Submit Request
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestModal;
