import React, { useState } from 'react';
import { TbBell, TbCreditCard, TbTools, TbHome, TbLoader2 } from 'react-icons/tb';

const ProfileNotificationsTab = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    payments: true,
    maintenance: true,
    announcements: true,
    promotions: false
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
  };

  return (
    <div>
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-secondary-plot">Notification Preferences</h2>
      </div>
      
      <div className="p-6">
        <p className="mb-6 text-sm text-gray-500">
          Manage how you receive notifications and updates from the property management system.
        </p>
        
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <TbCreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold text-gray-900">Payment Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications about rent payments, due dates, and receipts</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={notificationSettings.payments}
                  onChange={() => handleToggle('payments')}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-plot peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-plot/20"></div>
              </label>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <TbTools className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold text-gray-900">Maintenance Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about maintenance request status changes</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={notificationSettings.maintenance}
                  onChange={() => handleToggle('maintenance')}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-plot peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-plot/20"></div>
              </label>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <TbHome className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold text-gray-900">Property Announcements</h3>
                  <p className="text-sm text-gray-500">Important updates about your building or community</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={notificationSettings.announcements}
                  onChange={() => handleToggle('announcements')}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-plot peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-plot/20"></div>
              </label>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <TbBell className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold text-gray-900">Promotional Messages</h3>
                  <p className="text-sm text-gray-500">Special offers and promotions from our partners</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={notificationSettings.promotions}
                  onChange={() => handleToggle('promotions')}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-plot peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-plot/20"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-plot rounded-lg hover:bg-primary-plot/90 disabled:opacity-70"
          >
            {saving ? (
              <span className="flex items-center">
                <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotificationsTab;
