import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { TbUser, TbHome, TbLock, TbMail, TbLoader2 } from 'react-icons/tb';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'tenant' // Default to tenant login
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }
      
      // Mock authentication - in a real app, this would call an API
      // For demo, we'll use hardcoded credentials
      if (formData.userType === 'tenant') {
        if (formData.email === 'tenant@example.com' && formData.password === 'password') {
          // Mock tenant user data
          const userData = {
            id: 1,
            name: 'Alice Johnson',
            email: 'tenant@example.com',
            phoneNumber: '+254723456789'
          };
          
          login(userData, 'tenant');
          navigate('/tenant');
        } else {
          throw new Error('Invalid tenant credentials');
        }
      } else if (formData.userType === 'landlord') {
        if (formData.email === 'landlord@example.com' && formData.password === 'password') {
          // Mock landlord user data
          const userData = {
            id: 1,
            name: 'John Doe',
            email: 'landlord@example.com',
            phoneNumber: '+254712345678'
          };
          
          login(userData, 'landlord');
          navigate('/landlord');
        } else {
          throw new Error('Invalid landlord credentials');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-secondary-plot to-primary-plot relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-plot/20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-white/10 blur-md"></div>
        <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-primary-plot/10 blur-xl opacity-40"></div>
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">DigiPlot</h1>
            <p className="text-xl text-white/80 mb-8">Property Management System</p>
            
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <TbHome className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">Streamlined Management</h3>
                  <p className="text-white/70 text-sm">Manage your properties with ease</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <TbUser className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">Tenant Portal</h3>
                  <p className="text-white/70 text-sm">Easy access for your tenants</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <TbLock className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">Secure Access</h3>
                  <p className="text-white/70 text-sm">Your data is always protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-secondary-plot md:hidden">
            DigiPlot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 md:hidden">
            Property Management System
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
            {/* User type selector */}
            <div className="mb-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'tenant' }))}
                className={`rounded-lg px-5 py-2.5 transition-all duration-200 flex items-center ${formData.userType === 'tenant' 
                  ? 'bg-gradient-to-r from-secondary-plot to-primary-plot text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <TbUser className="mr-2 h-5 w-5" />
                Tenant
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'landlord' }))}
                className={`rounded-lg px-5 py-2.5 transition-all duration-200 flex items-center ${formData.userType === 'landlord' 
                  ? 'bg-gradient-to-r from-secondary-plot to-primary-plot text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <TbHome className="mr-2 h-5 w-5" />
                Landlord
              </button>
            </div>
            
            <h3 className="mb-6 text-center text-xl font-semibold text-secondary-plot">
              {formData.userType === 'tenant' ? 'Tenant Access' : 'Landlord Access'}
            </h3>
          
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100">
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
          
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <div className="absolute left-3 top-9">
                  <TbMail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-9">
                  <TbLock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="pl-10"
                />
                <div className="mt-2 text-right">
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-plot hover:text-primary-plot/80 transition-colors duration-200">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-secondary-plot to-primary-plot text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <TbLoader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="font-medium">Sign in</span>
                  )}
                </button>
              </div>
            </form>
          
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
