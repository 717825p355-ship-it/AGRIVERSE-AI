export interface GovernmentScheme {
  id: string;
  name: string;
  shortCode: string;
  category: 'central' | 'state';
  ministry: string;
  officialWebsite: string;
  helpline: string;
  badge: string;
  description: string;
  benefits: string;
  maxFinancialValue: number; // In INR for benefit calculation
  eligibilityCriteria: {
    landSizeMax?: number; // In acres
    landSizeMin?: number;
    maxIncome?: number;
    crops?: string[];
    farmingType?: ('organic' | 'conventional' | 'both')[];
    irrigationRequired?: string[];
    categoryTarget?: string[];
    machineryNeeded?: string[];
    livestockNeeded?: string[];
  };
  eligibilitySummary: string;
  requiredDocuments: string[];
  applicationDeadline: string;
  howToApply: string;
  subsidiesType: string[]; // e.g. ['Seed Subsidy', 'Solar Pump', 'Drip Irrigation', etc.]
  targetStates?: string[]; // If state specific, e.g. ['Tamil Nadu']
  iconName: string;
  bannerImage: string;
}

export const CENTRAL_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    shortCode: 'PM-KISAN',
    category: 'central',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    officialWebsite: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    badge: 'Verified Central Scheme',
    description: 'Income support scheme providing direct financial assistance to all landholding farmers families across India.',
    benefits: '₹6,000 per year transferred directly to bank account in 3 equal installments of ₹2,000 every 4 months.',
    maxFinancialValue: 6000,
    eligibilityCriteria: {
      landSizeMax: 100,
      farmingType: ['organic', 'conventional', 'both']
    },
    eligibilitySummary: 'All small, marginal, and landholding farmer families having cultivable land in their name.',
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Record (Khatauni/Patta)', 'Bank Account Passbook (Aadhaar Seeded)', 'Active Mobile Number'],
    applicationDeadline: 'Ongoing Registration (Next 17th Installment)',
    howToApply: 'Register online at pmkisan.gov.in using Farmers Corner or visit nearest CSC / District Agriculture Office.',
    subsidiesType: ['Income Support', 'Cash Transfer'],
    iconName: 'Coins',
    bannerImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    shortCode: 'PMFBY',
    category: 'central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialWebsite: 'https://pmfby.gov.in',
    helpline: '1800-180-1551',
    badge: 'Verified Insurance Scheme',
    description: 'Comprehensive crop insurance covering risk from non-preventable natural risks from pre-sowing to post-harvest.',
    benefits: 'Comprehensive financial support against crop loss due to drought, flood, pests, and cyclones. Premium as low as 1.5% - 2%.',
    maxFinancialValue: 50000,
    eligibilityCriteria: {
      farmingType: ['organic', 'conventional', 'both']
    },
    eligibilitySummary: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    requiredDocuments: ['Aadhaar Card', 'Land Sowing Certificate / Chitta', 'Bank Passbook', 'Crop Sowing Declaration'],
    applicationDeadline: '31st July for Kharif / 31st December for Rabi',
    howToApply: 'Apply via PMFBY portal, NCIP App, Bank branch, or Common Service Centre (CSC).',
    subsidiesType: ['Crop Insurance', 'Risk Mitigation'],
    iconName: 'ShieldAlert',
    bannerImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pmksy',
    name: 'PM Krishi Sinchayee Yojana (PMKSY)',
    shortCode: 'PMKSY',
    category: 'central',
    ministry: 'Ministry of Jal Shakti & Agriculture',
    officialWebsite: 'https://pmksy.gov.in',
    helpline: '1800-11-5559',
    badge: 'Per Drop More Crop',
    description: 'Micro-irrigation and precision water-saving scheme focusing on Drip and Sprinkler irrigation installation.',
    benefits: '55% to 80% subsidy on installation of Drip & Sprinkler irrigation systems for small and marginal farmers.',
    maxFinancialValue: 45000,
    eligibilityCriteria: {
      irrigationRequired: ['Borewell / Groundwater', 'Canal Irrigation System', 'Rainfed Only (Monsoon Dependent)', 'Drip / Micro-Irrigation Setup', 'River / Lake Water Pump']
    },
    eligibilitySummary: 'All farmers owning agricultural land with a reliable water source (borewell, canal, or farm pond).',
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Records (7/12, Patta)', 'Electricity Connection Bill / Water Source Proof', 'Bank Passbook'],
    applicationDeadline: 'Open Year-Round',
    howToApply: 'Submit application at Block Agriculture Office or Assistant Executive Engineer (Agricultural Engineering).',
    subsidiesType: ['Drip Irrigation Subsidy', 'Sprinkler Subsidy', 'Water Saving'],
    iconName: 'Droplets',
    bannerImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    shortCode: 'SHC',
    category: 'central',
    ministry: 'Department of Agriculture & Farmers Welfare',
    officialWebsite: 'https://soilhealth.dac.gov.in',
    helpline: '1800-180-1551',
    badge: 'Free Soil Testing',
    description: 'Free soil testing service providing macronutrient, micronutrient, and organic carbon analysis with custom fertilizer advice.',
    benefits: 'Free testing of 12 soil parameters every 2 years with customized crop-wise fertilizer dosage recommendations.',
    maxFinancialValue: 1500,
    eligibilityCriteria: {},
    eligibilitySummary: 'Every farmer across all Indian States and Union Territories.',
    requiredDocuments: ['Aadhaar Card', 'Soil Sample details', 'Survey Number'],
    applicationDeadline: 'Ongoing Sample Collection Cycle',
    howToApply: 'Contact local Agriculture Extension Officer or visit nearest Krishi Vigyan Kendra (KVK) soil testing lab.',
    subsidiesType: ['Soil Testing', 'Organic Farming Subsidy'],
    iconName: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'enam',
    name: 'e-NAM (National Agriculture Market)',
    shortCode: 'e-NAM',
    category: 'central',
    ministry: 'Ministry of Agriculture',
    officialWebsite: 'https://www.enam.gov.in',
    helpline: '1800-270-0224',
    badge: 'Pan-India Trade',
    description: 'Pan-India electronic trading portal connecting existing APMC mandis to create a unified national market for agricultural commodities.',
    benefits: 'Direct access to nationwide buyers, transparent online bidding, real-time price discovery, and direct online bank payments.',
    maxFinancialValue: 12000,
    eligibilityCriteria: {},
    eligibilitySummary: 'All individual farmers, Farmer Producer Organizations (FPOs), traders, and commission agents.',
    requiredDocuments: ['Aadhaar Card', 'Bank Passbook', 'Mandi Registration / Gate Pass'],
    applicationDeadline: 'Permanent Digital Portal',
    howToApply: 'Download e-NAM Mobile App or register at local e-NAM enabled APMC Mandi counter.',
    subsidiesType: ['Market Access', 'Transparent Bidding'],
    iconName: 'Building2',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agri-infra-fund',
    name: 'Agriculture Infrastructure Fund (AIF)',
    shortCode: 'AIF',
    category: 'central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialWebsite: 'https://agriinfra.dac.gov.in',
    helpline: '011-23382012',
    badge: 'Infrastructure Loan',
    description: 'Medium to long term debt financing facility for investment in post-harvest management infrastructure and community farming assets.',
    benefits: '3% per annum interest subvention on loans up to ₹2 Crores with credit guarantee coverage under CGTMSE for up to 7 years.',
    maxFinancialValue: 200000,
    eligibilityCriteria: {
      machineryNeeded: ['Tractor', 'Harvester', 'Cold Storage', 'Warehouse', 'None']
    },
    eligibilitySummary: 'Farmers, FPOs, Agri-entrepreneurs, Startups, Primary Agricultural Credit Societies (PACS).',
    requiredDocuments: ['Aadhaar Card', 'Detailed Project Report (DPR)', 'Land Ownership / Lease Agreement', 'Bank Statement'],
    applicationDeadline: 'Open till 2032-33',
    howToApply: 'Apply online on AgriInfra Portal (agriinfra.dac.gov.in) with DPR and select preferred bank branch.',
    subsidiesType: ['Cold Storage', 'Warehouse', 'Farm Machinery Subsidy'],
    iconName: 'Building2',
    bannerImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nmsa',
    name: 'National Mission on Sustainable Agriculture (NMSA)',
    shortCode: 'NMSA',
    category: 'central',
    ministry: 'Ministry of Agriculture',
    officialWebsite: 'https://nmsa.dac.gov.in',
    helpline: '011-23383540',
    badge: 'Climate Smart Farming',
    description: 'Promotes climate-resilient farming, rainfed area development, integrated farming systems, and soil health management.',
    benefits: 'Up to ₹50,000 per hectare assistance for Integrated Farming Systems (IFS), vermicomposting, and climate adaptation.',
    maxFinancialValue: 50000,
    eligibilityCriteria: {},
    eligibilitySummary: 'Farmers operating in rainfed and climate-vulnerable agricultural districts.',
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
    applicationDeadline: 'Annual State Action Plans',
    howToApply: 'Submit application to District Collectorate / Joint Director of Agriculture.',
    subsidiesType: ['Climate Smart Farming', 'Farm Pond Subsidy'],
    iconName: 'Sun',
    bannerImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    shortCode: 'PKVY',
    category: 'central',
    ministry: 'Ministry of Agriculture',
    officialWebsite: 'https://pgsindia-ncof.gov.in',
    helpline: '1800-180-1551',
    badge: '100% Organic Farming',
    description: 'Promotes commercial organic farming through cluster approach and Participatory Guarantee System (PGS) certification.',
    benefits: 'Financial assistance of ₹50,000 per hectare over 3 years, of which ₹31,000 is given directly for organic inputs (seeds, bio-fertilizers).',
    maxFinancialValue: 50000,
    eligibilityCriteria: {
      farmingType: ['organic', 'both']
    },
    eligibilitySummary: 'Farmer clusters formed with a minimum of 20 or more farmers holding contiguous land of 50 acres.',
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'PGS-India Cluster Registration Form', 'Bank Passbook'],
    applicationDeadline: 'Cluster Formation Cycle',
    howToApply: 'Form a local farmer cluster and register through Regional Council / District Agriculture Officer.',
    subsidiesType: ['Organic Farming Subsidy', 'Bio-Fertilizer Subsidy'],
    iconName: 'Leaf',
    bannerImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rkvy',
    name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    shortCode: 'RKVY',
    category: 'central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialWebsite: 'https://rkvy.nic.in',
    helpline: '011-23382713',
    badge: 'Holistic Development',
    description: 'State-flexible funding program promoting agriculture development, post-harvest infrastructure, and agri-entrepreneurship.',
    benefits: '50% to 75% subsidy for custom hiring centers, crop processing units, seed multiplication, and agri-business incubation funding up to ₹25 Lakhs.',
    maxFinancialValue: 75000,
    eligibilityCriteria: {},
    eligibilitySummary: 'Individual farmers, Agri-preneurs, FPOs, and Self Help Groups (SHGs).',
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Project Proposal'],
    applicationDeadline: 'State Nodal Officer Schedule',
    howToApply: 'Contact State Agriculture Department or Joint Director of Agriculture.',
    subsidiesType: ['Seed Subsidy', 'Horticulture Subsidy', 'Farm Machinery Subsidy'],
    iconName: 'Award',
    bannerImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'smam',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    shortCode: 'SMAM',
    category: 'central',
    ministry: 'Department of Agriculture, Cooperation & Farmers Welfare',
    officialWebsite: 'https://farmech.dac.gov.in',
    helpline: '1800-180-1551',
    badge: '40%-80% Machinery Subsidy',
    description: 'Promotes farm mechanization by providing direct subsidies on tractors, rotavators, power tillers, sprayers, and drones.',
    benefits: '40% to 50% subsidy for individual farmers and 80% subsidy for setting up Custom Hiring Centres (CHCs).',
    maxFinancialValue: 120000,
    eligibilityCriteria: {},
    eligibilitySummary: 'All farmers, with priority given to Small & Marginal farmers, SC/ST, and Women farmers.',
    requiredDocuments: ['Aadhaar Card', 'Land Record (Chitta/7-12)', 'Bank Passbook', 'Caste / Category Certificate (if SC/ST)', 'Quotation from Authorized Machinery Dealer'],
    applicationDeadline: 'Annual Portal Window (May to Nov)',
    howToApply: 'Apply online on Agri-Machinery Portal (farmech.dac.gov.in) and upload dealer quotation.',
    subsidiesType: ['Farm Machinery Subsidy', 'Tractor Subsidy', 'Sprinkler Subsidy'],
    iconName: 'Truck',
    bannerImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'midh',
    name: 'Mission for Integrated Development of Horticulture (MIDH)',
    shortCode: 'MIDH',
    category: 'central',
    ministry: 'Ministry of Agriculture',
    officialWebsite: 'https://midh.gov.in',
    helpline: '011-23382381',
    badge: 'Fruits & Vegetables',
    description: 'Holistic growth of horticulture sector covering fruits, vegetables, root & tuber crops, mushrooms, spices, and flowers.',
    benefits: '40% to 50% capital subsidy for establishing polyhouse, shade net house, high-density orchards, mushroom units, and pack houses.',
    maxFinancialValue: 85000,
    eligibilityCriteria: {},
    eligibilitySummary: 'Farmers cultivating or planning to cultivate horticultural fruits, vegetables, flowers, or spices.',
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Records', 'Bank Passbook', 'Soil & Water Test Report'],
    applicationDeadline: 'Quarterly Applications',
    howToApply: 'Apply through State Horticulture Department or District Horticulture Officer.',
    subsidiesType: ['Greenhouse Subsidy', 'Polyhouse Subsidy', 'Horticulture Subsidy', 'Seed Subsidy'],
    iconName: 'Apple',
    bannerImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nbhm',
    name: 'National Beekeeping & Honey Mission (NBHM)',
    shortCode: 'NBHM',
    category: 'central',
    ministry: 'National Bee Board (NBB)',
    officialWebsite: 'https://nbb.gov.in',
    helpline: '011-23382012',
    badge: 'Sweet Revolution',
    description: 'Promotes scientific beekeeping and honey production for integrated farming income generation.',
    benefits: '80% subsidy on bee boxes, bee colonies, honey extractors, and custom processing units.',
    maxFinancialValue: 35000,
    eligibilityCriteria: {},
    eligibilitySummary: 'Individual farmers, Beekeepers, SHGs, Cooperatives, and FPOs.',
    requiredDocuments: ['Aadhaar Card', 'Bank Passbook', 'Beekeeping Training Certificate (if available)'],
    applicationDeadline: 'Open Portal',
    howToApply: 'Register on Madhukanti Portal (nbb.gov.in) and submit application via State Horticulture Mission.',
    subsidiesType: ['Bee Keeping Subsidy', 'Honey Production'],
    iconName: 'Bug',
    bannerImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nlm',
    name: 'National Livestock Mission (NLM)',
    shortCode: 'NLM',
    category: 'central',
    ministry: 'Department of Animal Husbandry & Dairying',
    officialWebsite: 'https://nlm.udyamimitra.in',
    helpline: '1800-180-1551',
    badge: '50% Capital Subsidy',
    description: 'Entrepreneurship development in poultry, goat/sheep farming, piggery, and fodder seed production.',
    benefits: '50% capital subsidy up to ₹50 Lakhs for setting up goat/sheep breeding farms, poultry hatcheries, and fodder processing.',
    maxFinancialValue: 150000,
    eligibilityCriteria: {
      livestockNeeded: ['Cows', 'Buffaloes', 'Goats/Sheep', 'Poultry', 'Bees', 'None']
    },
    eligibilitySummary: 'Farmers, Agri-preneurs, Individuals, FPOs, JLGs, and SHGs.',
    requiredDocuments: ['Aadhaar Card', 'Land Ownership or Lease Document', 'Bank Passbook', 'Project Report / DPR', 'Training Certificate'],
    applicationDeadline: 'Open Window on NLM Portal',
    howToApply: 'Apply directly online at nlm.udyamimitra.in portal with project proposal.',
    subsidiesType: ['Livestock Subsidy', 'Dairy Subsidy', 'Goat Farming Subsidy', 'Poultry Subsidy'],
    iconName: 'Milk',
    bannerImage: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    shortCode: 'KCC',
    category: 'central',
    ministry: 'Ministry of Finance & Agriculture',
    officialWebsite: 'https://www.myscheme.gov.in',
    helpline: '1800-11-5526',
    badge: 'Collateral-Free Credit',
    description: 'Revolving credit facility providing low-interest short-term loans for crop cultivation, post-harvest expenses, and animal husbandry.',
    benefits: 'Collateral-free loan up to ₹1.6 Lakhs (and up to ₹3 Lakhs) at a highly concessional effective interest rate of 4% per annum.',
    maxFinancialValue: 160000,
    eligibilityCriteria: {},
    eligibilitySummary: 'All farmers, tenant farmers, oral lessees, sharecroppers, and livestock/fisheries farmers.',
    requiredDocuments: ['Aadhaar Card', 'PAN Card / Voter ID', 'Land Ownership Certificate', 'Passport Photograph'],
    applicationDeadline: 'Available Year-Round',
    howToApply: 'Submit one-page KCC application form at any Commercial Bank, RRB, or Cooperative Bank branch.',
    subsidiesType: ['Agriculture Loan', 'Interest Subvention'],
    iconName: 'CreditCard',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pm-kusum',
    name: 'PM KUSUM Yojana (Solar Pumps)',
    shortCode: 'PM-KUSUM',
    category: 'central',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    officialWebsite: 'https://pmkusum.mnre.gov.in',
    helpline: '1800-180-3333',
    badge: '60% Solar Pump Subsidy',
    description: 'Solarization of agricultural pumpsets and setting up of decentralized solar power plants on barren farm lands.',
    benefits: 'Up to 60% total subsidy (30% Central + 30% State) for installing standalone solar water pumps (3 HP to 10 HP).',
    maxFinancialValue: 120000,
    eligibilityCriteria: {},
    eligibilitySummary: 'Individual farmers, water user associations, and cooperatives holding agricultural land.',
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Record (Chitta/Patta/7-12)', 'Bank Account Passbook', 'Borewell / Open Well Proof'],
    applicationDeadline: 'State Renewable Energy Agency Window',
    howToApply: 'Apply online through State Nodal Agency (e.g., TEDA in TN, PEDA in Punjab, MEDA in Maharashtra).',
    subsidiesType: ['Solar Pump Subsidy', 'Water Saving'],
    iconName: 'Sun',
    bannerImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'digital-agri',
    name: 'Digital Agriculture Mission',
    shortCode: 'DAM',
    category: 'central',
    ministry: 'Ministry of Agriculture',
    officialWebsite: 'https://agriwelfare.gov.in',
    helpline: '1800-180-1551',
    badge: 'Digital Farming & AgriStack',
    description: 'National framework creating AgriStack digital farmer IDs, GIS farm mapping, and AI-driven precision advisory services.',
    benefits: 'Free unique Digital Farmer ID (AgriStack ID), instant online loan approvals, automated crop loss assessment, and free drone mapping.',
    maxFinancialValue: 5000,
    eligibilityCriteria: {},
    eligibilitySummary: 'Every registered landholding and tenant farmer in India.',
    requiredDocuments: ['Aadhaar Card', 'Mobile Number', 'Land Survey Number'],
    applicationDeadline: 'Ongoing Registration',
    howToApply: 'Register on State AgriStack portal or through CSC Digital Seva Kendra.',
    subsidiesType: ['Digital Farming', 'Precision Advisory'],
    iconName: 'Smartphone',
    bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  }
];

