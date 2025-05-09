import { useState, useEffect } from 'react';
import { getTenantProfile, getTenantUnit } from '../../services/mock/tenantService';
import Badge from '../../components/common/Badge';
import { TbUser, TbHome, TbBell, TbShieldLock, TbLoader2, TbEdit, TbCheck, TbX, TbChevronRight, TbUserCircle, TbLogout, TbCamera } from 'react-icons/tb';
import { Footer } from './components/Footer';
import ProfilePersonalTab from './components/ProfilePersonalTab';
import ProfileResidenceTab from './components/ProfileResidenceTab';
import ProfileSecurityTab from './components/ProfileSecurityTab';
import ProfileNotificationsTab from './components/ProfileNotificationsTab';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Using tenant ID 1 for mock data
        const profileData = await getTenantProfile(1);
        const unitData = await getTenantUnit(1);
        
        setProfile(profileData);
        setUnit(unitData);
        
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phoneNumber: profileData.phoneNumber || '',
          password: '',
          confirmPassword: '',
          avatar: profileData.avatar || null
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    // In a real app, you would handle file uploads here
    // For this demo, we'll just store the file name
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate password match if changing password
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSaving(false);
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the updated profile to the server
      // For this demo, we'll just update the local state
      setProfile({
        ...profile,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar
      });
      
      setSaveSuccess(true);
      
      // Reset form and close edit mode after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
        setSaving(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <TbLoader2 className="mx-auto h-10 w-10 text-primary-plot animate-spin" />
          <p className="mt-4 text-base text-secondary-plot">
            Loading profile data...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">No profile data available</h2>
        <p className="mt-2 text-gray-600">Unable to load profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-10 mx-auto max-w-screen-2xl px-2 md:px-4">
      {/* Welcome & Header Section */}
      <div className="mb-6">
        <div className="px-4 flex items-baseline justify-between mb-2">
          <div>
            <div className="flex items-center mb-1">
              <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                <TbUser className="h-4 w-4 mr-1.5 text-primary-plot" />
                <span>Account Settings</span>
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
              My Profile
            </h1>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-secondary-plot to-primary-plot px-4 py-2 text-white shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 hover:opacity-20 transition-opacity"></span>
              <span className="flex items-center">
                <TbEdit className="mr-2 h-5 w-5" />
                Edit Profile
              </span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-4 shadow-sm mb-6">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-red-50 blur-xl"></div>
          <div className="relative z-10 flex items-start">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <TbX className="h-4 w-4 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button 
                onClick={() => setError('')}
                className="mt-1 text-xs font-medium text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="relative overflow-hidden rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-4 shadow-sm mb-6">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-green-50 blur-xl"></div>
          <div className="relative z-10 flex items-start">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <TbCheck className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Profile updated successfully!</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 mb-6">
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary-plot/5 blur-xl"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                      {formData.avatar ? (
                        <img 
                          src={formData.avatar} 
                          alt={profile.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary-plot/10">
                          <TbUserCircle className="h-12 w-12 text-secondary-plot" />
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-plot text-white shadow-md hover:bg-primary-plot/90">
                        <TbCamera className="h-4 w-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  
                  <div className="mt-2 flex items-center">
                    <Badge variant="success">Active Tenant</Badge>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                      activeTab === 'personal'
                        ? 'bg-primary-plot/10 text-primary-plot'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <TbUser className="mr-3 h-5 w-5" />
                      Personal Info
                    </span>
                    {activeTab === 'personal' && <TbChevronRight className="h-5 w-5" />}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('residence')}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                      activeTab === 'residence'
                        ? 'bg-primary-plot/10 text-primary-plot'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <TbHome className="mr-3 h-5 w-5" />
                      Residence Info
                    </span>
                    {activeTab === 'residence' && <TbChevronRight className="h-5 w-5" />}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                      activeTab === 'security'
                        ? 'bg-primary-plot/10 text-primary-plot'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <TbShieldLock className="mr-3 h-5 w-5" />
                      Security
                    </span>
                    {activeTab === 'security' && <TbChevronRight className="h-5 w-5" />}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                      activeTab === 'notifications'
                        ? 'bg-primary-plot/10 text-primary-plot'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <TbBell className="mr-3 h-5 w-5" />
                      Notifications
                    </span>
                    {activeTab === 'notifications' && <TbChevronRight className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors">
                    <span className="flex items-center">
                      <TbLogout className="mr-3 h-5 w-5" />
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-secondary-plot/5 blur-xl"></div>
            
            <div className="relative z-10">
              {/* Tab Content */}
              {activeTab === 'personal' && (
                <ProfilePersonalTab 
                  profile={profile}
                  isEditing={isEditing}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  saving={saving}
                  setIsEditing={setIsEditing}
                  handleSubmit={handleSubmit}
                  formatDate={formatDate}
                />
              )}
              
              {activeTab === 'residence' && (
                <ProfileResidenceTab 
                  unit={unit}
                  formatDate={formatDate}
                />
              )}
              
              {activeTab === 'security' && (
                <ProfileSecurityTab 
                  isEditing={isEditing}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  saving={saving}
                  setIsEditing={setIsEditing}
                  handleSubmit={handleSubmit}
                />
              )}
              
              {activeTab === 'notifications' && (
                <ProfileNotificationsTab />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
