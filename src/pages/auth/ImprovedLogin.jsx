import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { 
  TbUser, 
  TbHome, 
  TbLock, 
  TbMail, 
  TbLoader2,
  TbSun,
  TbCalendarEvent,
  TbCheck,
  TbAlertTriangle,
  TbChevronRight
} from 'react-icons/tb';

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
  const [timeOfDay, setTimeOfDay] = useState("");
  
  // Set time of day greeting
  useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);
  
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
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* Left side - Elegant asymmetric design */}
      <div className="hidden lg:block lg:w-7/12 relative">
        {/* Main background with gradient similar to Dashboard */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-plot/90 via-secondary-plot to-primary-plot/80 overflow-hidden">
          {/* Enhanced glass morphism effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
          
          {/* Decorative elements - more sophisticated */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-plot/20 blur-xl"></div>
          <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-white/5 blur-lg opacity-60"></div>
          <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-white/10 blur-md"></div>
          <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-primary-plot/10 blur-xl opacity-40"></div>
          
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          
          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-center p-16">
            <div className="max-w-xl">
              {/* Logo area */}
              <div className="mb-16">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-secondary-plot font-bold text-xl">D</span>
                  </div>
                  <h1 className="text-3xl font-light text-white tracking-wider">DIGIPLOT</h1>
                </div>
                <p className="mt-2 text-white/70 font-light tracking-wide">PREMIUM PROPERTY MANAGEMENT</p>
              </div>
              
              {/* Main headline */}
              <h2 className="text-5xl font-light text-white leading-tight mb-6">
                <span className="font-normal">Elevate</span> your property<br />
                management <span className="text-amber-200">experience</span>
              </h2>
              
              <p className="text-white/70 max-w-md mb-12 leading-relaxed">
                DigiPlot offers a sophisticated platform for property owners and tenants, 
                designed with precision and elegance for the modern real estate market.
              </p>
              
              {/* Feature points with updated styling */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-200 rotate-45"></div>
                  <p className="text-white font-light">Streamlined property oversight and management</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-200 rotate-45"></div>
                  <p className="text-white font-light">Secure and transparent tenant communication</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-200 rotate-45"></div>
                  <p className="text-white font-light">Sophisticated financial tracking and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form with Dashboard-inspired styling */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center p-8 lg:p-16 relative">
        {/* Mobile view header */}
        <div className="lg:hidden mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-secondary-plot rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-2xl font-light text-secondary-plot tracking-wider">DIGIPLOT</h1>
          </div>
          <p className="text-gray-500 text-sm font-light tracking-wide">PREMIUM PROPERTY MANAGEMENT</p>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Welcome section with time of day greeting */}
          <div className="mb-10">
            <div className="flex items-center mb-3">
              <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                <TbSun className="h-4 w-4 mr-1.5 text-primary-plot" />
                <span>Good {timeOfDay}</span>
              </div>
              
              <div className="hidden md:flex items-center ml-4 text-[0.8rem] md:text-sm font-medium text-gray-600">
                <TbCalendarEvent className="h-4 w-4 mr-1.5 text-secondary-plot" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-plot mb-2">
              Welcome back
              <span className="text-primary-plot">!</span>
            </h2>
            <p className="text-gray-500">Please sign in to continue</p>
          </div>
          
          {/* User type selector with Dashboard-inspired design */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex -mb-px">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'tenant' }))}
                className={`py-4 px-6 border-b-2 font-medium transition-colors duration-300 ${formData.userType === 'tenant' 
                  ? 'border-primary-plot text-primary-plot' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Tenant
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'landlord' }))}
                className={`py-4 px-6 border-b-2 font-medium transition-colors duration-300 ${formData.userType === 'landlord' 
                  ? 'border-primary-plot text-primary-plot' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Landlord
              </button>
            </div>
          </div>
          
          {/* Error message with Dashboard styling */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 text-red-800 flex items-start">
              <TbAlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {/* Login form with enhanced styling */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-plot/50 focus:border-primary-plot bg-white text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-plot/50 focus:border-primary-plot bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-plot focus:ring-primary-plot border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-plot hover:text-primary-plot/80">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            {/* Sign in button with Dashboard-inspired styling */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-secondary-plot to-primary-plot text-white px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <span className="relative flex items-center justify-center font-bold">
                  {loading ? (
                    <>
                      <TbLoader2 className="animate-spin h-5 w-5 mr-2" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <TbChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
          
          {/* Registration link with enhanced styling */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-plot hover:text-primary-plot/80">
                Create an account
              </Link>
            </p>
          </div>
          
          {/* Security note with Dashboard-style card */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-gradient-to-br from-secondary-plot/20 to-secondary-plot/10 p-2 rounded-lg mr-3">
                <TbCheck className="h-5 w-5 text-secondary-plot" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-1">Secure Login</h3>
                <p className="text-xs text-gray-500">
                  Your connection to DigiPlot is encrypted and your information is never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
