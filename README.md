# UMBC Campus Navigator - Team 4 Section 6

A comprehensive campus navigation system designed to help students, faculty, and visitors navigate the University of Maryland, Baltimore County (UMBC) campus efficiently. This full-stack web application provides intelligent route planning, location management, obstacle tracking, and user feedback collection.

<img width="1903" height="907" alt="image" src="https://github.com/user-attachments/assets/1a555de0-64de-478d-8cc6-e70b4acdb496" />
<img width="1915" height="903" alt="image" src="https://github.com/user-attachments/assets/5aef45a7-efcf-4d8d-b8f9-f5bf480de18a" />

## 👥 Team Members

- **Victor Olalemi**
- **Ashraf Kawooya** 
- **Bryan Ukwandu**

## 🚀 Project Overview

The UMBC Campus Navigator is a modern, full-stack web application that provides intelligent navigation solutions for campus users. The system features an interactive map interface, real-time route calculation, comprehensive location database, obstacle tracking, and an admin panel for content management. Built with React and Node.js, it offers a seamless user experience with dark mode support and responsive design.

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **@react-google-maps/api** - Google Maps integration
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Context API** - State management (Theme)

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Google Maps API** - Route calculation and geocoding
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Development server auto-reload
- **React Scripts** - Build tooling

## 📁 Project Structure

```
team4-section6/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Admin/              # Admin panel components
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   ├── FeedbackManager.jsx
│   │   │   │   ├── LocationManager.jsx
│   │   │   │   ├── ObstacleManager.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Building/           # Building detail components
│   │   │   │   └── BuildingDetailsPanel.jsx
│   │   │   ├── Home/               # Home page components
│   │   │   │   ├── HomePage.jsx
│   │   │   │   └── PopularLocations.jsx
│   │   │   ├── Map/                # Map-related components
│   │   │   │   ├── MapContainer.jsx
│   │   │   │   ├── MapPage.jsx
│   │   │   │   └── RouteInfoPanel.jsx
│   │   │   ├── Modals/             # Modal components
│   │   │   │   ├── FeedbackModal.jsx
│   │   │   │   ├── ReportObstacleModal.jsx
│   │   │   │   └── SearchModal.jsx
│   │   │   └── UI/                 # Reusable UI components
│   │   │       ├── Button.jsx
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Loading.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── NotFound.jsx
│   │   │       └── ThemeToggle.jsx
│   │   ├── contexts/               # React contexts
│   │   │   └── ThemeContext.js     # Dark mode theme management
│   │   ├── services/               # API service layer
│   │   │   ├── api.js              # Base API configuration
│   │   │   ├── feedbackServices.js
│   │   │   ├── locationService.js
│   │   │   └── routeService.js
│   │   ├── utils/                  # Utility functions
│   │   │   └── mapStyles.js        # Google Maps styling
│   │   ├── App.js                  # Main application component
│   │   ├── index.js                # Application entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── server/                          # Node.js/Express backend
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── middleware/
    │   ├── auth.js                  # JWT authentication middleware
    │   └── errorHandler.js          # Global error handling
    ├── models/                      # Mongoose schemas
    │   ├── Location.js              # Campus location schema
    │   ├── User.js                  # Admin user schema
    │   ├── Feedback.js              # User feedback schema
    │   ├── Obstacle.js              # Campus obstacle schema
    │   └── RouteLog.js              # Route calculation logs
    ├── routes/                      # API route handlers
    │   ├── auth.js                  # Authentication routes
    │   ├── locations.js             # Location management
    │   ├── routes.js                # Route calculation
    │   ├── admin.js                 # Admin operations
    │   └── feedback.js              # Feedback system
    ├── services/
    │   └── googleMapsService.js     # Google Maps API integration
    ├── seeds/
    │   └── seedLocations.js         # Database seeding script
    ├── server.js                    # Main server file
    └── package.json
```

## 🎯 Key Features

### 1. **Interactive Map Navigation**
- Google Maps integration with custom styling
- Real-time user location detection
- Interactive markers for campus locations
- Route visualization with turn-by-turn directions
- Support for both walking and biking routes
- Distance and duration calculations

