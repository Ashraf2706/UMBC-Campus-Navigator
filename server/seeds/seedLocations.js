const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('../models/Location');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const locations = [
  {
    locationID: "ENG_101",
    name: "Engineering Building",
    shortName: "ENG",
    type: "Academic",
    coordinates: { lat: 39.25447, lng: -76.71391 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Computer Science and Electrical Engineering Department",
      "Mechanical Engineering Department",
      "Chemical, Biochemical, and Environmental Engineering",
      "Center for Advanced Sensor Technology",
      "Engineering Dean's Office"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 20,
    }
  },
  {
    locationID: "ITE_101",
    name: "Information Technology Engineering Building",
    shortName: "ITE",
    type: "Academic",
    coordinates: { lat: 39.25389, lng: -76.71428 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Information Systems Department",
      "Computer Engineering",
      "Cybersecurity Lab",
      "UMBC Training Centers"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 15,
    }
  },
  {
    locationID: "UC_101",
    name: "University Center",
    shortName: "UC",
    type: "Dining",
    coordinates: { lat: 39.25441, lng: -76.7133 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Student Life Office",
      "Dining Services",
      "Student Organizations",
      "Campus Card Office",
      "Mailing and Shipping Services",
      "International Student and Scholar Services"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 30,
    }
  },
  {
    locationID: "LIB_101",
    name: "Albin O. Kuhn Library",
    shortName: "AOK",
    type: "Academic",
    coordinates: { lat: 39.25638, lng: -76.71152 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Library Services",
      "Special Collections",
      "Research Help Desk",
      "Writing Center",
      "Media Services",
      "University Archives",
      "Tutoring Center"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 25,
    }
  },
  {
    locationID: "RAC_101",
    name: "Retriever Activities Center",
    shortName: "RAC",
    type: "Recreation",
    coordinates: { lat: 39.25300, lng: -76.71257 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Athletics Department",
      "Recreation and Wellness",
      "Intramural Sports",
      "Fitness Center",
      "Orthopedic and Physical Therapy Center"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 10,
    }
  },
  {
    locationID: "COM_101",
    name: "The Commons",
    shortName: "COM",
    type: "Dining",
    coordinates: { lat: 39.25506, lng: -76.71082 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Student Government Association",
      "Student Life Office",
      "Bookstore"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 40,
    }
  },
  {
    locationID: "ILSB_101",
    name: "UMBC Interdisciplinary Life Sciences Building",
    shortName: "ILSB",
    type: "Academic",
    coordinates: { lat: 39.25396, lng: -76.71101 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Biological Sciences Department",
      "Chemistry and Biochemistry",
      "Physics Department",
      "Psychology Department",
      "Imaging Research Center"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 10,
    }
  },
  {
    locationID: "ACC_101",
    name: "Apartment Community Center",
    shortName: "ACC",
    type: "Residential",
    coordinates: { lat: 39.25817, lng: -76.71198 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Apartment Housing Office",
      "Community Events",
      "Resident Services"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 8,
    }
  },
  {
    locationID: "ADMIN_101",
    name: "Administration Building",
    shortName: "ADMIN",
    type: "Administrative",
    coordinates: { lat: 39.25306, lng: -76.71349 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Office of the President",
      "Graduate School Office",
      "Student Business Services Office",
      "Registrar's Office",
      "Admissions Office",
      "Human Resources"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "MATH_101",
    name: "Mathematics and Psychology Building",
    shortName: "MP",
    type: "Academic",
    coordinates: { lat: 39.25411, lng: -76.71248 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Mathematics and Statistics Department",
      "Psychology Department",
      "Math Tutoring Center",
      "Statistics Consulting Center",
      "Career Center"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Location.deleteMany();
    await User.deleteMany();

    // Insert locations
    await Location.insertMany(locations);
    console.log('✅ Locations seeded successfully');
    console.log(`📍 Added ${locations.length} locations with department data`);

    // Create admin user
    await User.create({
      name: 'UMBC Administrator',
      email: 'admin@umbc.edu',
      password: 'umbc123'
    });
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();