// STATE SPECIFIC SCHEMES
export const STATE_SCHEMES_MAP: Record<string, GovernmentScheme[]> = {
  'Tamil Nadu': [
    {
      id: 'tn-paddy-incentive',
      name: 'Tamil Nadu Special Paddy Production Incentive Scheme',
      shortCode: 'TN-PADDY',
      category: 'state',
      ministry: 'Department of Agriculture & Farmers Welfare, Govt of Tamil Nadu',
      officialWebsite: 'https://www.tnagrisnet.tn.gov.in',
      helpline: '1800-180-1551 / 044-28511732',
      badge: 'State Crop Bonus',
      description: 'Special procurement bonus over and above MSP for fine and common varieties of Paddy procured by TNCSC.',
      benefits: 'Extra incentive bonus of ₹100/quintal for fine paddy and ₹75/quintal for common paddy.',
      maxFinancialValue: 15000,
      eligibilityCriteria: {
        crops: ['Paddy', 'Rice']
      },
      eligibilitySummary: 'Paddy farmers in Tamil Nadu selling through Direct Purchase Centres (DPCs).',
      requiredDocuments: ['Aadhaar Card', 'Chitta / Adangal', 'Bank Passbook'],
      applicationDeadline: 'Procurement Season (Kharif/Rabi)',
      howToApply: 'Register online at Uzhavan App or contact local Village Administrative Officer (VAO).',
      subsidiesType: ['Seed Subsidy', 'State Incentive'],
      targetStates: ['Tamil Nadu'],
      iconName: 'Sprout',
      bannerImage: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tn-farm-pond',
      name: 'Tamil Nadu Chief Minister Farm Pond Scheme',
      shortCode: 'TN-FARM-POND',
      category: 'state',
      ministry: 'Agricultural Engineering Department, Tamil Nadu',
      officialWebsite: 'https://uzhavan.tn.gov.in',
      helpline: '044-29530131',
      badge: '100% Subsidy for Small Farmers',
      description: 'Full financial subsidy for digging rainwater harvesting farm ponds (10m x 10m x 2m) to recharge groundwater.',
      benefits: '100% subsidy (up to ₹1,00,000) for Small/Marginal farmers and 50% subsidy for other farmers.',
      maxFinancialValue: 100000,
      eligibilityCriteria: {},
      eligibilitySummary: 'Landowning farmers in rainfed districts of Tamil Nadu.',
      requiredDocuments: ['Aadhaar Card', 'Patta / Chitta', 'Small/Marginal Farmer Certificate'],
      applicationDeadline: 'Uzhavan App Open Window',
      howToApply: 'Apply online via Uzhavan Mobile App or Executive Engineer (Agri Engineering).',
      subsidiesType: ['Farm Pond Subsidy', 'Water Saving'],
      targetStates: ['Tamil Nadu'],
      iconName: 'Droplets',
      bannerImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'tn-free-power',
      name: 'TN Free Electricity for Agriculture (TANGEDCO)',
      shortCode: 'TN-FREE-ELEC',
      category: 'state',
      ministry: 'TANGEDCO & Dept of Energy, Tamil Nadu',
      officialWebsite: 'https://www.tangedco.gov.in',
      helpline: '1912',
      badge: '100% Free Power',
      description: 'Provides 100% free electricity supply for agricultural pumpsets to all farmers in Tamil Nadu.',
      benefits: 'Zero electricity bill charges for farm pumpsets up to 15 HP.',
      maxFinancialValue: 36000,
      eligibilityCriteria: {},
      eligibilitySummary: 'All registered agricultural pump service connection holders in Tamil Nadu.',
      requiredDocuments: ['Aadhaar Card', 'Patta / Chitta', 'Service Connection Number'],
      applicationDeadline: 'Tatkal Scheme Window',
      howToApply: 'Apply at TANGEDCO Executive Engineer section office or through Uzhavan App.',
      subsidiesType: ['Solar Pump Subsidy', 'Power Subsidy'],
      targetStates: ['Tamil Nadu'],
      iconName: 'Zap',
      bannerImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Punjab': [
    {
      id: 'pb-crop-residue',
      name: 'Punjab Crop Residue Management (CRM) Machine Subsidy',
      shortCode: 'PB-CRM',
      category: 'state',
      ministry: 'Department of Agriculture, Govt of Punjab',
      officialWebsite: 'https://agripunjab.gov.in',
      helpline: '1800-180-1551',
      badge: 'Stubble Management',
      description: 'Subsidy on Happy Seeder, Super Seeder, Straw Chopper, and Paddy Straw Cutter to prevent stubble burning.',
      benefits: '50% subsidy for individual farmers and 80% subsidy for Custom Hiring Centres / Panchayats.',
      maxFinancialValue: 150000,
      eligibilityCriteria: {},
      eligibilitySummary: 'Farmers and Custom Hiring Centres in Punjab.',
      requiredDocuments: ['Aadhaar Card', 'Jamabandi (Land Record)', 'Bank Passbook', 'Tractor RC'],
      applicationDeadline: 'June to August Window',
      howToApply: 'Apply online on agripunjab.gov.in CRM portal.',
      subsidiesType: ['Farm Machinery Subsidy', 'Stubble Management'],
      targetStates: ['Punjab'],
      iconName: 'Truck',
      bannerImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Maharashtra': [
    {
      id: 'mh-namo-shetkari',
      name: 'Namo Shetkari Maha Samman Nidhi Yojana',
      shortCode: 'MH-NAMO',
      category: 'state',
      ministry: 'Department of Agriculture, Govt of Maharashtra',
      officialWebsite: 'https://krishi.maharashtra.gov.in',
      helpline: '022-22025251',
      badge: '₹6,000 State Bonus',
      description: 'State government top-up financial scheme providing an extra ₹6,000/year to PM-Kisan beneficiaries in Maharashtra.',
      benefits: 'Additional ₹6,000 per year (Total ₹12,000 per year combined with PM-Kisan).',
      maxFinancialValue: 6000,
      eligibilityCriteria: {},
      eligibilitySummary: 'All active PM-KISAN beneficiaries in Maharashtra.',
      requiredDocuments: ['Aadhaar Card', '7/12 & 8A Extract', 'Bank Passbook'],
      applicationDeadline: 'Automatic Enrollment',
      howToApply: 'Automatic transfer for all verified PM-Kisan beneficiaries in Mahadbt portal.',
      subsidiesType: ['Cash Transfer', 'Income Support'],
      targetStates: ['Maharashtra'],
      iconName: 'Coins',
      bannerImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'Uttar Pradesh': [
    {
      id: 'up-kisan-uday',
      name: 'UP Kisan Uday Yojana (Energy Efficient Pumps)',
      shortCode: 'UP-UDAY',
      category: 'state',
      ministry: 'Department of Agriculture, Uttar Pradesh',
      officialWebsite: 'https://upagriculture.com',
      helpline: '1800-180-1551',
      badge: 'Free Smart Solar Pump',
      description: 'Provides free energy-efficient 5 HP / 7.5 HP solar pumpsets with smart mobile control feature.',
      benefits: '100% free distribution of energy-efficient star-rated agricultural pumpsets.',
      maxFinancialValue: 70000,
      eligibilityCriteria: {},
      eligibilitySummary: 'Farmers in Uttar Pradesh having active agricultural land.',
      requiredDocuments: ['Aadhaar Card', 'Khatauni', 'Bank Passbook'],
      applicationDeadline: 'Annual State Allocation',
      howToApply: 'Register on upagriculture.com portal using Farmer ID.',
      subsidiesType: ['Solar Pump Subsidy', 'Sprinkler Subsidy'],
      targetStates: ['Uttar Pradesh'],
      iconName: 'Sun',
      bannerImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

// NEARBY OFFICES DATABASE (Krishi Vigyan Kendra, Soil Testing Labs, CSC)
export interface AgricultureOffice {
  id: string;
  name: string;
  type: 'KVK' | 'Soil Testing Lab' | 'District Agriculture Office' | 'Fertilizer & Seed Center' | 'CSC Center' | 'Bank';
  address: string;
  district: string;
  state: string;
  contactNumber: string;
  distanceKm: number;
  lat: number;
  lng: number;
}

export const NEARBY_OFFICES: AgricultureOffice[] = [
  {
    id: 'off-1',
    name: 'Krishi Vigyan Kendra (KVK) Research Station',
    type: 'KVK',
    address: 'ICAR-KVK Campus, Main Highway Road',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    contactNumber: '04362-226789 / +91 94433 12345',
    distanceKm: 4.2,
    lat: 10.7870,
    lng: 79.1378
  },
  {
    id: 'off-2',
    name: 'Government District Soil Testing Laboratory',
    type: 'Soil Testing Lab',
    address: 'Agriculture Complex, Court Road',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    contactNumber: '04362-231144',
    distanceKm: 2.8,
    lat: 10.7920,
    lng: 79.1410
  },
  {
    id: 'off-3',
    name: 'Assistant Director of Agriculture (ADA) Office',
    type: 'District Agriculture Office',
    address: 'Block Development Office Campus',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    contactNumber: '04362-240012',
    distanceKm: 3.5,
    lat: 10.7810,
    lng: 79.1300
  },
  {
    id: 'off-4',
    name: 'Primary Agricultural Cooperative Credit Society (PACCS)',
    type: 'Bank',
    address: 'Main Bazaar, Kovilkulam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    contactNumber: '04362-251122',
    distanceKm: 1.1,
    lat: 10.7850,
    lng: 79.1350
  },
  {
    id: 'off-5',
    name: 'Government Common Service Center (CSC Digital Seva)',
    type: 'CSC Center',
    address: 'Taluk Office Junction',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    contactNumber: '+91 98424 55667',
    distanceKm: 0.8,
    lat: 10.7880,
    lng: 79.1380
  },
  {
    id: 'off-6',
    name: 'Krishi Vigyan Kendra (KVK) Ludhiana',
    type: 'KVK',
    address: 'PAU Campus, Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    contactNumber: '0161-2401960',
    distanceKm: 3.8,
    lat: 30.9010,
    lng: 75.8573
  }
];

// SAMPLE VOICE ASSISTANT QUESTIONS
export const SAMPLE_SCHEME_QUESTIONS = [
  "I need subsidy for drip irrigation.",
  "How can I get PM Kisan?",
  "What documents are required for crop insurance?",
  "Tell me about tractor and machinery subsidies.",
  "Which state subsidies are available for solar pumps?",
  "How do I apply for organic farming subsidy?"
];