### 2. **Location Management**
- Comprehensive campus location database
- Support for multiple location types:
  - Academic buildings
  - Dining facilities
  - Recreation centers
  - Residential buildings
  - Administrative offices
  - Parking areas
- Geospatial indexing for proximity searches
- Full-text search functionality
- Department-based filtering
- Bike-friendly location features (bike rack availability)

### 3. **Route Calculation**
- Walking and biking route options
- Google Maps Directions API integration
- Step-by-step navigation instructions
- Distance and duration calculations
- Accessibility considerations
- Route logging for analytics

### 4. **Obstacle Tracking**
- Real-time obstacle reporting
- Support for multiple obstacle types:
  - Construction zones
  - Closed paths
  - Events
- Geospatial obstacle mapping (Point, LineString, Polygon)
- Time-based obstacle management
- Active/inactive status tracking

### 5. **User Feedback System**
- Multiple issue types:
  - Wrong Location
  - Missing Building
  - Route Error
  - Accessibility Issue
  - Other
- Feedback status tracking (New, Reviewed, Resolved)
- Admin review and management system
- User-friendly feedback submission modal

### 6. **Admin Panel**
- Secure JWT-based authentication
- Comprehensive dashboard with overview statistics
- Location CRUD operations
- Obstacle management
- Feedback review and resolution system
- Protected routes with authentication middleware

### 7. **User Experience Features**
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Search Functionality**: Quick search for locations and buildings
- **Popular Locations**: Quick access to frequently visited places
- **Building Details**: Comprehensive information panels
- **Error Handling**: Graceful error boundaries and user feedback
- **Loading States**: Visual feedback during data fetching

## 🗄️ Database Schema

### Location Model
```javascript
{
  locationID: String (unique, required),
  name: String (required),
  shortName: String,
  type: ['Academic', 'Dining', 'Recreation', 'Residential', 'Administrative', 'Parking'],
  coordinates: {
    lat: Number (required),
    lng: Number (required)
  },
  address: String,
  departments: [String],
  bikeFeatures: {
    bikeRackAvailable: Boolean,
    bikeRackCapacity: Number
  }
}
```

**Indexes:**
- Geospatial index on `coordinates` for proximity searches
- Text index on `name` and `shortName` for search functionality

