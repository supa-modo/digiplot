import React from 'react';
import { TbUser, TbMail, TbPhone, TbLoader2 } from 'react-icons/tb';

const ProfilePersonalTab = ({ profile, isEditing, formData, handleInputChange, saving, setIsEditing, handleSubmit, formatDate }) => {
  return (
    <div>
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-secondary-plot">Personal Information</h2>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-plot focus:border-primary-plot block w-full pl-10 p-2.5"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbMail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-plot focus:border-primary-plot block w-full pl-10 p-2.5"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbPhone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-plot focus:border-primary-plot block w-full pl-10 p-2.5"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-plot rounded-lg hover:bg-primary-plot/90 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center">
                    <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{profile.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{profile.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{formatDate(profile.memberSince)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePersonalTab;
