import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PiUserDuotone } from "react-icons/pi";
import {MdSpaceDashboard} from "react-icons/md"
import { TbCoins, TbX } from "react-icons/tb";
import {FaTools} from "react-icons/fa"
import { LuLogOut } from "react-icons/lu";

const TenantLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/tenant",
      icon: (
        <MdSpaceDashboard size={23}/>
      ),
    },
    {
      name: "Payments",
      path: "/tenant/payments",
      icon: (
        <TbCoins size={23}/>
      ),
    },
    {
      name: "Maintenance",
      path: "/tenant/maintenance",
      icon: (
        <FaTools size={22}/>
      ),
    },
    {
      name: "Profile",
      path: "/tenant/profile",
      icon: (
        <PiUserDuotone size={23}/>
      ),
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Premium Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <div className="flex h-screen flex-col bg-gradient-to-b from-secondary-plot to-secondary-plot/90 shadow-xl relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5 blur-xl"></div>
          <div className="absolute bottom-1/4 -left-20 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl"></div>

          <div className="flex flex-col pt-8 pb-4 relative z-10">
            {/* Logo area with enhanced styling */}
            <div className="flex flex-shrink-0 items-center justify-center px-4 mb-6">
              <span className="text-2xl font-bold text-white tracking-tight">
                DigiPlot
              </span>
            </div>

            {/* User profile card with premium styling */}
            <div className="mx-4 mb-8">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/10 shadow-lg">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
                    <span className="text-lg font-semibold text-white">
                      {user?.name?.charAt(0) + user?.name?.charAt(1) || (
                        <PiUserDuotone />
                      )}
                    </span>
                  </div>
                  <div className="ml-4">
                    {/* <p className="text-sm font-medium text-white/80">{getGreeting()},</p> */}
                    <p className="text-base font-semibold text-white">
                      {user?.name || "Tenant"}
                    </p>

                    {/* Status indicator */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                        <span className="text-[0.7rem] font-medium text-white/80">
                          Active Tenant
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation with enhanced styling */}
            <div className="px-4">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
                Main Menu
              </h3>
              <nav className="flex-1 space-y-2" aria-label="Sidebar">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "group flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white shadow-md border border-white/10"
                        : "group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                    }
                  >
                    <div className="mr-3 flex-shrink-0">{item.icon}</div>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer area with premium styling */}
          <div className="mt-auto mx-3 mb-4">
            <div className="rounded-xl bg-white/5 backdrop-blur-sm p-2 border border-white/5">
              <button
                onClick={handleLogout}
                className="group flex w-full justify-center items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium text-white/80 hover:bg-red-500/60 hover:text-white transition-all duration-200"
              >
                <LuLogOut className="mr-2 w-5 h-5"/>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header and content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header - Premium Design */}
        <div className="lg:hidden">
          <div
            className={`${
              scrolled ? "shadow-lg" : "shadow-md"
            } sticky top-0 z-10 flex h-16 items-center justify-between bg-gradient-to-r from-secondary-plot to-primary-plot/90 px-4 transition-shadow duration-300 ease-in-out`}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
            
            <div className="flex items-center relative z-10">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 transition-colors duration-200 focus:outline-none">
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
              <div className="ml-4">
                <span className="text-xl font-bold text-white tracking-tight">
                  DigiPlot
                </span>
              </div>
            </div>
            <div className="flex items-center relative z-10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-sm">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0) + user?.name?.charAt(1) || "T"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile menu - Premium Design */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 flex">
              <div
                className="fixed inset-0 bg-gray-900/80 backdrop-blur-[1px]"
                onClick={toggleMobileMenu}
              ></div>
              <div className="relative flex w-full max-w-[17rem] flex-1 flex-col bg-gradient-to-b from-secondary-plot to-secondary-plot/90 pt-5 pb-4 overflow-hidden">
                {/* Decorative elements */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5 blur-xl"></div>
                <div className="absolute bottom-1/4 -left-20 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl"></div>
                
                
                <div className="flex-shrink-0 flex items-center justify-center px-4 relative z-10">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    DigiPlot
                  </span>
                </div>
                
                {/* User profile card */}
                <div className="mt-6 mx-2 relative z-10">
                  <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10 shadow-lg">
                    <div className="flex items-center">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
                        <span className="text-base font-semibold text-white">
                          {user?.name?.charAt(0) + user?.name?.charAt(1) || (
                            <PiUserDuotone />
                          )}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-white">
                          {user?.name || "Tenant"}
                        </p>
                        
                        {/* Status indicator */}
                        <div className="mt-2 pt-2 border-t border-white/30">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                            <span className="text-[0.7rem] font-medium text-white/80">
                              Active Tenant
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="mt-6 px-3 relative z-10">
                  <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
                    Main Menu
                  </h3>
                  <nav className="flex-1 space-y-2" aria-label="Sidebar">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          isActive
                            ? "group flex items-center rounded-xl bg-white/20 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white shadow-md border border-white/10"
                            : "group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                        }
                        onClick={toggleMobileMenu}
                      >
                        <div className="mr-3 flex-shrink-0">{item.icon}</div>
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>
                
                {/* Footer/Logout */}
                <div className="mt-auto mx-2 mb-2 relative z-10">
                  <div className="rounded-xl bg-white/5 backdrop-blur-sm p-2 border border-white/5">
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="group flex w-full justify-center items-center rounded-lg px-4 py-2 text-left text-sm font-medium text-white/80 hover:bg-red-500/60 hover:text-white transition-all duration-200"
                    >
                      <LuLogOut className="mr-2 w-5 h-5"/>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-14 flex-shrink-0"></div>
            </div>
          )}
        </div>

        {/* Main content */}
        <main className=" bg-background-plot overflow-y-auto hide-scrollbar">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>

        
      </div>
    </div>
  );
};

export default TenantLayout;
