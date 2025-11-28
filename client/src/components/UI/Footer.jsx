import React from 'react';
import { GraduationCap, Mail, Phone, MapPin as MapPinIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-umbc-blue text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={32} />
              <div>
                <h3 className="text-xl font-bold">UMBC</h3>
                <p className="text-sm text-blue-200">Campus Navigator</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm">
              Navigate the UMBC campus with confidence. Find buildings, get directions, 
              and stay updated on campus obstacles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/map" className="hover:text-white transition-colors">Campus Map</a></li>
              <li><a href="https://www.umbc.edu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">UMBC Website</a></li>
              <li><a href="/admin/login" className="hover:text-white transition-colors">Admin Login</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-start gap-2">
                <MapPinIcon size={16} className="mt-0.5 flex-shrink-0" />
                <span>1000 Hilltop Circle<br />Baltimore, MD 21250</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(410) 455-1000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>support@umbc.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200 text-sm">
          <p>&copy; {new Date().getFullYear()} UMBC Campus Navigator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;