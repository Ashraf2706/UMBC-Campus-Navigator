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
      bikeRackCapacity: 10,
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
      bikeRackCapacity: 10,
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
      "International Student and Scholar Services",
      "Starbucks",
      "Chic-fil-a"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
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
      "Tutoring Center",
      "Einstien Brother's Bagels"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
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
      "Bookstore",
      "Halal Shack",
      "Piccola Italia",
      "Wild Greens",
      "Dunkin",
      "Sushi Do",
      "Copperhead Jacks",
      "Commons Retriever Market",
      "The Skylight Room",
      "Absurd Bird & Burgers",
      "Indian Kitchen"
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 20,
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
      "Resident Services",
      "Youth Justice Lab"
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
      "Human Resources",
      "Coffee Shop"
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
  },
  {
    locationID: "FA_101",
    name: "Fine Arts Building",
    shortName: "FA",
    type: "Academic",
    coordinates: { lat: 39.25503, lng: -76.71344 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "MEYR_101",
    name: "Meyerhoff ChemistryBuilding",
    shortName: "MEYR",
    type: "Academic",
    coordinates: { lat: 39.25487, lng: -76.71251 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
 
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "PAHB_101",
    name: "Performing Arts and Humanities Building",
    shortName: "PAHB",
    type: "Academic",
    coordinates: { lat: 39.25528, lng: -76.71489 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "PHYS_101",
    name: "Physics Building",
    shortName: "PHYS",
    type: "Academic",
    coordinates: { lat: 39.25450, lng: -76.70976 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "PUP_101",
    name: "Public Policy Building",
    shortName: "PUP",
    type: "Academic",
    coordinates: { lat: 39.25411, lng: -76.71248 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "SHER_101",
    name: "Sherman Hall",
    shortName: "SHER",
    type: "Academic",
    coordinates: { lat: 39.25381, lng: -76.71363 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "SOND_101",
    name: "Janet and Walter Sondheim Building",
    shortName: "SOND",
    type: "Academic",
    coordinates: { lat: 39.25376, lng: -76.71275 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "TG_101",
    name: "True Grit's - UMBC Campus Dining Hall",
    shortName: "TG",
    type: "Dining",
    coordinates: { lat: 39.25569, lng: -76.70780 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "BIOL_101",
    name: "Biological Sciences Building",
    shortName: "BIOL",
    type: "Academic",
    coordinates: { lat: 39.25494, lng: -76.71215 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "LH_101",
    name: "Lecture Hall 1",
    shortName: "LH",
    type: "Academic",
    coordinates: { lat: 39.25480, lng: -76.71179 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "CEIA_101",
    name: "Chesapeake Employers Insurance Arena",
    shortName: "CEIA",
    type: "Recreation",
    coordinates: { lat: 39.25225, lng: -76.70764 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 10,
    }
  }, 
  {
    locationID: "SC_101",
    name: "UMBC Stadium Complex",
    shortName: "SC",
    type: "Athletic",
    coordinates: { lat: 39.25057, lng: -76.70757 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
 
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 10,
    }
  },
  {
    locationID: "CHES_101",
    name: "Chesapeake Hall",
    shortName: "CHES",
    type: "Residential",
    coordinates: { lat: 39.25681, lng: -76.70869 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "ERK_101",
    name: "Erickson Hall",
    shortName: "ERK",
    type: "Residential",
    coordinates: { lat: 39.25717, lng: -76.70982 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Residential Life Facilities "
    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "CWB_101",
    name: "The Center for Well-Being",
    shortName: "CWB",
    type: "Health",
    coordinates: { lat: 39.25615, lng: -76.70908 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "HBR_101",
    name: "Harbor Hall",
    shortName: "HBR",
    type: "Residential",
    coordinates: { lat: 39.25724, lng: -76.70814 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "PAT_101",
    name: "Patapsco Hall",
    shortName: "PAT",
    type: "Residential",
    coordinates: { lat: 39.25516, lng: -76.70724 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "POT_101",
    name: "Potomac Hall",
    shortName: "PMC",
    type: "Residential",
    coordinates: { lat: 39.25604, lng: -76.70662 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 10,
    }
  },
  {
    locationID: "SUS_101",
    name: "Susquehanna Hall",
    shortName: "SUS",
    type: "Residential",
    coordinates: { lat: 39.25559, lng: -76.70857 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 5,
    }
  },
  {
    locationID: "WKR_101",
    name: "Walker Avenue Apartments",
    shortName: "WKR",
    type: "Residential",
    coordinates: { lat: 39.25942, lng: -76.71417 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [

    ],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 10,
    }
  },
  {
    locationID: "CHS_101",
    name: "Chester",
    shortName: "CHS",
    type: "Residential",
    coordinates: { lat: 39.25724, lng: -76.70814 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "West Hill Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "WYE_101",
    name: "Wye",
    shortName: "WYE",
    type: "Residential",
    coordinates: { lat: 39.25866, lng: -76.71252 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "West Hill Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "MAG_101",
    name: "Magothy",
    shortName: "MAG",
    type: "Residential",
    coordinates: { lat: 39.25906, lng: -76.71248 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "West Hill Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "CHO_101",
    name: "Choptank",
    shortName: "CHO",
    type: "Residential",
    coordinates: { lat: 39.25880, lng: -76.71309 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "West Hill Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "SDL_101",
    name: "Sideling",
    shortName: "SDL",
    type: "Residential",
    coordinates: { lat: 39.25842, lng: -76.70880 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "POC_101",
    name: "Pocomoke",
    shortName: "POC",
    type: "Residential",
    coordinates: { lat: 39.25838, lng: -76.70916 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "MAN_101",
    name: "Manokin",
    shortName: "MAN",
    type: "Residential",
    coordinates: { lat: 39.25866, lng: -76.70922 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "PTX_101",
    name: "Patuxent",
    shortName: "PTX",
    type: "Residential",
    coordinates: { lat: 39.25824, lng: -76.70959 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "ELK_101",
    name: "ELK",
    shortName: "ELK",
    type: "Residential",
    coordinates: { lat: 39.25783, lng: -76.70947 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "DPC_101",
    name: "Deep Creek",
    shortName: "DPC",
    type: "Residential",
    coordinates: { lat: 39.25780, lng: -76.70895 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "CAS_101",
    name: "Casselman",
    shortName: "CAS",
    type: "Residential",
    coordinates: { lat: 39.25807, lng: -76.70912 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "BRE_101",
    name: "Breton",
    shortName: "BRE",
    type: "Residential",
    coordinates: { lat: 39.25811, lng: -76.70866 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Hillside Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "NAN_101",
    name: "Nanticoke",
    shortName: "NAN",
    type: "Residential",
    coordinates: { lat: 39.25799, lng: -76.71156 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "GUN_101",
    name: "Gunpowder",
    shortName: "GUN",
    type: "Residential",
    coordinates: { lat: 39.25785, lng: -76.71116 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "MON_101",
    name: "Monocacy",
    shortName: "MON",
    type: "Residential",
    coordinates: { lat: 39.25724, lng: -76.70814 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "SAS_101",
    name: "Sassafras",
    shortName: "SAS",
    type: "Residential",
    coordinates: { lat: 39.25810, lng: -76.71018 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "WIC_101",
    name: "Wicomico",
    shortName: "WIC",
    type: "Residential",
    coordinates: { lat: 39.25800, lng: -76.70984 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "ANT_101",
    name: "Antietam",
    shortName: "ANT",
    type: "Residential",
    coordinates: { lat: 39.25780, lng: -76.71014 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "CHI_101",
    name: "Chincoteague",
    shortName: "CHI",
    type: "Residential",
    coordinates: { lat: 39.25757, lng: -76.71042 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
    ],
    bikeFeatures: {
      bikeRackAvailable: false,
      bikeRackCapacity: 0,
    }
  },
  {
    locationID: "TUC_101",
    name: "Tuckahoe",
    shortName: "TUC",
    type: "Residential",
    coordinates: { lat: 39.25762, lng: -76.71093 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: [
      "Terrace Apartments"
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