### User Model (Admin)
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (default: 'admin'),
  name: String
}
```

### Feedback Model
```javascript
{
  issueType: ['Wrong Location', 'Missing Building', 'Route Error', 'Accessibility Issue', 'Other'],
  locationID: String,
  description: String (required),
  status: ['New', 'Reviewed', 'Resolved'] (default: 'New'),
  createdAt: Date,
  updatedAt: Date
}
```

### Obstacle Model
```javascript
{
  obstacleID: String (unique, required),
  type: ['Construction', 'Closed Path', 'Event'],
  description: String (required),
  affectedArea: {
    type: ['Point', 'LineString', 'Polygon'],
    coordinates: [] (GeoJSON format)
  },
  startDate: Date,
  endDate: Date,
  isActive: Boolean (default: true)
}
```

### RouteLog Model
```javascript
{
  origin: String (required),
  destination: String (required),
  travelMode: ['WALKING', 'BICYCLING'] (default: 'WALKING'),
  distance: Number (in meters),
  duration: Number (in seconds),
  calculatedAt: Date (default: Date.now),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Index on `calculatedAt` for time-based queries

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
  ```json
  {
    "email": "admin@umbc.edu",
    "password": "password"
  }
  ```
- `GET /api/auth/me` - Get current admin info (Protected)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/search?query=<search_term>` - Search locations
- `GET /api/locations/:id` - Get specific location by ID
- `GET /api/locations/nearby?lat=<lat>&lng=<lng>&radius=<radius>` - Find nearby locations

### Routes
- `POST /api/routes/calculate` - Calculate route between points
  ```json
  {
    "startLat": 39.2554,
    "startLng": -76.7114,
    "endLat": 39.2547,
    "endLng": -76.7109,
    "bikeMode": false
  }
  ```
  Returns route details including steps, distance, and duration.

### Admin (Protected Routes - Requires JWT Token)
- `POST /api/admin/locations` - Add new location
- `PUT /api/admin/locations/:id` - Update location
- `DELETE /api/admin/locations/:id` - Delete location
- `POST /api/admin/obstacles` - Add obstacle
- `GET /api/admin/obstacles` - Get all obstacles
- `PUT /api/admin/obstacles/:id` - Update obstacle
- `DELETE /api/admin/obstacles/:id` - Delete obstacle
- `GET /api/admin/feedback` - Get all feedback
- `PUT /api/admin/feedback/:id` - Update feedback status

### Feedback
- `POST /api/feedback` - Submit feedback
  ```json
  {
    "issueType": "Wrong Location",
    "locationID": "ENG",
    "description": "Building coordinates are incorrect"
  }
  ```
- `GET /api/feedback` - Get all feedback (Admin only)

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Google Maps API Key** ([Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd umbc-campus-navigator/team4-section6
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/umbc-navigator
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/umbc-navigator
   
   JWT_SECRET=your_super_secret_jwt_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

   Create a `.env` file in the `client` directory (if needed):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

5. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # On macOS/Linux
   mongod
   
   # On Windows
   # Start MongoDB service or run mongod.exe
   ```

6. **Seed the Database** (Optional)
   ```bash
   cd server
   node seeds/seedLocations.js
   ```

7. **Start the Development Servers**

   **Terminal 1 - Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

   **Terminal 2 - Start Frontend Client:**
   ```bash
   cd client
   npm start
   ```
   Client will run on `http://localhost:3000`

### Production Build

**Build the React app:**
```bash
cd client
npm run build
```

**Start production server:**
```bash
cd server
npm start
```

## 🔧 Configuration

### Database Indexes
The application creates several indexes for optimal performance:
- **Geospatial Index**: `coordinates: '2dsphere'` on Location model for proximity searches
- **Text Index**: `name: 'text', shortName: 'text'` on Location model for search functionality
- **Time Index**: `calculatedAt: -1` on RouteLog model for time-based queries

### Security Features
- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication with expiration
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Error handling middleware
- Protected admin routes

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain (recommended for production)
6. Add the API key to your `.env` files

## 📊 Sample Data

The application includes seeded data for UMBC campus locations including:
- **Academic Buildings**: Engineering (ENG), ITE, Library, Math/Psychology, etc.
- **Dining Facilities**: Commons, True Grit's, Chick-fil-A, etc.
- **Recreation**: Retriever Activities Center (RAC), etc.
- **Residential**: Various residence halls
- **Administrative**: Administration Building, etc.
- **Parking**: Multiple parking lots and garages

## 🎨 UI/UX Features

- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Map**: Custom-styled Google Maps with markers and routes
- **Search Modal**: Quick location search with autocomplete
- **Building Details Panel**: Comprehensive information display
- **Route Information**: Step-by-step directions with distance and duration
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling with user-friendly messages

## 🚧 Future Enhancements

- [ ] Real-time obstacle updates via WebSockets
- [ ] Mobile application (React Native)
- [ ] Push notifications for route changes
- [ ] Integration with UMBC shuttle system
- [ ] Enhanced accessibility route optimization
- [ ] Multi-language support
- [ ] Offline mode capabilities with service workers
- [ ] Route history and favorites
- [ ] Social features (share routes, reviews)
- [ ] AR navigation support
- [ ] Indoor navigation for buildings
- [ ] Integration with class schedules

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests (if implemented)
cd server
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use consistent indentation (2 spaces)
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

## 🙏 Acknowledgments

- Google Maps Platform for mapping services
- UMBC for campus location data
- React and Express.js communities for excellent documentation

---

**Note**: This project is part of a university course and is intended for educational purposes. The Google Maps API integration requires a valid API key for production use. Make sure to set up billing and API restrictions appropriately.

**Version**: 1.0.0  
**Last Updated**: 2024
