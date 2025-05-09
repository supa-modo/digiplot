import React from 'react';
import { TbLock, TbLoader2, TbShieldLock, TbKey } from 'react-icons/tb';

const ProfileSecurityTab = ({ isEditing, formData, handleInputChange, saving, setIsEditing, handleSubmit }) => {
  return (
    <div>
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-secondary-plot">Security Settings</h2>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-6">
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-plot focus:border-primary-plot block w-full pl-10 p-2.5"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <TbLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-plot focus:border-primary-plot block w-full pl-10 p-2.5"
                    placeholder="Confirm new password"
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
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <TbLock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  Change
                </button>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <TbShieldLock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <button className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100">
                  Enable
                </button>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <TbKey className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-gray-900">Login Sessions</h3>
                    <p className="text-sm text-gray-500">Manage your active sessions</p>
                  </div>
                </div>
                <button className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100">
                  Manage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSecurityTab;
