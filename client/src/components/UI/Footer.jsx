import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, AlertTriangle, MessageSquare, Linkedin, Instagram } from 'lucide-react';
import ReportObstacleModal from '../Modals/ReportObstacleModal';
import FeedbackModal from '../Modals/FeedbackModal';

const Footer = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-umbc-gold dark:bg-umbc-gold transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* About Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-black p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-umbc-gold" />
                </div>
                <h3 className="text-lg font-bold text-black">UMBC Navigator</h3>
              </div>
              <p className="text-sm text-black">
                Navigate UMBC campus with ease. Find buildings, get directions, and explore campus facilities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-black hover:text-gray-800 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="text-sm text-black hover:text-gray-800 transition-colors">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="text-sm text-black hover:text-gray-800 transition-colors">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <a href="https://umbc.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-black hover:text-gray-800 transition-colors">
                    UMBC Website
                  </a>
                </li>
              </ul>
            </div>

            {/* Help & Support - WITH REPORT OBSTACLE AND FEEDBACK */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Help & Support</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center space-x-2 text-sm text-black hover:text-gray-800 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Report Obstacle</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="flex items-center space-x-2 text-sm text-black hover:text-gray-800 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </button>
                </li>
                <li>
                  <a href="mailto:support@umbc.edu" className="flex items-center space-x-2 text-sm text-black hover:text-gray-800 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </a>
                </li>  
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/umbclife/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black p-2 rounded-lg text-umbc-gold hover:bg-gray-800 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/school/university-of-maryland-baltimore-county/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black p-2 rounded-lg text-umbc-gold hover:bg-gray-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-sm text-black mt-4">
                Follow UMBC for updates and news
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-black/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-black">
                © {new Date().getFullYear()} UMBC Campus Navigator. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportObstacleModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

export default Footer;