import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertTriangle, MessageSquare, GraduationCap } from 'lucide-react';
import SearchModal from '../Modals/SearchModal';
import ReportObstacleModal from '../Modals/ReportObstacleModal';
import FeedbackModal from '../Modals/FeedbackModal';
import { Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-umbc-gold rounded-lg flex items-center justify-center">
                <GraduationCap size={24} className="text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UMBC</h1>
                <p className="text-xs text-gray-600">Campus Navigator</p>
              </div>
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search size={20} />
                <span className="hidden md:inline">Find Location</span>
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <AlertTriangle size={20} />
                <span className="hidden md:inline">Report Obstacle</span>
              </button>

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MessageSquare size={20} />
                <span className="hidden md:inline">Feedback</span>
              </button>

              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Shield size={20} />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ReportObstacleModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
};

export default Navbar;