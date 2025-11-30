import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import LocationManager from './LocationManager';
import ObstacleManager from './ObstacleManager';
import FeedbackManager from './FeedbackManager';
import DashboardOverview from './DashboardOverview';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('adminName');
    setAdminName(name || 'Administrator');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/locations', icon: MapPin, label: 'Locations' },
    { path: '/admin/obstacles', icon: AlertTriangle, label: 'Obstacles' },
    { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`bg-umbc-black text-white w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-blue-700">
            <h1 className="text-2xl font-bold">UMBC Navigator</h1>
            <p className="text-blue-200 text-sm">Admin Panel</p>
          </div>

          {/* Admin Info */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-umbc-gold rounded-full flex items-center justify-center text-black font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{adminName}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-umbc-gold text-black'
                    : 'hover:bg-blue-700 text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-umbc-blue text-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/locations" element={<LocationManager />} />
            <Route path="/obstacles" element={<ObstacleManager />} />
            <Route path="/feedback" element={<FeedbackManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;