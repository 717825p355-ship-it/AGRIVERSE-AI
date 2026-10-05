import { DistrictAgriProfile, DetailedCropInfo, SeasonInfo } from '../types';

export const INDIA_STATES_AND_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", 
    "Nandyal", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari", "YSR Kadapa"
  ],
  "Arunachal Pradesh": [
    "Changlang", "East Siang", "Lohit", "Papum Pare", "Tawang", "Tirap", "West Kameng"
  ],
  "Assam": [
    "Barpeta", "Cachar", "Darrang", "Dibrugarh", "Dhubri", "Golaghat", "Jorhat", 
    "Kamrup", "Lakhimpur", "Nagaon", "Sonitpur", "Tinsukia"
  ],
  "Bihar": [
    "Begusarai", "Bhagalpur", "Darbhanga", "East Champaran", "Gaya", "Muzaffarpur", 
    "Nalanda", "Patna", "Purnia", "Rohtas", "Samastipur", "Vaishali", "West Champaran"
  ],
  "Chhattisgarh": [
    "Bastar", "Bilaspur", "Durg", "Janjgir-Champa", "Kanker", "Korba", "Raigarh", "Raipur", "Rajnandgaon"
  ],
  "Goa": [
    "North Goa", "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bhavnagar", "Gandhinagar", "Jamnagar", 
    "Junagadh", "Kheda", "Mehsana", "Rajkot", "Sabarkantha", "Surat", "Vadodara"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", 
    "Kaithal", "Karnal", "Kurukshetra", "Panipat", "Rohtak", "Sirsa", "Sonitpur", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Kangra", "Kullu", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Hazaribagh", "Ranchi", "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Chamarajanagar", "Chikkamagaluru", 
    "Davanagere", "Dharwad", "Hassan", "Haveri", "Kalaburagi", "Mandya", "Mysuru", "Raichur", "Shivamogga", "Vijayapura"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", 
    "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Balaghat", "Bhopal", "Chhindwara", "Dewas", "Dhar", "Gwalior", "Hoshangabad", "Indore", 
    "Jabalpur", "Khargone", "Mandsaur", "Morena", "Rewa", "Sagar", "Sehore", "Ujjain", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad (Chhatrapati Sambhajinagar)", "Beed", "Buldhana", 
    "Jalgaon", "Kolhapur", "Latur", "Nagpur", "Nanded", "Nashik", "Pune", "Ratnagiri", "Sangli", "Satara", "Solapur", "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Churachandpur", "Imphal East", "Imphal West", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Khasi Hills", "Ri-Bhoi", "South Garo Hills", "West Jaintia Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Kolasib", "Lunglei", "Serchhip"
  ],
  "Nagaland": [
    "Dimapur", "Kohima", "Mokokchung", "Mon", "Phek", "Tuensang", "Wokha"
  ],
  "Odisha": [
    "Balasore", "Bargarh", "Bhadrak", "Bolangir", "Cuttack", "Ganjam", "Jajpur", 
    "Kalahandi", "Kendrapara", "Koraput", "Mayurbhanj", "Puri", "Sambalpur"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Firozpur", "Gurdaspur", "Hoshiarpur", 
    "Jalandhar", "Ludhiana", "Mansa", "Moga", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", 
    "Chittorgarh", "Ganganagar", "Hanumangarh", "Jaipur", "Jhalawar", "Jodhpur", "Kota", "Nagaur", "Pali", "Udaipur"
  ],
  "Sikkim": [
    "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", 
    "Kanchipuram", "Karur", "Madurai", "Nagapattinam", "Namakkal", "Perambalur", "Pudukkottai", 
    "Ramanathapuram", "Salem", "Thanjavur", "Theni", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvannamalai", "Vellore", "Villupuram"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Jagtial", "Karimnagar", "Khammam", "Mahabubnagar", 
    "Medak", "Nalgonda", "Nizamabad", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Warangal"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "North Tripura", "South Tripura", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ayodhya", "Azamgarh", "Bareilly", "Basti", "Bijnor", "Bulandshahr", 
    "Deoria", "Etawah", "Farrukhabad", "Ghazipur", "Gorakhpur", "Jhansi", "Kanpur Nagar", 
    "Lakhimpur Kheri", "Lucknow", "Mathura", "Meerut", "Moradabad", "Muzaffarnagar", "Prayagraj", "Saharanpur", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Chamoli", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Udham Singh Nagar"
  ],
  "West Bengal": [
    "Bankura", "Birbhum", "Cooch Behar", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", 
    "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Purba Bardhaman", "Paschim Medinipur", "Purulia", "South 24 Parganas"
  ],
  "Andaman and Nicobar Islands": ["North and Middle Andaman", "South Andaman", "Nicobar"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Dadra and Nagar Haveli"],
  "Delhi": ["North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Baramulla", "Budgam", "Jammu", "Kathua", "Pulwama", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Karaikal", "Puducherry"]
};

export const SEASONS_DATA: SeasonInfo[] = [
  {
    name: 'Kharif',
    months: 'June – October (Monsoon Season)',
    description: 'Sown with the onset of the south-west monsoon. High rainfall and warm temperatures favor water-intensive crops.',
    sowingMonths: 'June – July',
    harvestMonths: 'September – October',
    majorCrops: ['Paddy / Rice', 'Maize / Corn', 'Cotton', 'Soybean', 'Groundnut', 'Sugarcane', 'Black Gram (Urad)'],
    icon: '🌧'
  },
  {
    name: 'Rabi',
    months: 'October – March (Winter Season)',
    description: 'Sown in autumn after monsoon rains and harvested in spring. Mild cold and controlled moisture suit cool-season crops.',
    sowingMonths: 'October – November',
    harvestMonths: 'February – March',
    majorCrops: ['Wheat', 'Mustard', 'Gram / Chickpea', 'Barley', 'Peas', 'Potato', 'Onion'],
    icon: '❄'
  },
  {
    name: 'Zaid',
    months: 'March – June (Summer Season)',
    description: 'Short summer season between Rabi and Kharif. Grown with riverbed or tube-well irrigation during high heat.',
    sowingMonths: 'March – April',
    harvestMonths: 'May – June',
    majorCrops: ['Watermelon', 'Muskmelon', 'Cucumber', 'Pumpkin', 'Bitter Gourd', 'Fodder Crops'],
    icon: '☀️'
  }
];

export const PRELOADED_DISTRICT_PROFILES: Record<string, DistrictAgriProfile> = {
  "Thanjavur": {
    districtName: "Thanjavur",
    stateName: "Tamil Nadu",
    country: "India",
    climate: "Tropical Humid & Deltaic",
    avgRainfall: "940 mm - 1,100 mm per year",
    tempRange: "23°C – 38°C",
    soilTypes: ["Deltaic Alluvial Soil", "Clay Loam Soil", "Red Sandy Loam"],
    irrigationSources: ["Cauvery Delta Canal Network", "Borewells", "River Channels"],
    majorCrops: ["Paddy / Rice", "Sugarcane", "Black Gram (Urad)", "Groundnut"],
    minorCrops: ["Sesame (Gingelly)", "Maize", "Green Gram"],
    horticultureCrops: ["Banana (Nendran/Poovan)", "Coconut", "Mango", "Jasmine"],
    plantationCrops: ["Coconut Plantations", "Cashew"],
    livestockInfo: "Crossbred Dairy Cattle (Jersey/HF), Murrah Buffaloes, Native Goats (Kanni)",
    cropRotation: "Paddy (Kuruvai) ➔ Paddy (Thaladi) ➔ Pulses / Sesame (Summer)",
    kvkCenter: "KVK Needamangalam / TRRI Aduthurai",
    dataSourceAttribution: "Tamil Nadu Agricultural University (TNAU) & ICAR Delta Zone Research"
  },
  "Nashik": {
    districtName: "Nashik",
    stateName: "Maharashtra",
    country: "India",
    climate: "Semi-Arid to Sub-Tropical",
    avgRainfall: "600 mm - 850 mm per year",
    tempRange: "12°C – 39°C",
    soilTypes: ["Deep Black Basaltic Soil (Regur)", "Medium Red Soil"],
    irrigationSources: ["Godavari River Network", "Drip Irrigation", "Farm Ponds"],
    majorCrops: ["Grape", "Onion", "Pomegranate", "Tomato"],
    minorCrops: ["Bajra (Pearl Millet)", "Maize", "Soybean"],
    horticultureCrops: ["Table Grapes (Thompson Seedless)", "Red Onion (N-53)", "Bhagwa Pomegranate"],
    plantationCrops: ["Guava", "Papaya"],
    livestockInfo: "Holstein Friesian Cross Cows, Osmanabadi Goats, Broiler Poultry",
    cropRotation: "Onion (Kharif) ➔ Tomato / Wheat (Rabi) ➔ Vegetables (Zaid)",
    kvkCenter: "KVK Yashwantrao Chavan Maharashtra Open University Nashik",
    dataSourceAttribution: "Mahatma Phule Krishi Vidyapeeth (MPKV) Rahuri & ICAR"
  },
  "Ludhiana": {
    districtName: "Ludhiana",
    stateName: "Punjab",
    country: "India",
    climate: "Semi-Arid Monsoonal",
    avgRainfall: "680 mm per year",
    tempRange: "4°C – 44°C",
    soilTypes: ["Indo-Gangetic Alluvial Soil", "Sandy Loam"],
    irrigationSources: ["Canal Network (Sirhind Canal)", "Submersible Electric Tube-wells"],
    majorCrops: ["Wheat", "Paddy / Rice (Basmati)", "Maize", "Potato"],
    minorCrops: ["Mustard (Raya)", "Sugarcane", "Moong"],
    horticultureCrops: ["Kinnow Citrus", "Guava", "Peas"],
    plantationCrops: ["Poplar & Eucalyptus Agro-forestry"],
    livestockInfo: "High-yielding Murrah Buffaloes, HF Crossbred Dairy Cattle",
    cropRotation: "Paddy (Kharif) ➔ Wheat (Rabi) ➔ Summer Moong (Zaid)",
    kvkCenter: "KVK Samrala / Punjab Agricultural University (PAU) Ludhiana",
    dataSourceAttribution: "Punjab Agricultural University (PAU) & Ministry of Agriculture"
  },
  "Karnal": {
    districtName: "Karnal",
    stateName: "Haryana",
    country: "India",
    climate: "Sub-Tropical & Semi-Arid",
    avgRainfall: "700 mm per year",
    tempRange: "5°C – 42°C",
    soilTypes: ["Alluvial Loam", "Slightly Alkaline Loam"],
    irrigationSources: ["Western Yamuna Canal", "Tubewells"],
    majorCrops: ["Wheat", "Basmati Paddy", "Sugarcane", "Mustard"],
    minorCrops: ["Sunflower", "Bajra", "Gram"],
    horticultureCrops: ["Tomato", "Mushroom", "Potato", "Garlic"],
    plantationCrops: ["Poplar & Eucalyptus"],
    livestockInfo: "Murrah Buffaloes (Home of Central Buffalo Research Institute), Sahiwal Cows",
    cropRotation: "Paddy ➔ Wheat ➔ Summer Sunflower / Vegetables",
    kvkCenter: "ICAR-NDRI Karnal / KVK Karnal",
    dataSourceAttribution: "CCS Haryana Agricultural University & ICAR-NDRI"
  },
  "Ujjain": {
    districtName: "Ujjain",
    stateName: "Madhya Pradesh",
    country: "India",
    climate: "Dry Sub-Tropical & Malwa Plateau",
    avgRainfall: "900 mm per year",
    tempRange: "10°C – 42°C",
    soilTypes: ["Deep Black Cotton Soil", "Clayey Regur Soil"],
    irrigationSources: ["Shipra River Channels", "Open Wells", "Tube-wells"],
    majorCrops: ["Soybean", "Wheat (Sharbati)", "Gram / Chickpea", "Garlic"],
    minorCrops: ["Maize", "Mustard", "Lentil"],
    horticultureCrops: ["Garlic (Ooty/Indore variety)", "Onion", "Coriander", "Orange"],
    plantationCrops: ["Mandarin Orange Orchard"],
    livestockInfo: "Malvi Cattle breed, Murrah Buffaloes, Sirohi Goats",
    cropRotation: "Soybean (Kharif) ➔ Wheat / Gram (Rabi) ➔ Summer Vegetables",
    kvkCenter: "KVK Ujjain / RVSKVV Gwalior extension",
    dataSourceAttribution: "ICAR-Indian Institute of Soybean Research & RVSKVV"
  },
  "West Godavari": {
    districtName: "West Godavari",
    stateName: "Andhra Pradesh",
    country: "India",
    climate: "Tropical Coastal & Humid",
    avgRainfall: "1,150 mm per year",
    tempRange: "20°C – 40°C",
    soilTypes: ["Godavari Delta Alluvial", "Black Clay", "Red Sandy Loam"],
    irrigationSources: ["Godavari Canal System", "Borewells", "Aqua Ponds"],
    majorCrops: ["Paddy / Rice", "Sugarcane", "Maize", "Oil Palm"],
    minorCrops: ["Black Gram", "Tobacco", "Chilli"],
    horticultureCrops: ["Banana", "Mango (Banganapalli)", "Cashew", "Cocoa"],
    plantationCrops: ["Oil Palm", "Coconut", "Casuarina"],
    livestockInfo: "Godavari Buffaloes, Brackishwater & Freshwater Aquaculture (Vannamei Shrimp & Rohu Fish)",
    cropRotation: "Paddy (Kharif) ➔ Paddy / Black Gram (Rabi) ➔ Sunhemp",
    kvkCenter: "KVK Undi / Dr. YSR Horticultural University",
    dataSourceAttribution: "ANGRAU & Dr. YSR Horticultural University"
  },
  "Bardhaman": {
    districtName: "Purba Bardhaman",
    stateName: "West Bengal",
    country: "India",
    climate: "Tropical Wet & Dry (Granary of Bengal)",
    avgRainfall: "1,400 mm per year",
    tempRange: "12°C – 38°C",
    soilTypes: ["Gangetic Alluvial Soil", "Red Laterite Soil"],
    irrigationSources: ["DVC Canal System", "Shallow Tube-wells", "Ponds"],
    majorCrops: ["Paddy / Rice (Aman/Boro)", "Jute", "Potato", "Mustard"],
    minorCrops: ["Wheat", "Sesame", "Pulses"],
    horticultureCrops: ["Mango", "Banana", "Guava", "Brinjal"],
    plantationCrops: ["Bamboo groves"],
    livestockInfo: "Bengal Black Goat, Desi Cattle, Inland Freshwater Fishery",
    cropRotation: "Aman Paddy (Monsoon) ➔ Boro Paddy / Potato (Winter) ➔ Sesame (Summer)",
    kvkCenter: "KVK Bud Bud / Bidhan Chandra Krishi Viswavidyalaya",
    dataSourceAttribution: "BCKV & West Bengal Directorate of Agriculture"
  },
  "Anand": {
    districtName: "Anand",
    stateName: "Gujarat",
    country: "India",
    climate: "Tropical Semi-Arid (Charotar Belt)",
    avgRainfall: "800 mm per year",
    tempRange: "14°C – 41°C",
    soilTypes: ["Goradu (Sandy Loam) Soil", "Medium Black Soil"],
    irrigationSources: ["Mahi Canal Network", "Tube-wells"],
    majorCrops: ["Tobacco", "Paddy", "Wheat", "Bajra (Pearl Millet)"],
    minorCrops: ["Castor", "Cotton", "Groundnut"],
    horticultureCrops: ["Banana", "Papaya", "Tomato", "Chilli"],
    plantationCrops: ["Eucalyptus & Bidi Tobacco"],
    livestockInfo: "Kankrej Cattle, Jafrabadi & Surti Buffaloes (Home of Amul Dairy Cooperative)",
    cropRotation: "Paddy / Tobacco ➔ Wheat / Mustard ➔ Bajra / Vegetables",
    kvkCenter: "KVK Anand Agricultural University (AAU)",
    dataSourceAttribution: "Anand Agricultural University (AAU) & Amul Dairy Federation"
  }
};

export function getDistrictProfile(stateName: string, districtName: string): DistrictAgriProfile {
  // Return preloaded profile if exact match
  if (PRELOADED_DISTRICT_PROFILES[districtName]) {
    return PRELOADED_DISTRICT_PROFILES[districtName];
  }

  // Generate an intelligent location-aware profile based on state and geography
  const isSouth = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"].includes(stateName);
  const isNorth = ["Punjab", "Haryana", "Uttar Pradesh", "Himachal Pradesh", "Uttarakhand", "Jammu and Kashmir", "Ladakh", "Delhi", "Chandigarh"].includes(stateName);
  const isWest = ["Gujarat", "Maharashtra", "Rajasthan", "Goa", "Dadra and Nagar Haveli and Daman and Diu"].includes(stateName);
  const isEast = ["West Bengal", "Bihar", "Odisha", "Jharkhand", "Chhattisgarh", "Assam"].includes(stateName);

  let soilTypes = ["Alluvial Loam Soil", "Red Clay Loam", "Medium Black Soil"];
  let majorCrops = ["Paddy / Rice", "Wheat", "Maize / Corn", "Cotton"];
  let minorCrops = ["Black Gram", "Groundnut", "Mustard"];
  let horticultureCrops = ["Mango", "Banana", "Tomato", "Chilli"];
  let plantationCrops = ["Coconut", "Cashew", "Agro-forestry"];
  let climate = "Sub-Tropical Agricultural Climate";
  let avgRainfall = "850 mm - 1,200 mm per year";
  let tempRange = "15°C – 38°C";
  let irrigationSources = ["Tube-wells", "Canal Network", "River Ponds"];
  let livestockInfo = "Crossbred Dairy Cattle, Buffaloes, Goats, Backyard Poultry";
  let cropRotation = "Kharif Crop ➔ Rabi Crop ➔ Summer Fodder / Pulses";

  if (isSouth) {
    soilTypes = ["Red Sandy Loam", "Black Cotton Soil", "Coastal Alluvial"];
    majorCrops = ["Paddy / Rice", "Sugarcane", "Groundnut", "Maize"];
    horticultureCrops = ["Banana", "Coconut", "Mango", "Tapioca"];
    plantationCrops = ["Coconut", "Cashew", "Arecanut"];
    climate = "Tropical Wet & Humid Climate";
    avgRainfall = "950 mm - 1,400 mm per year";
    tempRange = "22°C – 37°C";
    irrigationSources = ["River Canals", "Borewells", "Farm Ponds"];
    cropRotation = "Paddy (Monsoon) ➔ Pulses / Oilseeds (Winter) ➔ Green Manure";
  } else if (isNorth) {
    soilTypes = ["Indo-Gangetic Alluvial Soil", "Clayey Loam", "Sandy Soil"];
    majorCrops = ["Wheat", "Paddy / Rice", "Sugarcane", "Mustard"];
    minorCrops = ["Gram", "Barley", "Maize"];
    horticultureCrops = ["Potato", "Onion", "Tomato", "Peas", "Citrus / Kinnow"];
    plantationCrops = ["Poplar", "Eucalyptus"];
    climate = "Semi-Arid Monsoonal with Cold Winters";
    avgRainfall = "650 mm - 950 mm per year";
    tempRange = "5°C – 42°C";
    irrigationSources = ["Canals", "Deep Tube-wells"];
    cropRotation = "Paddy / Maize (Kharif) ➔ Wheat / Mustard (Rabi) ➔ Summer Moong (Zaid)";
  } else if (isWest) {
    soilTypes = ["Black Basaltic Soil (Regur)", "Sandy Loam", "Goradu Soil"];
    majorCrops = ["Cotton", "Soybean", "Groundnut", "Bajra (Pearl Millet)", "Onion"];
    horticultureCrops = ["Pomegranate", "Grapes", "Citrus", "Tomato", "Guava"];
    plantationCrops = ["Papaya", "Castor"];
    climate = "Semi-Arid & Tropical Dry";
    avgRainfall = "550 mm - 900 mm per year";
    tempRange = "12°C – 41°C";
    irrigationSources = ["Drip Irrigation", "Dams & Canals", "Farm Ponds"];
    cropRotation = "Cotton / Soybean (Kharif) ➔ Wheat / Onion (Rabi) ➔ Summer Bajra";
  } else if (isEast) {
    soilTypes = ["Gangetic Alluvial Soil", "Red Laterite Soil", "Clay Loam"];
    majorCrops = ["Paddy / Rice", "Jute", "Maize", "Mustard"];
    minorCrops = ["Lentil", "Sesame", "Black Gram"];
    horticultureCrops = ["Mango", "Banana", "Brinjal", "Pointed Gourd"];
    plantationCrops = ["Tea Groves", "Bamboo"];
    climate = "Humid Tropical & Sub-Humid";
    avgRainfall = "1,200 mm - 1,800 mm per year";
    tempRange = "14°C – 36°C";
    irrigationSources = ["Canals", "Shallow Tube-wells", "River Pumping"];
    cropRotation = "Kharif Paddy ➔ Rabi Potato / Mustard ➔ Zaid Vegetables / Sesame";
  }

  return {
    districtName,
    stateName,
    country: "India",
    climate,
    avgRainfall,
    tempRange,
    soilTypes,
    irrigationSources,
    majorCrops,
    minorCrops,
    horticultureCrops,
    plantationCrops,
    livestockInfo,
    cropRotation,
    kvkCenter: `District Krishi Vigyan Kendra (KVK ${districtName})`,
    dataSourceAttribution: "ICAR-ATARI & Ministry of Agriculture & Farmers Welfare, Govt of India"
  };
}

export const PRELOADED_CROP_DATABASE: DetailedCropInfo[] = [
  {
    cropName: "Paddy / Rice (Oryza sativa)",
    imageUrl: "rice",
    description: "Paddy is India's principal cereal crop grown widely in monsoon season across river basins and delta districts. Requires high moisture and standing water.",
    suitableSoil: "Clayey loam, alluvial soil, or black clay soil with high water holding capacity.",
    suitableClimate: "Warm tropical & humid climate (20°C - 38°C) with abundant water.",
    bestSowingMonths: "June – July (Kharif) / November – December (Rabi/Boro)",
    growingSeason: "Kharif & Rabi (Boro)",
    cropDuration: "115 – 140 Days",
    waterRequirement: "High (1,200 mm - 1,500 mm total requirement across crop lifecycle)",
    fertilizerSchedule: [
      "Basal: 5 tonnes Farm Yard Manure (FYM) + 50kg DAP + 25kg Potash per Acre.",
      "Week 3 (Tillering): Topdress 35kg Urea + 10kg Zinc Sulphate per Acre.",
      "Week 7 (Panicle Initiation): Topdress 30kg Urea + 15kg Potash per Acre."
    ],
    organicFarmingTips: [
      "Apply Azospirillum & Phosphobacteria bio-fertilizers (2kg/acre) mixed with vermicompost.",
      "Use System of Rice Intensification (SRI) technique to save 40% water and increase yield.",
      "Spray 5% Neem Seed Kernel Extract (NSKE) at early booting stage."
    ],
    commonPests: ["Yellow Stem Borer", "Leaf Folder", "Brown Plant Hopper (BPH)", "Gall Midge"],
    commonDiseases: ["Rice Blast (Fungal)", "Bacterial Leaf Blight (BLB)", "Sheath Blight"],
    diseasePrevention: [
      "Treat seeds with Trichoderma viride (10g/kg seed) before sowing.",
      "Spray Neem Oil (15ml/Liter) or Pseudomonas fluorescens (10g/L) for leaf spots.",
      "Avoid excess nitrogenous fertilizers to reduce BPH insect attack."
    ],
    harvestTime: "When 80-85% of panicles turn golden yellow.",
    storageMethods: "Sun-dry harvested grains to 12% moisture content. Store in hermetic bags or metal bins with neem leaves.",
    expectedYield: "20 – 28 Quintals per Acre",
    averageMarketPrice: "₹2,183 – ₹2,450 per Quintal (MSP aligned)",
    expectedProfit: "₹28,000 – ₹42,000 per Acre",
    governmentSchemes: "PM Kisan Samman Nidhi, Subsidized Certified Seeds, PM Fasal Bima Yojana (PMFBY), Subsidized Urea & DAP.",
    cultivationGuide: "Paddy cultivation starts with seed bed nursery preparation. Transplant 21-day old seedlings at 20x15 cm spacing. Maintain 3-5 cm standing water during panicle formation. Drain field 10 days before harvest.",
    suitabilityScore: "95% (High Suitability)",
    profitPotential: "High & Stable Commercial Return",
    marketDemand: "Constant High Market Demand (National & Export)",
    cultivationCost: "₹18,000 – ₹24,000 per Acre",
    estimatedIncome: "₹48,000 – ₹65,000 per Acre",
    varieties: ["IR64", "Pusa Basmati 1121", "Swarna (MTU 7029)", "Telangana Sona (RNT 3888)", "CR Dhan 304"]
  },
  {
    cropName: "Wheat (Triticum aestivum)",
    imageUrl: "wheat",
    description: "Wheat is the premier Rabi winter cereal crop in Northern & Central India. Highly nutritious, staple food with guaranteed government MSP procurement.",
    suitableSoil: "Well-drained fertile clay loam, alluvial loam, or deep black soil.",
    suitableClimate: "Cool winter climate (10°C - 25°C) during vegetative growth and warm sunny harvest.",
    bestSowingMonths: "November 1 to November 25 (Ideal Rabi sowing window)",
    growingSeason: "Rabi (Winter)",
    cropDuration: "120 – 135 Days",
    waterRequirement: "Moderate (400 mm - 500 mm; 5 to 6 critical irrigations)",
    fertilizerSchedule: [
      "Basal: Apply 50kg DAP + 20kg MOP (Potash) per Acre during land prep.",
      "First Irrigation (21 days / CRI Stage): Topdress 45kg Urea + 10kg Zinc.",
      "Second Irrigation (45 days / Jointing): Topdress 35kg Urea per Acre."
    ],
    organicFarmingTips: [
      "Incorporate Jeevamrut or Panchagavya with irrigation water every 20 days.",
      "Inoculate seeds with Azotobacter & PSB bio-fertilizers.",
      "Practice zero-tillage sowing with Happy Seeder to preserve soil moisture."
    ],
    commonPests: ["Termites (Gurjo)", "Aphids (Mahu)", "Armyworm"],
    commonDiseases: ["Yellow Rust (Puccinia striiformis)", "Brown Rust", "Loose Smut"],
    diseasePrevention: [
      "Use rust-resistant certified seed varieties (e.g., HD 2967, DBW 187).",
      "Treat seed with Carboxin or Trichoderma before sowing.",
      "Spray Propiconazole 25% EC (1ml/L) at first sign of yellow rust spots."
    ],
    harvestTime: "March – April when grains turn dry and hard.",
    storageMethods: "Clean and dry grain to under 10% moisture. Store in dry Pusa bins or metallic silos with celphos/neem tablet protection.",
    expectedYield: "18 – 24 Quintals per Acre",
    averageMarketPrice: "₹2,275 – ₹2,500 per Quintal",
    expectedProfit: "₹25,000 – ₹38,000 per Acre",
    governmentSubsidies: "PM-Kisan, Subsidized Seeds from State Seed Corp, 50% Subsidy on Happy Seeder & Zero-Till Drills.",
    cultivationGuide: "Prepare fine seed bed by 2 ploughings. Sow seeds at 40kg/acre at 5 cm depth with 20 cm row spacing. Irrigate critically at CRI stage (21 days post sowing).",
    suitabilityScore: "94% (Excellent for Rabi)",
    profitPotential: "High Assured Revenue",
    marketDemand: "Extremely High (Government Mandi Procurement)",
    cultivationCost: "₹14,000 – ₹18,000 per Acre",
    estimatedIncome: "₹42,000 – ₹58,000 per Acre",
    varieties: ["HD 2967", "DBW 187 (Karan Vandana)", "HD 3086 (Pusa Gautami)", "Sharbati C-306", "PBW 725"]
  },
  {
    cropName: "Cotton (Gossypium hirsutum)",
    imageUrl: "cotton",
    description: "Cotton is 'White Gold', India's major industrial textile cash crop grown in Kharif season in black and alluvial soil belts.",
    suitableSoil: "Deep black cotton soil (Regur), clay loam, or well-drained alluvial soil.",
    suitableClimate: "Warm sub-tropical climate (21°C - 35°C) with long frost-free days.",
    bestSowingMonths: "May – June (Pre-monsoon / early monsoon)",
    growingSeason: "Kharif (Long duration)",
    cropDuration: "150 – 170 Days",
    waterRequirement: "Moderate to High (650 mm - 800 mm)",
    fertilizerSchedule: [
      "Basal: 5 tonnes compost + 40kg DAP + 20kg MOP per Acre.",
      "30 Days (Square initiation): 30kg Urea top dressing.",
      "60 Days (Flowering): 30kg Urea + 15kg MOP for boll development."
    ],
    organicFarmingTips: [
      "Install 8 Pheromone Traps per acre to monitor Pink Bollworm moths.",
      "Plant border rows of Maize or Sorghum as trap crops for sucking pests.",
      "Spray 5% Neem Seed Kernel Extract (NSKE) every 15 days."
    ],
    commonPests: ["Pink Bollworm", "American Bollworm", "Whitefly", "Aphids & Thrips"],
    commonDiseases: ["Cotton Leaf Curl Virus (CLCuV)", "Root Rot", "Bacterial Blight"],
    diseasePrevention: [
      "Sow certified Bt-Cotton hybrids approved for your zone.",
      "Control whitefly vectors using yellow sticky traps (15 traps/acre).",
      "Apply Trichoderma viride in soil during sowing."
    ],
    harvestTime: "September to December in 3 to 4 picking rounds as bolls burst open.",
    storageMethods: "Store clean seed cotton (Kapas) in dry, well-ventilated godowns free from dampness.",
    expectedYield: "8 – 14 Quintals per Acre",
    averageMarketPrice: "₹6,620 – ₹7,500 per Quintal",
    expectedProfit: "₹35,000 – ₹55,000 per Acre",
    governmentSubsidies: "Cotton Corporation of India (CCI) Minimum Support Price procurement, Subsidized Drip Irrigation under PMKSY.",
    cultivationGuide: "Sow seeds at 90x60 cm or 120x45 cm spacing depending on variety. Keep field weed-free during first 60 days. Monitor bolls closely for bollworm entry.",
    suitabilityScore: "90% (High Commercial Value)",
    profitPotential: "Very High Returns",
    marketDemand: "High Textile Industry Demand",
    cultivationCost: "₹22,000 – ₹28,000 per Acre",
    estimatedIncome: "₹58,000 – ₹82,000 per Acre",
    varieties: ["Bt Cotton RCH-2", "Ankur 3028", "US-71", "MCU-5", "Suraj"]
  },
  {
    cropName: "Groundnut / Peanut (Arachis hypogaea)",
    imageUrl: "peanut",
    description: "Groundnut is an important oilseed and food legume crop. It enriches soil nitrogen naturally while providing high oil content and marketable pods.",
    suitableSoil: "Well-drained sandy loam, light loose loam, or red sandy soil.",
    suitableClimate: "Warm climate (22°C - 32°C) with moderate rainfall.",
    bestSowingMonths: "June – July (Kharif) / November – December (Rabi/Summer)",
    growingSeason: "Kharif & Rabi/Summer",
    cropDuration: "105 – 120 Days",
    waterRequirement: "Low to Moderate (450 mm - 600 mm)",
    fertilizerSchedule: [
      "Basal: 100kg Gypsum + 50kg Single Super Phosphate (SSP) + 15kg Urea per Acre.",
      "35 Days (Pegging stage): Topdress 100kg Gypsum per Acre for seed hardening."
    ],
    organicFarmingTips: [
      "Treat seeds with Rhizobium culture (200g/acre seed) for enhanced nitrogen fixation.",
      "Dust wood ash over damp leaves in early morning to prevent leaf miners.",
      "Apply bio-fertilizer VAM (Vesicular Arbuscular Mycorrhiza) for root strength."
    ],
    commonPests: ["Red Hairy Caterpillar", "Groundnut Leaf Miner", "White Grub"],
    commonDiseases: ["Tikka Leaf Spot (Cercospora)", "Collar Rot", "Peanut Clump Virus"],
    diseasePrevention: [
      "Seed treatment with Trichoderma (10g/kg seed) prevents collar rot.",
      "Spray sour buttermilk solution (1:10 ratio with water) for Tikka leaf spot.",
      "Keep soil loose around plant base during peg entry stage."
    ],
    harvestTime: "When leaves turn yellow and inner pod shells develop dark brown markings.",
    storageMethods: "Dry pods in sun until moisture drops below 8%. Store pods in gunny bags stacked on wooden pallets.",
    expectedYield: "9 – 14 Quintals per Acre",
    averageMarketPrice: "₹6,375 – ₹7,200 per Quintal",
    expectedProfit: "₹32,000 – ₹48,000 per Acre",
    governmentSubsidies: "National Mission on Edible Oils - Oilseeds (NMEO-OS), Subsidized Gypsum & Bio-fertilizers.",
    cultivationGuide: "Sow seeds at 30x10 cm spacing at 5 cm depth. Ensure soil is soft and uncompacted during pegging stage so pegs penetrate soil easily.",
    suitabilityScore: "92% (Excellent Oilseed)",
    profitPotential: "High Net Returns",
    marketDemand: "High Demand for Edible Oil & Snack Industry",
    cultivationCost: "₹14,000 – ₹18,000 per Acre",
    estimatedIncome: "₹50,000 – ₹68,000 per Acre",
    varieties: ["Kadiri-6 (K6)", "TG 37A", "JL 24 (Phule Pragati)", "GJG 22", "Dharani"]
  },
  {
    cropName: "Maize / Corn (Zea mays)",
    imageUrl: "maize",
    description: "Maize is the 'Queen of Cereals', versatile as food, poultry feed, and industrial starch. Grows rapidly across Kharif, Rabi, and summer seasons.",
    suitableSoil: "Deep fertile well-drained loam or alluvial soil rich in organic matter.",
    suitableClimate: "Warm sunny climate (18°C - 35°C). Sensitivity to frost and waterlogging.",
    bestSowingMonths: "June – July (Kharif) / October – November (Rabi)",
    growingSeason: "Kharif, Rabi & Zaid",
    cropDuration: "95 – 115 Days",
    waterRequirement: "Moderate (500 mm - 600 mm)",
    fertilizerSchedule: [
      "Basal: 50kg DAP + 20kg MOP + 10kg Zinc Sulphate per Acre.",
      "Knee-high stage (30 days): Topdress 35kg Urea.",
      "Tasseling stage (55 days): Topdress 25kg Urea."
    ],
    organicFarmingTips: [
      "Apply Metarhizium anisopliae or Beauveria bassiana for Fall Armyworm larvae.",
      "Intercrop with Cowpea or Groundnut to reduce weed competition and increase nitrogen.",
      "Apply sand + neem cake mixture into central leaf whorls."
    ],
    commonPests: ["Fall Armyworm (FAW)", "Stem Borer", "Corn Earworm"],
    commonDiseases: ["Maydis Leaf Blight", "Turcicum Blight", "Charcoal Rot"],
    diseasePrevention: [
      "Apply Emamectin Benzoate 5% SG (0.4g/L) into plant whorls at first sign of FAW scratch marks.",
      "Sow high-yielding FAW tolerant hybrid seeds.",
      "Maintain clean field borders to reduce pest harbor."
    ],
    harvestTime: "When cob husk turns brown and dried seeds become hard.",
    storageMethods: "Sun dry cobs to 12% moisture. Shell and store dried grains in airtight bags.",
    expectedYield: "22 – 32 Quintals per Acre",
    averageMarketPrice: "₹2,090 – ₹2,350 per Quintal",
    expectedProfit: "₹26,000 – ₹40,000 per Acre",
    governmentSubsidies: "Subsidized Hybrid Seeds, National Food Security Mission (NFSM) Maize incentives.",
    cultivationGuide: "Sow seeds at 60x20 cm spacing at 4 cm depth (7-8 kg seed/acre). Keep whorls clean and apply fertilizer in splits.",
    suitabilityScore: "93% (Highly Versatile)",
    profitPotential: "Stable Profit",
    marketDemand: "High Poultry Feed & Ethanol Industry Demand",
    cultivationCost: "₹15,000 – ₹19,000 per Acre",
    estimatedIncome: "₹45,000 – ₹62,000 per Acre",
    varieties: ["Pioneer 3355", "DKC 9081", "NM-54", "HQPM 1 (Quality Protein Maize)", "Bio 9681"]
  },
  {
    cropName: "Sugarcane (Saccharum officinarum)",
    imageUrl: "sugarcane",
    description: "Sugarcane is India's principal perennial sugar and ethanol commercial crop. Long-duration cash crop offering heavy tonnage and secure sugar mill returns.",
    suitableSoil: "Deep clay loam, heavy black soil, or alluvial soil with high moisture retention.",
    suitableClimate: "Warm tropical climate (20°C - 38°C) with sunny weather during ripening.",
    bestSowingMonths: "October – November (Autumn) / February – March (Spring)",
    growingSeason: "Perennial / Annual (10 to 14 Months)",
    cropDuration: "300 – 360 Days",
    waterRequirement: "Very High (1,800 mm - 2,200 mm; 25-30 irrigations)",
    fertilizerSchedule: [
      "Basal: 10 tonnes FYM + 75kg SSP + 30kg MOP per Acre.",
      "45 Days: Topdress 45kg Urea + 10kg Zinc.",
      "90 Days (Earthing up): Topdress 50kg Urea + 25kg MOP."
    ],
    organicFarmingTips: [
      "Release Trichogramma chilonis egg parasitoids (2 cards/acre) against shoot borers.",
      "Apply trash mulching between cane rows to preserve moisture and suppress weeds.",
      "Apply Pressmud compost from sugar factories to boost soil organic carbon."
    ],
    commonPests: ["Early Shoot Borer", "Top Borer", "Pyrilla", "Whitefly"],
    commonDiseases: ["Red Rot (Colletotrichum falcatum)", "Smut", "Wilt"],
    diseasePrevention: [
      "Select disease-free two-eyed or three-eyed setts from certified nurseries.",
      "Treat setts in hot water (50°C for 2 hours) or Carbendazim solution before planting.",
      "Avoid planting susceptible varieties in waterlogged patches."
    ],
    harvestTime: "11 to 12 months when lower leaves dry up and cane juice brix reaches 18-20%.",
    storageMethods: "Transport harvested canes directly to sugar mill within 24 hours to prevent sugar inversion.",
    expectedYield: "350 – 500 Quintals (35 - 50 Tonnes) per Acre",
    averageMarketPrice: "₹315 – ₹340 per Quintal (FRP Government rate)",
    expectedProfit: "₹65,000 – ₹1,10,000 per Acre",
    governmentSubsidies: "Fair & Remunerative Price (FRP) guarantee, Subsidized Drip Systems (80% subsidy under PMKSY).",
    cultivationGuide: "Plant 2-eyed setts in furrows 90 cm apart (35,000 setts/acre). Perform earthing up at 90 days to prevent lodging.",
    suitabilityScore: "91% (High Perennial Profit)",
    profitPotential: "Very High Guaranteed Mill Return",
    marketDemand: "Sugar Mills & Ethanol Biofuel Blending Demand",
    cultivationCost: "₹45,000 – ₹55,000 per Acre",
    estimatedIncome: "₹1,15,000 – ₹1,65,000 per Acre",
    varieties: ["Co 0238 (Karan 4)", "Co 86032 (Nayana)", "Co 11015", "CoPk 051", "Co 0118"]
  },
  {
    cropName: "Tomato (Solanum lycopersicum)",
    imageUrl: "tomato",
    description: "Tomato is a high-value commercial vegetable crop grown across regions. Short duration with frequent pickings offering high daily income.",
    suitableSoil: "Well-drained red sandy loam, alluvial soil, or silt loam with pH 6.0 - 7.0.",
    suitableClimate: "Warm climate (18°C - 30°C). Sensitive to frost and extreme rain.",
    bestSowingMonths: "June – July (Kharif) / October – November (Rabi) / Feb (Summer)",
    growingSeason: "Kharif, Rabi & Summer",
    cropDuration: "120 – 150 Days (Harvest starts from 60 days)",
    waterRequirement: "Moderate (600 mm - 800 mm; Drip irrigation recommended)",
    fertilizerSchedule: [
      "Basal: 10 tonnes FYM + 50kg DAP + 30kg MOP + 10kg Micronutrient mix per Acre.",
      "Fertigation / Topdress: 19-19-19 NPK (3kg/acre weekly) during flowering & fruiting."
    ],
    organicFarmingTips: [
      "Erect bamboo staking and plastic twine trellis to keep fruits off damp soil.",
      "Spray Panchagavya (3% solution) every 15 days to enhance fruit shine and weight.",
      "Plant Marigold flower borders to attract fruit borer predators and trap nematodes."
    ],
    commonPests: ["Tomato Fruit Borer (Helicoverpa)", "Whitefly", "Leaf Miner", "Nematodes"],
    commonDiseases: ["Tomato Leaf Curl Virus (ToLCV)", "Early Blight", "Bacterial Wilt"],
    diseasePrevention: [
      "Grow ToLCV resistant hybrid varieties (e.g., Arka Rakshak, Shivam).",
      "Install blue and yellow sticky traps (20 traps/acre) to catch vector flies.",
      "Spray Copper Oxychloride (2.5g/L) for early leaf blight."
    ],
    harvestTime: "Pick fruits at breaker stage (pinkish green) for distant markets or red ripe for local mandis.",
    storageMethods: "Store in cool ventilated plastic crates at 12°C - 15°C.",
    expectedYield: "180 – 280 Quintals (18 - 28 Tonnes) per Acre",
    averageMarketPrice: "₹1,200 – ₹3,500 per Quintal (Fluctuates based on market demand)",
    expectedProfit: "₹60,000 – ₹1,40,000 per Acre",
    governmentSubsidies: "Mission for Integrated Development of Horticulture (MIDH), Drip Irrigation 80% Subsidy, Cold Chain support.",
    cultivationGuide: "Transplant 25-day nursery seedlings at 60x45 cm spacing on raised beds with 25-micron mulching paper. Trellis plants at 30 days.",
    suitabilityScore: "89% (High Cash Flow Vegetable)",
    profitPotential: "Very High Return Potential",
    marketDemand: "Constant Universal Kitchen & Processing Demand",
    cultivationCost: "₹35,000 – ₹50,000 per Acre",
    estimatedIncome: "₹1,00,000 – ₹1,90,000 per Acre",
    varieties: ["Arka Rakshak", "Arka Samrat", "Shivam Hybrid (Syngenta)", "Abhinav", "Heemsohna"]
  },
  {
    cropName: "Mustard / Rapeseed (Brassica juncea)",
    imageUrl: "mustard",
    description: "Mustard is the premier winter oilseed crop of Northern & Central India. Low water requirement, minimal pest risk, and high oil realization.",
    suitableSoil: "Loamy to sandy loam soil with good drainage.",
    suitableClimate: "Cool dry winter climate (10°C - 25°C).",
    bestSowingMonths: "October 1 to October 25 (Ideal Rabi sowing time)",
    growingSeason: "Rabi (Winter)",
    cropDuration: "110 – 125 Days",
    waterRequirement: "Low (250 mm - 350 mm; 2 critical irrigations)",
    fertilizerSchedule: [
      "Basal: 30kg DAP + 20kg MOP + 15kg Elemental Sulphur per Acre.",
      "First Irrigation (30 days / Flowering): Topdress 30kg Urea."
    ],
    organicFarmingTips: [
      "Sulphur is critical for mustard oil content; apply organic Gypsum or Bio-Sulphur.",
      "Spray garlic-chilli extract solution if aphids attack in cold humid weather.",
      "Encourage honeybee hives near fields to increase cross-pollination yield by 20%."
    ],
    commonPests: ["Mustard Aphid (Mahu)", "Sawfly"],
    commonDiseases: ["Alternaria Blight", "White Rust", "Downy Mildew"],
    diseasePrevention: [
      "Sow early in October to avoid peak aphid population in January.",
      "Spray Neem Oil 10,000 ppm (2ml/L) or Dimethoate 30% EC at first aphid appearance.",
      "Treat seeds with Metalaxyl (3g/kg seed) for white rust."
    ],
    harvestTime: "When 75% of siliquae (pods) turn golden yellow.",
    storageMethods: "Sun dry seeds to 8% moisture. Store in clean dry gunny bags in cool dry godown.",
    expectedYield: "7 – 11 Quintals per Acre",
    averageMarketPrice: "₹5,650 – ₹6,400 per Quintal",
    expectedProfit: "₹24,000 – ₹38,000 per Acre",
    governmentSubsidies: "Oilseeds Mission seed minikits, MSP guaranteed procurement by NAFED.",
    cultivationGuide: "Sow seeds at 1.5 - 2 kg/acre at 30x10 cm spacing. Provide first irrigation at 30 days (flowering) and second at pod formation.",
    suitabilityScore: "93% (Low Water Winter Winner)",
    profitPotential: "Solid Low-Cost Profit",
    marketDemand: "High Domestic Edible Oil Demand",
    cultivationCost: "₹8,000 – ₹12,000 per Acre",
    estimatedIncome: "₹35,000 – ₹50,000 per Acre",
    varieties: ["Pusa Bold", "RH 749", "NRCHB 101", "Giriraj (DRMRI 150-35)", "Pusa Mustard 30"]
  }
];
