import Footer from '../UI/Footer';
import PopularLocations from './PopularLocations';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Navigation, Bike, AlertTriangle } from 'lucide-react';
import SearchModal from '../Modals/SearchModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const features = [
    {
      icon: Navigation,
      title: 'Walking Routes',
      description: 'Get optimized walking directions between any two locations on campus with distance and time.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Bike,
      title: 'Biking Paths',
      description: 'Discover bike-friendly routes across campus with dedicated paths and accessibility information.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: AlertTriangle,
      title: 'Obstacle Reports',
      description: 'Stay informed about construction, closures, and temporary obstacles affecting campus navigation.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://umbc.edu/wp-content/uploads/2020/09/Campus-Summer-ILSB19-4518_edit-scaled-e1600101974405-1024x532.jpg")',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">
            Navigate UMBC Campus with Confidence
          </h1>
          <p className="text-xl md:text-2xl text-white text-center mb-8 max-w-3xl">
            Find buildings, get directions, and navigate obstacles across campus
          </p>
          
          {/* Search Bar */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="w-full max-w-3xl bg-white rounded-full shadow-2xl p-4 cursor-pointer hover:shadow-3xl transition-shadow"
          >
            <div className="flex items-center gap-3 px-4">
              <Search className="text-gray-400" size={24} />
              <span className="text-gray-500 text-lg">
                Search for buildings, departments, or amenities...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/map')}
            >
              <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Locations Section */}
      {/* <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Locations</h2>
          <p className="text-gray-600 mb-8">Quick access to frequently visited campus destinations</p>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/map')}
              className="bg-umbc-gold hover:bg-umbc-dark-gold text-black font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              View All Locations on Map
            </button>
          </div>
        </div>
      </div> */}
      <PopularLocations/>

      {/* Footer */}
      <Footer />

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default HomePage;