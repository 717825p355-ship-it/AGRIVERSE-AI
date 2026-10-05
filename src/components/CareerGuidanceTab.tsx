import React, { useState } from 'react';
import { UserProfile, SavedItem } from '../types';
import { 
  Briefcase, Search, ArrowRight, Save, Check, RefreshCw, 
  Map, DollarSign, Award, Target, BookOpen, AlertCircle,
  HelpCircle, Play, ChevronDown, ChevronUp, Download, Sparkles, Filter
} from 'lucide-react';
import voiceController from '../lib/voice';

interface CareerGuidanceTabProps {
  userProfile: UserProfile;
  isEasyMode: boolean;
  isOffline: boolean;
  onSaveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
}

export interface BusinessIdea {
  id: string;
  category: string;
  title: string;
  icon: string;
  imageUrl: string;
  overview: string;
  initialInvestment: string;
  profitEstimate: string;
  requiredLand: string;
  requiredSkills: string[];
  equipmentNeeded: string[];
  governmentSubsidies: string;
  requiredLicenses: string[];
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  stepByStepGuide: string[];
  marketDemand: string;
  successStory: string;
  trainingResources: string[];
  youtubeVideos: { title: string; url: string }[];
  faqs: { question: string; answer: string }[];
}

export const AGRI_BUSINESS_HUB: BusinessIdea[] = [
  {
    id: 'biz-1',
    category: '🌾 Crop Farming',
    title: 'High-Density Grain & Paddy Farming',
    icon: '🌾',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=60',
    overview: 'Modern high-yield Paddy & Grain cultivation utilizing mechanized transplantation, drip-assisted fertigation, and systemic pest monitoring.',
    initialInvestment: '₹25,000 - ₹45,000 / Acre',
    profitEstimate: '₹40,000 - ₹80,000 net profit per harvest cycle',
    requiredLand: '1 - 5 Acres minimum cultivable land',
    requiredSkills: ['Soil moisture tracking', 'NPK nutrient balance', 'Weed control'],
    equipmentNeeded: ['Tractor / Power Tiller', 'Transplanter', 'Motor Pump', 'Knapsack Sprayer'],
    governmentSubsidies: 'PM-KISAN, Sub-Mission on Agricultural Mechanization (SMAM) offers up to 50% subsidy on equipment.',
    requiredLicenses: ['FSSAI (for commercial grain sale)', 'Local Panchayat Agricultural Permit'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Conduct soil testing for pH and organic carbon content.',
      'Prepare nursery beds with certified disease-resistant seeds.',
      'Level field using laser leveler for uniform water retention.',
      'Transplant 21-day old saplings with optimum spacing.',
      'Apply split doses of nitrogen and organic bio-fertilizers.'
    ],
    marketDemand: 'Consistently high domestic requirement across state mandis and central grain procurement reserves.',
    successStory: 'Ramesh Kumar from Punjab scaled 3 acres of Basmati paddy into a ₹6 Lakh annual business using SRI methods.',
    trainingResources: ['ICAR Rice Research Institute', 'Krishi Vigyan Kendra (KVK)', 'AgriAI Video Portal'],
    youtubeVideos: [
      { title: 'SRI Paddy Cultivation Step-by-Step', url: 'https://www.youtube.com/results?search_query=SRI+Paddy+Cultivation' },
      { title: 'Modern Paddy Transplanter Operation', url: 'https://www.youtube.com/results?search_query=Paddy+Transplanter+Guide' }
    ],
    faqs: [
      { question: 'What is the best time for Kharif Paddy sowing?', answer: 'June to July with monsoon onset is optimal across most Indian states.' },
      { question: 'How much water is required?', answer: 'Around 1200-1400 mm evenly distributed during growth stages.' }
    ]
  },
  {
    id: 'biz-2',
    category: '🥛 Dairy Farming',
    title: 'High-Yield Commercial Dairy Unit',
    icon: '🥛',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=600&auto=format&fit=crop&q=60',
    overview: 'Establish a modern 10-cow or buffalo dairy farm with automated milking, silage fodder management, and direct-to-consumer milk distribution.',
    initialInvestment: '₹1.5 Lakhs - ₹3.5 Lakhs for 5 Cattle',
    profitEstimate: '₹35,000 - ₹70,000 monthly cash flow',
    requiredLand: '0.5 - 1 Acre (including shed and green fodder plot)',
    requiredSkills: ['Cattle feed formulation', 'Mastitis detection', 'Milking machine maintenance'],
    equipmentNeeded: ['Automated Milking Machine', 'Chaff Cutter', 'Milk Chiller', 'Rubber Floor Mats'],
    governmentSubsidies: 'NABARD Dairy Entrepreneurship Development Scheme (DEDS) provides 25% to 33.33% capital subsidy.',
    requiredLicenses: ['FSSAI Milk Vendor License', 'Veterinary Health & Sanitation Certificate'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Construct a well-ventilated shed with non-slippery floor slates.',
      'Procure healthy crossbred Murrah buffaloes or Gir/HF cows.',
      'Sow perennial CO-5 green fodder grass in 0.5 acre plot.',
      'Implement routine vaccination (FMD, HS, BQ) schedule.',
      'Partner with local dairy cooperatives or organic direct subscribers.'
    ],
    marketDemand: 'Surging urban demand for pure A2 milk, curd, paneer, and fresh ghee.',
    successStory: 'Anitha from Tamil Nadu started with 3 Gir cows and now generates ₹1.2 Lakhs monthly selling packaged A2 milk.',
    trainingResources: ['National Dairy Research Institute (NDRI)', 'State Animal Husbandry Dept', 'Local Veterinary College'],
    youtubeVideos: [
      { title: 'Modern 10-Cow Shed Construction Guide', url: 'https://www.youtube.com/results?search_query=Commercial+Dairy+Shed+Design' },
      { title: 'How to make High Quality Silage Fodder', url: 'https://www.youtube.com/results?search_query=Silage+Making+Fodder' }
    ],
    faqs: [
      { question: 'Which breed gives maximum daily milk yield?', answer: 'Holstein Friesian (20-30 L/day) and Murrah Buffalo (12-18 L/day).' },
      { question: 'How do I protect cattle during peak summer?', answer: 'Install foggers, exhaust fans, and provide cool drinking water 24/7.' }
    ]
  },
  {
    id: 'biz-3',
    category: '🐔 Poultry Farming',
    title: 'Integrated Layer & Broiler Poultry Unit',
    icon: '🐔',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=60',
    overview: 'Contract or independent broiler/layer poultry farming producing high-protein eggs and meat with fast 42-day bird turnover cycles.',
    initialInvestment: '₹80,000 - ₹2.5 Lakhs (1000 Birds)',
    profitEstimate: '₹25,000 - ₹60,000 per 42-day batch',
    requiredLand: '0.25 - 0.5 Acre',
    requiredSkills: ['Temperature brooding control', 'Biosecurity sanitation', 'Feed ratio management'],
    equipmentNeeded: ['Chick Brooders', 'Automatic Feeders & Drinkers', 'Ventilation Fans', 'Flame Gun'],
    governmentSubsidies: 'National Livestock Mission (NLM) offers up to 50% subsidy for poultry breeding units.',
    requiredLicenses: ['Poultry Farm Pollution Clearance (CPCB)', 'Panchayat NoC'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Build east-west facing shed with wire mesh sidewalls for cross ventilation.',
      'Disinfect shed 2 weeks prior to chick arrival using formalin wash.',
      'Maintain 95°F brooder heat during week 1 for day-old chicks.',
      'Provide starter and finisher mash feed mixed with multi-vitamins.',
      'Sell fully grown 2kg broilers at 40-45 days.'
    ],
    marketDemand: 'High daily consumption in local chicken shops, restaurants, and egg markets.',
    successStory: 'Suresh from Telangana earns ₹4.5 Lakhs annually operating a 2,000 bird broiler contract facility.',
    trainingResources: ['Central Poultry Development Organization (CPDO)', 'KVK Poultry Wing'],
    youtubeVideos: [
      { title: 'Day 1 to Day 40 Broiler Farming Management', url: 'https://www.youtube.com/results?search_query=Broiler+Poultry+Management' }
    ],
    faqs: [
      { question: 'What is the feed conversion ratio (FCR)?', answer: 'Ideal FCR for broilers is 1.5 to 1.6 kg feed per 1 kg body weight gain.' }
    ]
  },
  {
    id: 'biz-4',
    category: '🐐 Goat Farming',
    title: 'Stall-Fed Goat Rearing & Breeding',
    icon: '🐐',
    imageUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=60',
    overview: 'High-density stall-fed goat rearing focusing on prolific breeds like Sirohi, Boer, or Osmanabadi for meat and breeding stock.',
    initialInvestment: '₹40,000 - ₹1.2 Lakhs (10+1 Herd)',
    profitEstimate: '₹1.5 Lakhs - ₹3 Lakhs per breeding cycle (8 months)',
    requiredLand: '0.25 Acre for shed and plastic slatted flooring',
    requiredSkills: ['Deworming schedules', 'Green fodder chopped mixing', 'Kidding care'],
    equipmentNeeded: ['Slatted Plastic Floor Mats', 'Fodder Troughs', 'Weight Scale', 'Vaccination Kit'],
    governmentSubsidies: 'State Animal Husbandry schemes provide 50% to 60% subsidy for women and marginal farmers.',
    requiredLicenses: ['Livestock Transport License (for inter-state sale)'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Erect elevated wooden or slatted floor shed 3 feet above ground.',
      'Purchase 10 healthy 6-month-old female goats and 1 breeding buck.',
      'Feed dry fodder, Subabul leaves, and 250g concentrate feed daily.',
      'Deworm goats every 3 months and administer PPR vaccine yearly.'
    ],
    marketDemand: 'Immense year-round demand especially during festival seasons and local meat vendors.',
    successStory: 'Prakash from Maharashtra converted 20 goats into a 150-goat breeding farm with ₹8 Lakhs yearly net turnover.',
    trainingResources: ['Central Institute for Research on Goats (CIRG)', 'District Veterinary Dept'],
    youtubeVideos: [
      { title: 'Stall-Fed Goat Farming Shed Design', url: 'https://www.youtube.com/results?search_query=Stall+fed+goat+farming' }
    ],
    faqs: [
      { question: 'Why is elevated slatted flooring recommended?', answer: 'It keeps goats dry, prevents hooves infections, and collects clean droppings for manure sale.' }
    ]
  },
  {
    id: 'biz-5',
    category: '🐟 Fish Farming',
    title: 'Inland Aquaculture & Biofloc Fish Farming',
    icon: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=60',
    overview: 'Cultivate fast-growing Katla, Rohu, or Tilapia fish using traditional farm ponds or high-density indoor Biofloc tarpaulin tanks.',
    initialInvestment: '₹50,000 - ₹2 Lakhs',
    profitEstimate: '₹80,000 - ₹2.2 Lakhs per 6-month harvest',
    requiredLand: '0.25 Acre pond or 50 sq meters for 4 Biofloc tanks',
    requiredSkills: ['Water pH & Ammonia testing', 'Aeration control', 'Probiotic feeding'],
    equipmentNeeded: ['Tarpaulin Tanks', 'Air Pumps & Aerators', 'Water Testing Kit', 'Feeding Nets'],
    governmentSubsidies: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY) offers 40% - 60% financial assistance.',
    requiredLicenses: ['State Fisheries Department Inland Permit'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Excavate pond or assemble heavy-duty PVC frame Biofloc tanks.',
      'Treat water with lime, molasses, and beneficial probiotic bacteria.',
      'Stock high-quality fingerlings (50-100mm size) from certified hatcheries.',
      'Monitor dissolved oxygen (DO > 5 mg/L) continuously.',
      'Harvest 1kg fish at 150-180 days using drag nets.'
    ],
    marketDemand: 'High daily demand in fish markets, hotels, and urban supermarket cold chains.',
    successStory: 'Santhosh from Kerala generates ₹3.5 Lakhs net profit from 6 Biofloc tanks in his backyard.',
    trainingResources: ['Central Institute of Freshwater Aquaculture (CIFA)', 'PMMSY Training Center'],
    youtubeVideos: [
      { title: 'Biofloc Fish Farming Tank Setup Guide', url: 'https://www.youtube.com/results?search_query=Biofloc+Fish+Farming+Setup' }
    ],
    faqs: [
      { question: 'How many fish can be stocked per tank?', answer: 'Around 1000-1500 Tilapia fingerlings per 10,000 Litre Biofloc tank.' }
    ]
  },
  {
    id: 'biz-6',
    category: '🍄 Mushroom Farming',
    title: 'Indoor Oyster & Button Mushroom Production',
    icon: '🍄',
    imageUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=600&auto=format&fit=crop&q=60',
    overview: 'Zero-land climate-controlled indoor cultivation of nutritional Oyster and Button mushrooms on paddy straw/wheat compost bags.',
    initialInvestment: '₹10,000 - ₹35,000',
    profitEstimate: '₹20,000 - ₹50,000 monthly continuous income',
    requiredLand: 'A dark, well-ventilated 15x20 sq.ft room or thatched hut',
    requiredSkills: ['Substrate pasteurization', 'Spawn inoculation', 'Humidity maintenance (85-90%)'],
    equipmentNeeded: ['Boiling Drum / Pasteurization Tank', 'Hygrometer & Thermometer', 'Sprayer', 'Plastic Bags'],
    governmentSubsidies: 'NHB & KVK provide 40%-50% capital subsidy on mushroom spawn & unit construction.',
    requiredLicenses: ['FSSAI License (for packaged sale)'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Chop fresh paddy straw into 2-inch pieces and steam pasteurize for 3 hours.',
      'Cool straw and mix with premium mushroom grain spawn.',
      'Pack into perforated plastic bags and hang in dark incubation room for 15 days.',
      'Introduce light and fresh air when white mycelium covers bag.',
      'Harvest fresh white mushroom flushes every 7 days for 2 months.'
    ],
    marketDemand: 'Popular in daily vegetable stalls, hotels, pizza outlets, and organic grocery outlets.',
    successStory: 'Kavitha from Karnataka turned her spare garage into a ₹40,000/month mushroom brand.',
    trainingResources: ['Directorate of Mushroom Research (DMR Solan)', 'Local KVK Workshop'],
    youtubeVideos: [
      { title: 'Oyster Mushroom Bag Preparation Tutorial', url: 'https://www.youtube.com/results?search_query=Oyster+Mushroom+Cultivation' }
    ],
    faqs: [
      { question: 'How long does it take from spawn to first harvest?', answer: 'First harvest occurs within 21-25 days from bag filling.' }
    ]
  },
  {
    id: 'biz-7',
    category: '🐝 Bee Keeping',
    title: 'Apiculture & Pure Organic Honey Business',
    icon: '🐝',
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=600&auto=format&fit=crop&q=60',
    overview: 'Deploy wooden beehives along farm perimeters to boost crop pollination by 25% while harvesting high-value pure honey and beeswax.',
    initialInvestment: '₹15,000 - ₹40,000 (10 Bee Boxes)',
    profitEstimate: '₹30,000 - ₹75,000 per extraction season',
    requiredLand: 'No dedicated land needed; place along boundary fences or orchards',
    requiredSkills: ['Bee colony inspection', 'Queen bee health management', 'Centrifugal honey extraction'],
    equipmentNeeded: ['Wooden Bee Hives', 'Smoker', 'Bee Veil & Gloves', 'Honey Extractor Centrifuge'],
    governmentSubsidies: 'National Beekeeping & Honey Mission (NBHM) offers up to 80% subsidy through KVIC.',
    requiredLicenses: ['FSSAI Food License', 'Agmark Quality Certification'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Obtain 10 Apis mellifera bee colonies in multi-frame wooden boxes.',
      'Position hives near flowering mustard, sunflower, or fruit orchards.',
      'Inspect frames weekly for queen cells and honey accumulation.',
      'Extract sealed honey combs using centrifugal extractor without harming bees.',
      'Filter, bottle, and market raw unfiltered organic honey.'
    ],
    marketDemand: 'Huge consumer shift towards authentic raw honey and natural beeswax lip balms.',
    successStory: 'Manoj from Himachal Pradesh manages 100 hives earning ₹9 Lakhs yearly migrating hives across mustard and apple belts.',
    trainingResources: ['National Bee Board (NBB)', 'KVIC Training Institutes'],
    youtubeVideos: [
      { title: 'How to Start Beekeeping for Beginners', url: 'https://www.youtube.com/results?search_query=Beekeeping+for+beginners' }
    ],
    faqs: [
      { question: 'How much honey does one bee box produce per year?', answer: 'Around 25 to 40 kg of pure honey annually per healthy Apis mellifera box.' }
    ]
  },
  {
    id: 'biz-8',
    category: '🌿 Herbal Farming',
    title: 'Medicinal & Aromatic Plant Farming',
    icon: '🌿',
    imageUrl: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600&auto=format&fit=crop&q=60',
    overview: 'Cultivate high-value Ayurvedic herbs like Ashwagandha, Tulsi, Lemongrass, and Aloe Vera with guaranteed buyback agreements.',
    initialInvestment: '₹18,000 - ₹35,000 / Acre',
    profitEstimate: '₹60,000 - ₹1.4 Lakhs per Acre per year',
    requiredLand: '0.5 - 2 Acres dry or semi-arid land',
    requiredSkills: ['Herbal drying methods', 'Essential oil distillation', 'Organic pest repellents'],
    equipmentNeeded: ['Solar Herb Dryer', 'Essential Oil Distillation Still (optional)', 'Drip Line'],
    governmentSubsidies: 'National Medicinal Plants Board (NMPB) provides 30% to 75% financial subsidy.',
    requiredLicenses: ['AYUSH Raw Material Vendor Registration'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Select drought-tolerant medicinal species like Ashwagandha or Lemongrass.',
      'Sow certified seeds on raised beds with drip irrigation lines.',
      'Avoid synthetic pesticides to preserve medicinal active compounds.',
      'Harvest roots or leaves at peak maturity index.',
      'Shade-dry harvested herbs and supply to Ayurvedic pharma companies.'
    ],
    marketDemand: 'Rapidly growing export market across global wellness, pharmaceutical, and cosmetics industries.',
    successStory: 'Dr. Sunita cultivated Ashwagandha on 2 acres arid land netting ₹2.8 Lakhs with 0 pest issues.',
    trainingResources: ['Central Institute of Medicinal and Aromatic Plants (CIMAP Lucknow)', 'NMPB Portal'],
    youtubeVideos: [
      { title: 'Ashwagandha Farming Complete Guide', url: 'https://www.youtube.com/results?search_query=Ashwagandha+Farming+Guide' }
    ],
    faqs: [
      { question: 'Do wild animals destroy herbal crops?', answer: 'Most wild animals avoid medicinal plants like Lemongrass and Tulsi due to strong aroma.' }
    ]
  },
  {
    id: 'biz-9',
    category: '🌸 Floriculture',
    title: 'Commercial Cut-Flower & Loose Flower Unit',
    icon: '🌸',
    imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=60',
    overview: 'Cultivate Marigold, Jasmine, Rose, or Gerbera flowers for daily temple offerings, wedding decor, and essential oil extraction.',
    initialInvestment: '₹20,000 - ₹60,000 / Acre',
    profitEstimate: '₹80,000 - ₹2.5 Lakhs per year with daily cash return',
    requiredLand: '0.25 - 1 Acre with good water access',
    requiredSkills: ['Flower plucking timing', 'Bud nipping', 'Cold chain storage'],
    equipmentNeeded: ['Drip Irrigation Kit', 'Pruning Shears', 'Plastic Crates', 'Net House'],
    governmentSubsidies: 'Mission for Integrated Development of Horticulture (MIDH) provides 40% - 50% subsidy.',
    requiredLicenses: ['Local Flower Market Trader Permit'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Prepare well-drained fertile ridges with organic farmyard manure.',
      'Plant high-yielding Marigold (African Orange) or Jasmine saplings.',
      'Pinch top shoots at 30 days to encourage multi-branch blooming.',
      'Pluck fresh open flowers early morning before sunrise.',
      'Pack in airy bamboo baskets and deliver to flower mandi.'
    ],
    marketDemand: 'Daily mandatory requirement for temples, celebrations, garland makers, and perfume industries.',
    successStory: 'Murugan from Tamil Nadu plucks 40kg Marigold daily generating ₹2,000 cash income every morning.',
    trainingResources: ['Indian Institute of Horticultural Research (IIHR)', 'State Horticulture Department'],
    youtubeVideos: [
      { title: 'High Yield Marigold Farming Techniques', url: 'https://www.youtube.com/results?search_query=Marigold+Flower+Farming' }
    ],
    faqs: [
      { question: 'How long does a Jasmine plant produce flowers?', answer: 'A healthy Jasmine field continues yielding flowers for 10-15 years.' }
    ]
  },
  {
    id: 'biz-10',
    category: '🥭 Fruit Farming',
    title: 'High-Density Mango, Guava & Banana Orchard',
    icon: '🥭',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=60',
    overview: 'Ultra High Density Planting (UHDP) of Guava (Taiwan Pink) or Mango (Alphonso/Kesar) yielding double harvest per acre.',
    initialInvestment: '₹45,000 - ₹90,000 / Acre',
    profitEstimate: '₹1.8 Lakhs - ₹4 Lakhs / Acre per year after year 2',
    requiredLand: '1 - 3 Acres',
    requiredSkills: ['Pruning and canopy shaping', 'Fruit bagging', 'Drip fertigation'],
    equipmentNeeded: ['Secateurs Pruner', 'Drip Irrigation Automation', 'Spray Pump', 'Fruit Crates'],
    governmentSubsidies: 'National Horticulture Board (NHB) provides up to 50% subsidy on UHDP orchards.',
    requiredLicenses: ['APMC Mandi Registration'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Dig 2x2 feet pits spaced at 3x2 meter UHDP density.',
      'Fill pits with topsoil, neem cake, and trichoderma bio-fungicide.',
      'Plant grafted Taiwan Pink Guava or Mango saplings.',
      'Install drip lateral lines with inline emitters.',
      'Prune branches twice yearly to maintain 7-foot height for easy hand picking.'
    ],
    marketDemand: 'High market demand across domestic fruit juice processors and export packaging houses.',
    successStory: 'Ganesh from Andhra Pradesh harvested 12 Tons of Taiwan Guava per acre selling at ₹40/kg.',
    trainingResources: ['Central Institute for Subtropical Horticulture (CISH)', 'NHB Portal'],
    youtubeVideos: [
      { title: 'Ultra High Density Guava Farming Guide', url: 'https://www.youtube.com/results?search_query=UHDP+Guava+Farming' }
    ],
    faqs: [
      { question: 'When does UHDP Guava start giving fruiting?', answer: 'First commercial harvest starts within 12 to 14 months of planting.' }
    ]
  },
  {
    id: 'biz-11',
    category: '🥬 Vegetable Farming',
    title: 'Exotic & Commercial Polyhouse Vegetable Unit',
    icon: '🥬',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=60',
    overview: 'Year-round climate resilient cultivation of Tomatoes, Capsicum, Cucumber, or Exotic Leafy Greens.',
    initialInvestment: '₹30,000 (Open Field) to ₹2.5 Lakhs (Polyhouse Unit)',
    profitEstimate: '₹1 Lakh - ₹3.2 Lakhs net annual income',
    requiredLand: '0.25 - 1 Acre',
    requiredSkills: ['Staking & Trellising', 'Pest scouting', 'Fertigation dosing'],
    equipmentNeeded: ['Trellis Wire Clips', 'Mulching Film', 'Drip Emitters', 'Insect Net'],
    governmentSubsidies: 'State Horticulture Mission provides up to 80% subsidy for shade nets & polyhouses.',
    requiredLicenses: ['FSSAI Food Operator Permit'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Prepare 1-meter wide raised beds covered with 25-micron silver-black mulching film.',
      'Punch holes and plant disease-free hybrid tomato or cucumber saplings.',
      'Erect bamboo/GI wire trellising to support vertical vine growth.',
      'Drip-feed water soluble NPK 19:19:19 fertilizers every 3 days.',
      'Harvest shiny premium vegetables every 2 days.'
    ],
    marketDemand: 'Daily urban kitchen staple with premium pricing during off-seasons.',
    successStory: 'Deepak from Haryana earns ₹5 Lakhs net per acre growing yellow and red bell peppers under polyhouse.',
    trainingResources: ['IIHR Bengaluru Vegetable Wing', 'State Center of Excellence'],
    youtubeVideos: [
      { title: 'Drip & Mulching Vegetable Farming Setup', url: 'https://www.youtube.com/results?search_query=Mulching+Paper+Vegetable+Farming' }
    ],
    faqs: [
      { question: 'What is the benefit of silver-black mulching film?', answer: 'It prevents weed growth, reduces water evaporation by 50%, and repels sap-sucking pests.' }
    ]
  },
  {
    id: 'biz-12',
    category: '🌴 Coconut Farming',
    title: 'Integrated Coconut & Intercropping Estate',
    icon: '🌴',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=60',
    overview: 'Cultivate hybrid dwarf Coconut palms intercropped with Cocoa, Pepper vines, or Banana for quadruple revenue streams.',
    initialInvestment: '₹35,000 - ₹70,000 / Acre',
    profitEstimate: '₹1.5 Lakhs - ₹3.8 Lakhs / Acre per year for 60 years',
    requiredLand: '1 - 5 Acres in tropical coastal/inland belts',
    requiredSkills: ['Rhinoceros beetle trapping', 'Boron micronutrient application', 'Copra drying'],
    equipmentNeeded: ['Tree Climbing Safety Harness', 'Copra Dryer', 'Drip Basin System'],
    governmentSubsidies: 'Coconut Development Board (CDB) provides 50% subsidy for new plantations.',
    requiredLicenses: ['CDB Registration Certificate'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Plant TxD hybrid coconut saplings spaced at 25x25 feet.',
      'Intercrop with Cocoa plants or Black Pepper trained up coconut trunks.',
      'Apply 1 kg Neem cake and 2 kg NPK fertilizer per palm annually.',
      'Harvest tender coconut water nuts every 45 days.',
      'Process mature nuts into copra or virgin coconut oil.'
    ],
    marketDemand: 'Unbounded demand for fresh tender coconut water, virgin oil, and desiccated coconut powder.',
    successStory: 'Subramaniam from Tamil Nadu intercropped Cocoa in 4 acres coconut grove, earning ₹7 Lakhs net yearly.',
    trainingResources: ['Coconut Development Board (Kochi)', 'CPCRI Kasaragod'],
    youtubeVideos: [
      { title: 'Coconut Intercropping Profit Model', url: 'https://www.youtube.com/results?search_query=Coconut+Intercropping+Model' }
    ],
    faqs: [
      { question: 'How many nuts does a hybrid coconut tree yield per year?', answer: 'A well-managed hybrid palm yields 150 to 250 nuts per year.' }
    ]
  },
  {
    id: 'biz-13',
    category: '🌽 Maize Farming',
    title: 'Commercial Grain & Sweet Corn Cultivation',
    icon: '🌽',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=60',
    overview: 'Short duration 80-day Sweet Corn or 120-day Grain Maize cultivation serving poultry feed manufacturers and food processing plants.',
    initialInvestment: '₹15,000 - ₹28,000 / Acre',
    profitEstimate: '₹35,000 - ₹75,000 / Acre in 90 days',
    requiredLand: '1 - 10 Acres',
    requiredSkills: ['Fall armyworm prevention', 'Seed treatment', 'Moisture grain drying'],
    equipmentNeeded: ['Maize Sheller', 'Seed Drill Planter', 'Sprayer'],
    governmentSubsidies: 'National Food Security Mission (NFSM) provides seed distribution subsidies up to 50%.',
    requiredLicenses: ['Panchayat Agri Trade Permit'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Sow hybrid seeds treated with Cyantraniliprole to prevent early Fall Armyworm.',
      'Maintain 60cm row to 20cm plant spacing using seed drill.',
      'Apply Pheromone traps at 4 traps per acre for pest monitoring.',
      'Harvest sweet corn cobs at milk stage (75 days) or grain maize when cob husk turns dry brown.',
      'Shell cobs using power sheller and market to feed mills.'
    ],
    marketDemand: 'Massive demand from poultry feed industry, ethanol plants, and urban sweet corn vendors.',
    successStory: 'Vijay from Karnataka rotated Sweet Corn 3 times a year netting ₹2.4 Lakhs per acre.',
    trainingResources: ['ICAR Indian Institute of Maize Research (IIMR)', 'State Extension Services'],
    youtubeVideos: [
      { title: 'Fall Armyworm Management in Maize', url: 'https://www.youtube.com/results?search_query=Fall+Armyworm+Maize+Control' }
    ],
    faqs: [
      { question: 'What is the ideal plant population per acre?', answer: 'Around 24,000 to 26,000 plants per acre for maximum cob size.' }
    ]
  },
  {
    id: 'biz-14',
    category: '🌱 Organic Farming',
    title: 'Certified Zero-Chemical Organic Farm',
    icon: '🌱',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=60',
    overview: 'Zero-budget natural farming (ZBNF) using Jeevamrutha, Panchagavya, and crop rotation for premium organic certified produce.',
    initialInvestment: '₹12,000 - ₹25,000 / Acre',
    profitEstimate: '₹60,000 - ₹1.5 Lakhs (30-50% higher price realization)',
    requiredLand: '0.5 - 5 Acres',
    requiredSkills: ['Jeevamrutha fermentation', 'Composting', 'Companion planting'],
    equipmentNeeded: ['200L Fermentation Drums', 'Bio-slurry Sprayer', 'Compost Pit'],
    governmentSubsidies: 'Paramparagat Krishi Vikas Yojana (PKVY) offers ₹50,000 per hectare for organic inputs & certification.',
    requiredLicenses: ['PGS-India / NPOP Organic Certification'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Stop all synthetic chemicals and start 3-year organic conversion period.',
      'Prepare Jeevamrutha using indigenous cow dung, urine, jaggery, and besan.',
      'Apply mulch with crop residues to enhance beneficial soil microbes.',
      'Plant marigold and castor trap crops along boundaries.',
      'Obtain PGS-India certification and market directly to health-conscious consumers.'
    ],
    marketDemand: 'Rapidly expanding premium market in metro cities with 40% price markup over conventional crops.',
    successStory: 'Meenakshi from Gujarat converted 2 acres into certified organic farm delivering weekly organic vegetable baskets to 120 families.',
    trainingResources: ['National Centre of Organic Farming (NCOF Ghaziabad)', 'PKVY Portal'],
    youtubeVideos: [
      { title: 'How to make Jeevamrutha at Home', url: 'https://www.youtube.com/results?search_query=Jeevamrutha+preparation' }
    ],
    faqs: [
      { question: 'How long does organic certification take?', answer: 'PGS-India Green scope card takes 1 year; full NPOP certification takes 3 years.' }
    ]
  },
  {
    id: 'biz-15',
    category: '🌾 Seed Production',
    title: 'Certified Breeder & Foundation Seed Business',
    icon: '🌾',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=60',
    overview: 'Produce high-purity Foundation & Certified seeds for Paddy, Wheat, Pulses, or Vegetables under State Seed Certification Agency supervision.',
    initialInvestment: '₹30,000 - ₹60,000 / Acre',
    profitEstimate: '₹70,000 - ₹1.6 Lakhs per season',
    requiredLand: '2 - 5 Acres with isolation distance from other fields',
    requiredSkills: ['Genetic rouging (removing off-types)', 'Seed moisture testing', 'Purity maintenance'],
    equipmentNeeded: ['Seed Cleaner & Grader', 'Moisture Meter', 'Bag Stitcher'],
    governmentSubsidies: 'Sub-Mission on Seeds and Planting Material (SMSP) offers up to 50% infrastructure aid.',
    requiredLicenses: ['State Seed License from District Agriculture Officer'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Procure Breeder Seeds from Agricultural University / NSC.',
      'Maintain compulsory isolation distance (e.g. 3 meters for Paddy, 200m for Corn).',
      'Rogue out off-type plants during flowering and pre-harvest stages.',
      'Invite State Seed Inspector for field inspection at flowering & maturity.',
      'Process, grade, pack with certification tags, and market to farmers.'
    ],
    marketDemand: 'Constant mandatory need for certified high-germination seed replacement by farmers.',
    successStory: 'Satish Seed Farm produced 15 Tons of Certified Basmati Seed netting ₹6 Lakhs profit in one season.',
    trainingResources: ['National Seeds Corporation (NSC)', 'State Seed Certification Agency'],
    youtubeVideos: [
      { title: 'Certified Seed Production Standards', url: 'https://www.youtube.com/results?search_query=Certified+Seed+Production+Process' }
    ],
    faqs: [
      { question: 'What is isolation distance?', answer: 'The minimum physical distance required between seed crop and other varieties to prevent cross-pollination.' }
    ]
  },
  {
    id: 'biz-16',
    category: '🧪 Fertilizer Business',
    title: 'Retail Agri-Input & Bio-Fertilizer Depot',
    icon: '🧪',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=60',
    overview: 'Open an authorized retail shop selling certified NPK fertilizers, micronutrients, bio-fertilizers, and organic pest remedies.',
    initialInvestment: '₹1.5 Lakhs - ₹4 Lakhs',
    profitEstimate: '₹30,000 - ₹85,000 monthly margin',
    requiredLand: '200 - 500 sq.ft commercial shop store',
    requiredSkills: ['Soil testing interpretation', 'POS machine operation', 'Chemical storage safety'],
    equipmentNeeded: ['PoS Machine for iFMS Aadhaar sale', 'Digital Weighing Scale', 'Storage Racks'],
    governmentSubsidies: 'Pradhan Mantri Kisan Samriddhi Kendras (PMKSK) branding and operational support.',
    requiredLicenses: ['Fertilizer Retail License', 'Pesticide Sale License from Agriculture Dept'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Obtain 15-day Certificate Course in Agri-Input Management or B.Sc Agriculture degree.',
      'Apply online on State Agriculture Portal for Retail Fertilizer & Pesticide license.',
      'Rent a dry ventilated shop with concrete floor and pest-proof doors.',
      'Procure stock directly from IFFCO, KRIBHCO, or licensed distributors.',
      'Sell subsidized fertilizer via Aadhaar PoS machine at MRP.'
    ],
    marketDemand: 'Essential year-round requirement for every single farming household in the district.',
    successStory: 'Kalyan opened a PMKSK shop in his village and now serves 800 regular farmers with ₹1 Lakh monthly margin.',
    trainingResources: ['MANAGE 15-day Input Dealer Course (DAESI)', 'State Agri Dept'],
    youtubeVideos: [
      { title: 'How to Get Fertilizer Shop License in India', url: 'https://www.youtube.com/results?search_query=Fertilizer+Shop+License+Process' }
    ],
    faqs: [
      { question: 'Is B.Sc Agriculture compulsory for input shop?', answer: 'No, a 1-year DAESI diploma conducted by MANAGE also qualifies any citizen to get a license.' }
    ]
  },
  {
    id: 'biz-17',
    category: '🚜 Farm Machinery Rental',
    title: 'Custom Hiring Center (CHC) for Machinery',
    icon: '🚜',
    imageUrl: 'https://images.unsplash.com/photo-1530267981608-d106670b8f4e?w=600&auto=format&fit=crop&q=60',
    overview: 'Establish a machinery rental hub supplying Tractors, Combined Harvesters, Power Weeders, and Drones to small farmers on hourly rates.',
    initialInvestment: '₹2 Lakhs - ₹10 Lakhs (assisted by subsidy)',
    profitEstimate: '₹40,000 - ₹1.2 Lakhs monthly net rental earnings',
    requiredLand: '1000 sq.ft covered yard for machinery parking & maintenance',
    requiredSkills: ['Diesel engine maintenance', 'Equipment booking app usage', 'Tractor operation'],
    equipmentNeeded: ['45HP Tractor', 'Rotavator', 'Laser Leveler', 'Power Sprayer'],
    governmentSubsidies: 'FARMS CHC Scheme provides 40% to 80% capital subsidy (up to ₹8 Lakhs) for rural youth.',
    requiredLicenses: ['Commercial Vehicle Permit', 'CHC Registration on Govt App'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Register on Ministry of Agriculture CHC portal (FARMS app).',
      'Apply for 80% subsidy grant under Sub-Mission on Agricultural Mechanization.',
      'Procure essential machinery: 45HP tractor, rotavator, seed drill, and brush cutter.',
      'List machinery on the Govt FARMS rental app.',
      'Provide hourly field tilling and harvesting services to nearby farmers.'
    ],
    marketDemand: 'Heavy demand due to acute village labor shortage and high cost of individual machinery purchase.',
    successStory: 'Ravi established a CHC unit with ₹6 Lakhs subsidy, renting rotavators to 150 farmers per season.',
    trainingResources: ['Agri Engineering Dept', 'Tractor Manufacturer Training Hubs'],
    youtubeVideos: [
      { title: 'Custom Hiring Center 80% Subsidy Scheme', url: 'https://www.youtube.com/results?search_query=Custom+Hiring+Center+Subsidy' }
    ],
    faqs: [
      { question: 'Who is eligible for CHC subsidy?', answer: 'Individual farmers, rural entrepreneurs, FPOs, and SHGs are eligible.' }
    ]
  },
  {
    id: 'biz-18',
    category: '🛒 Agri Store',
    title: 'Smart Village Farmer Mart & One-Stop Center',
    icon: '🛒',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60',
    overview: 'Comprehensive rural retail store combining certified seeds, bio-pesticides, drip accessories, cattle feed, and soil testing services.',
    initialInvestment: '₹1 Lakh - ₹3 Lakhs',
    profitEstimate: '₹25,000 - ₹60,000 monthly profit',
    requiredLand: '300 - 600 sq.ft retail space on main village road',
    requiredSkills: ['Customer relationship', 'Stock management', 'Digital UPI payments'],
    equipmentNeeded: ['Soil Testing Kit', 'Billing Software & Printer', 'Product Display Shelves'],
    governmentSubsidies: 'PM Mudra Loan up to ₹10 Lakhs without collateral.',
    requiredLicenses: ['GST Registration', 'Shop & Establishment License'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Secure a ground floor shop location accessible for farmers with tractor trolleys.',
      'Stock multi-brand cattle feeds, bio-stimulants, tarpaulin sheets, and hand sprayers.',
      'Add a rapid portable digital soil testing kit to offer ₹100 soil reports.',
      'Setup WhatsApp ordering group for village farmers.',
      'Offer home/field delivery of heavy items like seed bags.'
    ],
    marketDemand: 'High convenience demand saving farmers long trips to distant city markets.',
    successStory: 'Arun opened "Kisan Sewa Kendra" in his village generating ₹45,000 monthly with 400 happy farmer clients.',
    trainingResources: ['Agri Startup Incubation Centers', 'Mudra Scheme Portal'],
    youtubeVideos: [
      { title: 'Agri Retail Store Setup Guide', url: 'https://www.youtube.com/results?search_query=Agri+Input+Store+Business' }
    ],
    faqs: [
      { question: 'What products give maximum profit margin?', answer: 'Bio-stimulants, micronutrients, drip fittings, and vegetable seed packets (20-35% margin).' }
    ]
  },
  {
    id: 'biz-19',
    category: '🌿 Plant Nursery',
    title: 'Commercial Fruit & Ornamental Plant Nursery',
    icon: '🌿',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=60',
    overview: 'Propagate grafted fruit saplings (Mango, Guava, Lemon), timber trees, and ornamental houseplants in polybags for wholesale & retail sale.',
    initialInvestment: '₹20,000 - ₹50,000',
    profitEstimate: '₹35,000 - ₹90,000 monthly profit',
    requiredLand: '0.25 - 0.5 Acre with shade net and water source',
    requiredSkills: ['Wedge grafting', 'Air layering', 'Potting mix formulation'],
    equipmentNeeded: ['Shade Net (50% green)', 'Grafting Tape & Knife', 'Micro-sprinklers', 'Polybags'],
    governmentSubsidies: 'National Horticulture Board (NHB) provides 50% subsidy for commercial accredited nurseries.',
    requiredLicenses: ['State Horticulture Nursery Registration License'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Erect a 50% green shade net enclosure over land.',
      'Prepare light potting mixture using red soil, coco peat, and vermicompost (1:1:1).',
      'Collect healthy mother plant budwood for grafting on local rootstocks.',
      'Perform wedge grafting on 6-month-old rootstock saplings.',
      'Sell 1-year-old certified disease-free grafted fruit trees at ₹80-₹250 per sapling.'
    ],
    marketDemand: 'High demand from orchard farmers, urban terrace gardeners, and government greening drives.',
    successStory: 'Lakshmi Nursery sold 25,000 grafted Lemon & Guava plants in one monsoon netting ₹6 Lakhs.',
    trainingResources: ['NHB Nursery Accreditation Scheme', 'IIHR Nursery Workshop'],
    youtubeVideos: [
      { title: 'Mango & Guava Grafting Techniques in Nursery', url: 'https://www.youtube.com/results?search_query=Plant+Nursery+Grafting+Techniques' }
    ],
    faqs: [
      { question: 'What is the success rate of wedge grafting?', answer: 'With skilled labor and proper humidity, wedge grafting success rate exceeds 85-90%.' }
    ]
  },
  {
    id: 'biz-20',
    category: '💧 Drip Irrigation Business',
    title: 'Drip & Micro-Irrigation Contracting Agency',
    icon: '💧',
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=60',
    overview: 'Design, supply, and install micro-drip irrigation systems, disc filters, and venturi fertigation units for farms under government subsidy schemes.',
    initialInvestment: '₹50,000 - ₹1.5 Lakhs',
    profitEstimate: '₹45,000 - ₹1.1 Lakhs monthly turnover',
    requiredLand: '150 sq.ft store for holding pipes, drippers, and fittings',
    requiredSkills: ['Pipe pressure calculation', 'Pump head sizing', 'Plumbing layout design'],
    equipmentNeeded: ['Pipe Cutter', 'Punch Tool', 'Pressure Gauge', 'Venturi Injector'],
    governmentSubsidies: 'PM Krishi Sinchayee Yojana (PMKSY) offers 55% to 100% subsidy for farmers installing drip.',
    requiredLicenses: ['Empanelment as Authorized Drip Installer with State Micro-Irrigation Society'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Complete diploma or technical training in agricultural hydraulics.',
      'Register as authorized dealer for reputed drip brands (Jain, Netafim, Finolex).',
      'Conduct field GPS survey for farmers applying for PMKSY subsidy.',
      'Lay main line, sub-main PVC pipes, and 16mm inline lateral dripper lines.',
      'Install hydrocyclone sand filter and venturi suction fertigation kit.'
    ],
    marketDemand: 'Mandatory adoption as groundwater tables decline and government subsidizes drip up to 100%.',
    successStory: 'Sanjay installed drip systems for 80 farmers in 1 year under PMKSY earning ₹8 Lakhs commission.',
    trainingResources: ['National Bank for Agriculture and Rural Development (NABARD)', 'PMKSY Portal'],
    youtubeVideos: [
      { title: 'Drip Irrigation Installation Step by Step', url: 'https://www.youtube.com/results?search_query=Drip+Irrigation+Installation' }
    ],
    faqs: [
      { question: 'How much water does drip irrigation save?', answer: 'Drip saves 40% to 70% water while increasing crop yield by 20% to 40%.' }
    ]
  },
  {
    id: 'biz-21',
    category: '📦 Food Processing',
    title: 'Mini Fruit & Vegetable Processing Unit',
    icon: '📦',
    imageUrl: 'https://images.unsplash.com/photo-1509358217950-4ff11530e281?w=600&auto=format&fit=crop&q=60',
    overview: 'Process surplus seasonal fruits into long shelf-life pickles, jams, fruit pulps, dehydrated chips, and tomato puree.',
    initialInvestment: '₹40,000 - ₹1.8 Lakhs',
    profitEstimate: '₹30,000 - ₹80,000 monthly income',
    requiredLand: '300 sq.ft clean hygienic processing kitchen room',
    requiredSkills: ['Food preservation techniques', 'Brix refractometer testing', 'Pouch sealing'],
    equipmentNeeded: ['Steam Jacketed Kettle', 'Dehydrator Dryer', 'Pouch Band Sealer', 'Pulper Machine'],
    governmentSubsidies: 'PM Formalisation of Micro Food Processing Enterprises (PMFME) scheme provides 35% credit-linked subsidy.',
    requiredLicenses: ['FSSAI Food Manufacturer License', 'GST Registration'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Procure low-cost seasonal surplus produce (e.g. Tomato at ₹5/kg or Mango).',
      'Wash, peel, and process into thick puree or dehydrated sun-dried slices.',
      'Add permitted food preservatives (Sodium Benzoate / Potassium Metabisulfite).',
      'Hot fill into sterilised glass jars or stand-up zipper pouches.',
      'Affix nutrition label with FSSAI license number and retail to supermarkets.'
    ],
    marketDemand: 'Surging demand for ready-to-cook packaged tomato paste, garlic paste, and fruit jams.',
    successStory: 'SHG group of 5 women scaled tomato puree processing earning ₹1.5 Lakhs monthly during peak glut season.',
    trainingResources: ['CFTRI Mysore (Central Food Technological Research Institute)', 'PMFME Portal'],
    youtubeVideos: [
      { title: 'Tomato Puree Processing Unit Setup', url: 'https://www.youtube.com/results?search_query=Tomato+Puree+Processing+Business' }
    ],
    faqs: [
      { question: 'What is the PMFME subsidy limit?', answer: '35% subsidy up to a maximum limit of ₹10 Lakhs per enterprise.' }
    ]
  },
  {
    id: 'biz-22',
    category: '🥜 Groundnut Processing',
    title: 'Groundnut Oil Pressing & Decorticating Unit',
    icon: '🥜',
    imageUrl: 'https://images.unsplash.com/photo-1567892899233-0d117055009f?w=600&auto=format&fit=crop&q=60',
    overview: 'Decorticate raw groundnuts and extract 100% pure cold-pressed unrefined groundnut oil and high-protein oil cake for cattle feed.',
    initialInvestment: '₹1.2 Lakhs - ₹3.5 Lakhs',
    profitEstimate: '₹45,000 - ₹1.2 Lakhs monthly net profit',
    requiredLand: '400 sq.ft processing shed with 3-phase electricity',
    requiredSkills: ['Cold press oil expeller operation', 'Seed moisture checking', 'Oil filtration'],
    equipmentNeeded: ['Groundnut Decorticator Sheller', 'Cold Press Wooden/Steel Oil Ghani', 'Oil Filter Press'],
    governmentSubsidies: 'PMFME scheme offers 35% subsidy on oil expeller equipment.',
    requiredLicenses: ['FSSAI License', 'Trade License'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Shell dried raw groundnut pods using decorticator machine.',
      'Feed clean peanut kernels into cold press wooden expeller machine.',
      'Collect unheated golden virgin groundnut oil.',
      'Filter oil through cotton filter press without chemical bleaching.',
      'Package in 1L tin cans / bottles and sell oil cake to local dairy farmers.'
    ],
    marketDemand: 'Immense consumer preference shift away from refined oils to authentic cold-pressed (Wood Ghani) cooking oil.',
    successStory: 'Ramesh set up a single wooden oil ghani and now sells 800 Litres of pure peanut oil monthly at ₹240/Litre.',
    trainingResources: ['KVIC Oil Processing Center', 'State Industry Department'],
    youtubeVideos: [
      { title: 'Cold Press Wooden Oil Ghani Business', url: 'https://www.youtube.com/results?search_query=Cold+pressed+oil+business' }
    ],
    faqs: [
      { question: 'How much oil is extracted from 100kg groundnut kernels?', answer: 'Yields approximately 40 to 45 Litres of pure oil and 55kg of high-value oil cake.' }
    ]
  },
  {
    id: 'biz-23',
    category: '🥥 Coconut Products',
    title: 'Virgin Coconut Oil & Coir Pith Block Unit',
    icon: '🥥',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=60',
    overview: 'Process coconut husk into compressed Coco Peat substrate blocks for export and extract premium Virgin Coconut Oil (VCO).',
    initialInvestment: '₹1.5 Lakhs - ₹4.5 Lakhs',
    profitEstimate: '₹50,000 - ₹1.5 Lakhs monthly net margin',
    requiredLand: '0.25 Acre yard for coir drying',
    requiredSkills: ['Husk defibering', 'Coir pith hydraulic block compression', 'Centrifugal VCO separation'],
    equipmentNeeded: ['Coir Pith Hydraulic Baler Press', 'Coconut Disintegrator', 'VCO Centrifuge'],
    governmentSubsidies: 'Coir Board Coir Udyami Yojana provides 40% credit-linked capital subsidy.',
    requiredLicenses: ['Coir Board Registration', 'FSSAI License'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Collect coconut husks from local copra farmers.',
      'Pass husks through decorticator machine to separate coir fiber from pith powder.',
      'Washing coir pith to reduce Electrical Conductivity (EC < 0.5 mS/cm).',
      'Compress dry pith into 5kg Coco Peat blocks using hydraulic press machine.',
      'Wrap blocks and supply to polyhouse growers, nurseries, and export firms.'
    ],
    marketDemand: 'Booming global demand for Coco Peat as sustainable soil-less growing medium in greenhouse farming.',
    successStory: 'Prabakar exported 20 Tons of low-EC Coco Peat blocks to Netherlands netting ₹4 Lakhs profit per container.',
    trainingResources: ['Coir Board Training Center (Pollachi / Alappuzha)', 'CDB Kochi'],
    youtubeVideos: [
      { title: 'Coir Pith Block Making Business Guide', url: 'https://www.youtube.com/results?search_query=Coco+peat+block+making+business' }
    ],
    faqs: [
      { question: 'What is low EC coco peat?', answer: 'Coco peat washed with fresh water to remove salts (EC < 0.5), essential for root development.' }
    ]
  },
  {
    id: 'biz-24',
    category: '☕ Coffee Farming',
    title: 'Shade-Grown Arabica & Robusta Coffee Estate',
    icon: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=60',
    overview: 'Cultivate shade-grown high-altitude Arabica or Robusta coffee intercropped with Pepper vines and Silver Oak trees.',
    initialInvestment: '₹50,000 - ₹1 Lakh / Acre',
    profitEstimate: '₹1.8 Lakhs - ₹4 Lakhs / Acre annual yield',
    requiredLand: '1 - 5 Acres in hilly elevation zones (800m - 1500m MSL)',
    requiredSkills: ['Coffee pulping', 'Fermentation timing', 'Parchment sun drying'],
    equipmentNeeded: ['Coffee Pulper Machine', 'Drying Patio Net', 'Moisture Tester'],
    governmentSubsidies: 'Coffee Board of India provides subsidy up to 40% for re-plantation & pulper machinery.',
    requiredLicenses: ['Coffee Board Registration ID'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Plant Silver Oak trees to establish 50% overhead shade canopy.',
      'Plant disease-resistant Chandragiri or S.795 coffee seedlings.',
      'Prune bushes annually after harvest to encourage fruit bearing lateral wood.',
      'Harvest ripe red coffee cherry berries selectively by hand.',
      'Pulp cherries using water pulper to prepare premium Parchment Coffee beans.'
    ],
    marketDemand: 'Unmatched global and domestic demand from specialty artisanal cafe chains and coffee roasters.',
    successStory: 'Siddharth from Coorg produced specialty single-origin Arabica netting ₹350/kg direct from roasters.',
    trainingResources: ['Central Coffee Research Institute (CCRI Chikmagalur)', 'Coffee Board Portal'],
    youtubeVideos: [
      { title: 'Coffee Plantation Processing & Pulper Operation', url: 'https://www.youtube.com/results?search_query=Coffee+Plantation+Processing' }
    ],
    faqs: [
      { question: 'What is the difference between Arabica and Robusta?', answer: 'Arabica grows at higher altitudes with aromatic mild flavor; Robusta is lower altitude, hardy with higher caffeine.' }
    ]
  },
  {
    id: 'biz-25',
    category: '🍵 Tea Plantation',
    title: 'High-Altitude CTC & Specialty Green Tea Garden',
    icon: '🍵',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=60',
    overview: 'Manage smallholder tea gardens yielding fine two-leaves-and-a-bud fresh tea flushes for tea factory supply or specialty green tea processing.',
    initialInvestment: '₹60,000 - ₹1.2 Lakhs / Acre',
    profitEstimate: '₹1.2 Lakhs - ₹3.2 Lakhs / Acre per year',
    requiredLand: '1 - 3 Acres on sloping hill terrain',
    requiredSkills: ['Fine plucking technique', 'Pruning cycle management', 'Withering control'],
    equipmentNeeded: ['Tea Pruning Machine', 'Motorized Plucking Machine', 'Leaf Weighing Scale'],
    governmentSubsidies: 'Tea Board of India provides up to 50% capital subsidy for small tea growers.',
    requiredLicenses: ['Tea Board Small Tea Grower (STG) Card'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Plant high-yielding TV-cloned tea saplings on contour terraces.',
      'Prune tea table bushes at 22-inch height every 4 years.',
      'Pluck fresh "two leaves and a bud" green shoot flushes every 8-10 days.',
      'Transport fresh green leaves immediately in airy woven leaf bags.',
      'Supply directly to local bought-leaf tea factories.'
    ],
    marketDemand: 'Constant domestic tea drinking staple combined with premium export prices for Green & Orthodox teas.',
    successStory: 'Nilgiris Small Tea Grower Association member plucks 1500kg green leaf monthly with steady ₹45,000 profit.',
    trainingResources: ['UPASI Tea Research Foundation (Valparai)', 'Tea Board India'],
    youtubeVideos: [
      { title: 'Smallholder Tea Plantation Management', url: 'https://www.youtube.com/results?search_query=Tea+Plantation+Management' }
    ],
    faqs: [
      { question: 'How often are tea leaves plucked?', answer: 'Plucking occurs every 7 to 10 days during active growing monsoon seasons.' }
    ]
  },
  {
    id: 'biz-26',
    category: '🌶 Spice Farming',
    title: 'Black Pepper, Cardamom & Chilli Processing',
    icon: '🌶',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=60',
    overview: 'Cultivate king of spices Black Pepper on live tree supports, Cardamom under forest shade, or High-Capsaicin Red Chillies.',
    initialInvestment: '₹30,000 - ₹80,000 / Acre',
    profitEstimate: '₹1.5 Lakhs - ₹4.5 Lakhs / Acre annual yield',
    requiredLand: '0.5 - 2 Acres',
    requiredSkills: ['Spice curing & drying', 'Thrips pest management', 'Grading by size'],
    equipmentNeeded: ['Spice Solar Dryer', 'Cardamom Curing Chamber', 'Grading Sieves'],
    governmentSubsidies: 'Spices Board India provides 33.33% to 50% financial assistance for solar dryers and replanting.',
    requiredLicenses: ['Spices Board CRES Certificate'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Train Panniyur-1 Black Pepper runner vines on Arecanut or Silver Oak trunks.',
      'Drench vine base with Trichoderma bio-fungicide to prevent quick wilt disease.',
      'Harvest fully mature pepper spikes when 1-2 berries turn bright orange-red.',
      'Blanch harvested berries in hot water for 1 minute for uniform black color.',
      'Sun-dry on solar green-house dryer to under 10% moisture content.'
    ],
    marketDemand: 'World-renowned demand for Indian origin high-piperine Black Pepper and Alleppey Green Cardamom.',
    successStory: 'George from Wayanad harvested 800kg dried black pepper intercropped in Arecanut, generating ₹4 Lakhs.',
    trainingResources: ['Indian Institute of Spices Research (IISR Kozhikode)', 'Spices Board India'],
    youtubeVideos: [
      { title: 'Black Pepper Cultivation & Curing Process', url: 'https://www.youtube.com/results?search_query=Black+Pepper+Cultivation' }
    ],
    faqs: [
      { question: 'What causes Quick Wilt in pepper and how to treat?', answer: 'Phytophthora fungus causes quick wilt; control by soil drenching Trichoderma viride and Bordeaux mixture.' }
    ]
  },
  {
    id: 'biz-27',
    category: '🌳 Timber Plantation',
    title: 'High-Value Teak, Mahogany & Sandalwood Estate',
    icon: '🌳',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=60',
    overview: 'Long-term agroforestry investment planting high-value Red Sanders, Teak, African Mahogany, or Sandalwood along farm boundaries.',
    initialInvestment: '₹25,000 - ₹50,000 (100 Trees)',
    profitEstimate: '₹25 Lakhs - ₹1 Crore return after 12-15 years',
    requiredLand: 'Boundary fencing or 1 Acre agroforestry block',
    requiredSkills: ['Pruning straight trunk formation', 'Termite protection', 'Tree girth monitoring'],
    equipmentNeeded: ['Drip Basin Kit', 'Pruning Saw', 'Tree Guard Nets'],
    governmentSubsidies: 'National Agroforestry Policy provides free saplings and 50% maintenance grant.',
    requiredLicenses: ['Tree Felling & Transit Permit from State Forest Department'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Dig 3x3 feet pits along field perimeters spaced 8 feet apart.',
      'Plant tissue-culture straight-growing Mahogany or Teak saplings.',
      'Install drip irrigation and protect young trees with tree guards against goats.',
      'Prune side branches up to 15 feet height every 6 months to create knot-free timber.',
      'Harvest mature 45-inch girth timber logs after 12-15 years.'
    ],
    marketDemand: 'Ever-increasing prices for furniture hardwood, interior construction, and timber exports.',
    successStory: 'Farmer Mohan planted 200 Mahogany trees on farm boundary 12 years ago; harvested timber valued at ₹32 Lakhs.',
    trainingResources: ['Institute of Wood Science and Technology (IWST Bengaluru)', 'State Forest Dept'],
    youtubeVideos: [
      { title: 'Mahogany & Teak Tree Plantation Guide', url: 'https://www.youtube.com/results?search_query=Mahogany+Tree+Plantation' }
    ],
    faqs: [
      { question: 'Is growing Sandalwood legal in India now?', answer: 'Yes, private individuals can legally grow Sandalwood; state forest departments assist in harvesting & sale.' }
    ]
  },
  {
    id: 'biz-28',
    category: '♻ Vermicompost Business',
    title: 'Commercial Organic Vermicompost Production',
    icon: '♻',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=60',
    overview: 'Convert farm organic waste, cow dung, and dry leaves into premium worm compost using Eisenia fetida red earthworms.',
    initialInvestment: '₹8,000 - ₹30,000',
    profitEstimate: '₹20,000 - ₹55,000 monthly income',
    requiredLand: '500 sq.ft shaded backyard space',
    requiredSkills: ['Moisture checking (60%)', 'Earthworm care', 'Compost sieving'],
    equipmentNeeded: ['HDPE Vermi Beds (12x4x2 ft)', 'Eisenia fetida Worms', 'Rotary Sieving Machine'],
    governmentSubsidies: 'Swachh Bharat & PKVY offer 50% subsidy on HDPE vermi-beds.',
    requiredLicenses: ['Local Panchayat Permit / FSSAI (if selling branded)'],
    riskLevel: 'Low Risk',
    stepByStepGuide: [
      'Install UV-stabilized 12x4x2 feet portable HDPE vermi-beds under shade trees.',
      'Layer bed bottom with 4 inches dry straw, followed by 15-day pre-decomposed cow dung.',
      'Introduce 5kg red earthworms (Eisenia fetida) per bed.',
      'Keep bed moist by light water sprinkling every 2 days.',
      'Harvest granular black "black gold" vermicompost every 45 days using 4mm sieve.'
    ],
    marketDemand: 'Immense demand from nursery owners, terrace gardeners, and organic tea/fruit growers.',
    successStory: 'Ramesh started with 2 beds costing ₹5,000; now operates 60 beds producing 15 Tons monthly selling at ₹6/kg.',
    trainingResources: ['KVK Vermicomposting Unit', 'Organic Farming Association'],
    youtubeVideos: [
      { title: 'HDPE Vermicompost Bed Setup Step by Step', url: 'https://www.youtube.com/results?search_query=Vermicompost+bed+setup' }
    ],
    faqs: [
      { question: 'How fast do red earthworms multiply?', answer: 'Eisenia fetida worms double their population every 60 to 90 days under optimum moisture.' }
    ]
  },
  {
    id: 'biz-29',
    category: '🌱 Hydroponics',
    title: 'Soil-less NFT & Deep Water Hydroponics Unit',
    icon: '🌱',
    imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&auto=format&fit=crop&q=60',
    overview: 'High-tech soil-less indoor or polyhouse farming growing pesticide-free Exotic Lettuce, Basil, Strawberries, and Spinach using Nutrient Film Technique (NFT).',
    initialInvestment: '₹80,000 - ₹3 Lakhs',
    profitEstimate: '₹40,000 - ₹1.1 Lakhs monthly continuous income',
    requiredLand: '200 - 800 sq.ft terrace or indoor climate room',
    requiredSkills: ['EC & pH meter balancing', 'Nutrient dosing formula', 'Pump timer calibration'],
    equipmentNeeded: ['UPVC Food-Grade NFT Channels', 'EC & pH Meters', 'Submersible Pump', 'Net Cups & Clay Balls'],
    governmentSubsidies: 'State Innovation Grants & MIDH offer up to 40% subsidy for urban hydroponic systems.',
    requiredLicenses: ['FSSAI License for hydroponic produce'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Assemble UPVC food-grade A-frame NFT channels with slope inclination.',
      'Sow Italian Basil or Romaine Lettuce seeds in net cups filled with rockwool.',
      'Fill water reservoir with balanced A&B hydroponic nutrient solution.',
      'Maintain EC at 1.8 - 2.2 mS/cm and pH at 5.8 - 6.2.',
      'Harvest clean, root-intact pesticide-free leafy vegetables in 30 days.'
    ],
    marketDemand: 'Premium pricing at gourmet supermarkets, salad bars, and luxury hotel kitchens.',
    successStory: 'Rahul setup a 400 sq.ft rooftop NFT hydroponics farm delivering 600 lettuce heads weekly at ₹60 per head.',
    trainingResources: ['Indian Society of Hydroponics', 'IIT Kharagpur Agri Wing'],
    youtubeVideos: [
      { title: 'NFT Hydroponic System Assembly & Dosing', url: 'https://www.youtube.com/results?search_query=NFT+Hydroponics+Assembly' }
    ],
    faqs: [
      { question: 'How much water does hydroponics save compared to soil?', answer: 'Hydroponics recirculates water, saving up to 90% water compared to soil farming.' }
    ]
  },
  {
    id: 'biz-30',
    category: '🏡 Greenhouse Farming',
    title: 'Climate-Controlled Polyhouse & Shade-Net Unit',
    icon: '🏡',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=60',
    overview: 'Construct 1000 sq.meter GI structure naturally ventilated polyhouse to produce off-season Dutch Roses, Colored Capsicum, or Seedless Cucumbers.',
    initialInvestment: '₹2.5 Lakhs - ₹6 Lakhs (after 80% subsidy)',
    profitEstimate: '₹1.5 Lakhs - ₹4 Lakhs net yearly profit',
    requiredLand: '1000 sq.meters (0.25 Acre)',
    requiredSkills: ['Climate vent control', 'Fogger operation', 'Drip fertigation schedule'],
    equipmentNeeded: ['200 Micron UV Film Polyhouse Structure', 'Top Vents', 'Foggers & Misters', 'Drip Controller'],
    governmentSubsidies: 'Mission for Integrated Development of Horticulture (MIDH) gives 50% to 80% subsidy.',
    requiredLicenses: ['Horticulture Department Registration'],
    riskLevel: 'Medium Risk',
    stepByStepGuide: [
      'Apply online on State Horticulture Portal for polyhouse subsidy approval.',
      'Erect GI pipe dome structure covered with 200-micron anti-drip UV stabilized film.',
      'Install 40-mesh insect proof net on side roll-up curtains.',
      'Prepare raised beds enriched with cocopeat, vermicompost, and neem cake.',
      'Plant imported Dutch Rose or Red/Yellow Bell Pepper saplings.'
    ],
    marketDemand: 'Immense premium market for off-season vegetables and export-grade long-stem cut roses.',
    successStory: 'Sanjay from Pune harvested 40 Tons of colored bell peppers from a 1000 sq.m polyhouse earning ₹9 Lakhs net.',
    trainingResources: ['National Horticulture Board (NHB)', 'Precision Farming Development Center (PFDC)'],
    youtubeVideos: [
      { title: 'Polyhouse Construction & Colored Capsicum Farming', url: 'https://www.youtube.com/results?search_query=Polyhouse+Capsicum+Farming' }
    ],
    faqs: [
      { question: 'What is the life of 200 micron polyhouse film?', answer: 'High quality UV-stabilized film lasts 3 to 5 years before requiring sheet replacement.' }
    ]
  },
  {
    id: 'biz-31',
    category: '📦 Agri Export Business',
    title: 'Merchant & Direct Agricultural Export Agency',
    icon: '📦',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60',
    overview: 'Export fresh Indian Mangoes, Onions, Spices, Basmati Rice, or Grapes to Gulf (UAE/Saudi), Europe, and Southeast Asian markets.',
    initialInvestment: '₹2 Lakhs - ₹8 Lakhs',
    profitEstimate: '₹1.5 Lakhs - ₹5 Lakhs per container shipment',
    requiredLand: '1000 sq.ft APEDA approved packhouse facility',
    requiredSkills: ['Export documentation', 'Phytosanitary inspection', 'Cold chain reefer container logistics'],
    equipmentNeeded: ['Hot Water Treatment Tank (for Mango)', 'Grading Conveyor', 'Moisture Meter', 'Strapping Machine'],
    governmentSubsidies: 'APEDA Transport and Marketing Assistance (TMA) scheme reimburses freight costs.',
    requiredLicenses: ['IEC (Import Export Code)', 'APEDA Registration (RCMC)', 'FSSAI Export License'],
    riskLevel: 'High Risk',
    stepByStepGuide: [
      'Obtain IEC code from DGFT portal and register with APEDA as Exporter.',
      'Source export-grade residue-free produce directly from registered farmer clusters.',
      'Process produce in APEDA-accredited Packhouse (washing, hot water dip, sorting).',
      'Pack in vented corrugated fiberboard (CFB) boxes with Phytosanitary Certificate.',
      'Ship via 40-foot Reefer cold container from JNPT / Chennai port under LC payment terms.'
    ],
    marketDemand: 'Everlasting international demand for authentic Indian Alphonso mangoes, spices, and Basmati rice.',
    successStory: 'Suresh exported 3 containers of Fresh Pomegranates to Dubai netting ₹11 Lakhs profit in one season.',
    trainingResources: ['APEDA Exporter Training Workshops', 'Indian Institute of Foreign Trade (IIFT)'],
    youtubeVideos: [
      { title: 'How to Start Agri Export Business from India', url: 'https://www.youtube.com/results?search_query=Agri+Export+Business+India' }
    ],
    faqs: [
      { question: 'What payment terms are safest for new exporters?', answer: 'Confirmed Irrevocable Letter of Credit (LC at sight) or 30% advance with 70% against BL copy.' }
    ]
  }
];

export default function CareerGuidanceTab({ 
  userProfile, 
  isEasyMode, 
  isOffline, 
  onSaveItem 
}: CareerGuidanceTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const categories = ['All', ...Array.from(new Set(AGRI_BUSINESS_HUB.map(b => b.category)))];

  const filteredIdeas = AGRI_BUSINESS_HUB.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveIdea = (idea: BusinessIdea) => {
    onSaveItem({
      type: 'career',
      title: `Agri Business: ${idea.title}`,
      data: idea
    });
    setSavedStatus(prev => ({ ...prev, [idea.id]: true }));
    voiceController.speakInstruction('save_success', userProfile.preferredLanguage);
  };

  const handleSpeakOverview = (idea: BusinessIdea) => {
    const speechText = `${idea.title}. Category: ${idea.category}. Overview: ${idea.overview}. Initial Investment: ${idea.initialInvestment}. Expected Profit: ${idea.profitEstimate}. Risk level: ${idea.riskLevel}. Government subsidies: ${idea.governmentSubsidies}.`;
    voiceController.speak(speechText, userProfile.preferredLanguage);
  };

  const handleDownloadGuidePdf = (idea: BusinessIdea) => {
    const textContent = `
==================================================
AGRICULTURE BUSINESS BLUEPRINT: ${idea.title.toUpperCase()}
==================================================
Category: ${idea.category}
Risk Level: ${idea.riskLevel}

1. OVERVIEW:
${idea.overview}

2. FINANCIALS & ASSETS:
- Initial Investment: ${idea.initialInvestment}
- Estimated Profit: ${idea.profitEstimate}
- Required Land: ${idea.requiredLand}

3. REQUIRED SKILLS & EQUIPMENT:
- Skills: ${idea.requiredSkills.join(', ')}
- Equipment: ${idea.equipmentNeeded.join(', ')}

4. GOVERNMENT SUBSIDIES & LICENSES:
- Subsidies: ${idea.governmentSubsidies}
- Required Licenses: ${idea.requiredLicenses.join(', ')}

5. STEP-BY-STEP STARTUP GUIDE:
${idea.stepByStepGuide.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

6. MARKET DEMAND & SUCCESS STORY:
- Market Demand: ${idea.marketDemand}
- Success Story: ${idea.successStory}

7. FREQUENTLY ASKED QUESTIONS:
${idea.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}
==================================================
Generated by AgriGPT Business Hub
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_Guide.txt`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`📥 Downloaded Business Guide for ${idea.title}!`);
  };

  return (
    <div id="agri-business-hub-container" className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 text-emerald-200 text-xs font-black px-3 py-1 rounded-full mb-2">
              <Briefcase className="w-3.5 h-3.5 text-amber-300" /> Complete 31-Category Agri-Business Hub
            </div>
            <h2 className="text-2xl font-black text-white">
              Agriculture Business & Startup Directory
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Explore step-by-step blueprints, initial investment, profit models, government subsidies, equipment, and training resources across all 31 high-potential farming sectors.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 p-3.5 rounded-2xl border border-white/20 text-center">
            <span className="block text-2xl font-black text-amber-300">31</span>
            <span className="text-[10px] uppercase font-bold text-emerald-100">Verified Ideas</span>
          </div>
        </div>

        {/* Search Bar & Category filter */}
        <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              id="business-search-input"
              type="text"
              placeholder="Search business ideas (e.g. Dairy, Mushroom, Drip, Export, Hydroponics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-800 text-xs font-bold rounded-xl border-0 focus:ring-2 focus:ring-emerald-400 outline-none shadow-inner"
            />
          </div>

          <select
            id="business-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-emerald-950/80 text-emerald-100 border border-emerald-700 text-xs font-extrabold rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-emerald-900 text-white">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pill Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-emerald-100 hover:bg-emerald-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.map((idea) => (
          <div
            id={`biz-card-${idea.id}`}
            key={idea.id}
            className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div>
              {/* Image & Badge Overlay */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src={idea.imageUrl}
                  alt={idea.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <span className="absolute top-3 left-3 bg-emerald-900/90 text-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {idea.category}
                </span>

                <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-xs ${
                  idea.riskLevel === 'Low Risk' ? 'bg-green-600' :
                  idea.riskLevel === 'Medium Risk' ? 'bg-amber-600' : 'bg-red-600'
                }`}>
                  {idea.riskLevel}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-black flex items-center gap-1.5 leading-snug">
                    <span>{idea.icon}</span>
                    <span>{idea.title}</span>
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {idea.overview}
                </p>

                {/* Financial Summary Box */}
                <div className="grid grid-cols-2 gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-semibold uppercase">Investment</span>
                    <strong className="text-emerald-900 font-extrabold text-[11px] block">{idea.initialInvestment}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-semibold uppercase">Profit Return</span>
                    <strong className="text-emerald-900 font-extrabold text-[11px] block">{idea.profitEstimate}</strong>
                  </div>
                </div>

                {/* Land & Subsidies */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="font-semibold text-[11px]">Required Land:</span>
                    <span className="font-bold text-gray-800 text-[11px]">{idea.requiredLand}</span>
                  </div>
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100 font-semibold leading-tight">
                    🎁 <b>Subsidies:</b> {idea.governmentSubsidies}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 space-y-2">
              <button
                id={`view-details-btn-${idea.id}`}
                onClick={() => {
                  setSelectedIdea(idea);
                  setExpandedFaq(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-3xs flex items-center justify-center gap-1.5"
              >
                <span>View Complete Blueprint & Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  id={`speak-overview-btn-${idea.id}`}
                  onClick={() => handleSpeakOverview(idea)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] py-1.5 rounded-lg border border-emerald-200 transition-colors"
                >
                  🔊 Listen Overview
                </button>

                <button
                  id={`save-idea-btn-${idea.id}`}
                  onClick={() => handleSaveIdea(idea)}
                  disabled={savedStatus[idea.id]}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                    savedStatus[idea.id]
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {savedStatus[idea.id] ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedStatus[idea.id] ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED BUSINESS BLUEPRINT MODAL */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedIdea.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                    {selectedIdea.category}
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{selectedIdea.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedIdea(null)}
                className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-gray-800">
              
              {/* Top Overview banner */}
              <div className="flex flex-col md:flex-row gap-5 items-start bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <img
                  src={selectedIdea.imageUrl}
                  alt={selectedIdea.title}
                  className="w-full md:w-56 h-36 object-cover rounded-xl shadow-xs shrink-0"
                />
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-emerald-900">Business Overview</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{selectedIdea.overview}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg">
                      💰 Investment: {selectedIdea.initialInvestment}
                    </span>
                    <span className="text-[11px] font-extrabold bg-green-100 text-green-900 px-2.5 py-1 rounded-lg">
                      📈 Return: {selectedIdea.profitEstimate}
                    </span>
                    <span className="text-[11px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                      ⚠️ Risk: {selectedIdea.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Startup Guide */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wide flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" /> Step-by-Step Startup Guide
                </h4>
                <div className="space-y-2">
                  {selectedIdea.stepByStepGuide.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-200 text-xs">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-semibold text-gray-700 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment & Licenses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h5 className="text-xs font-extrabold text-gray-800 uppercase flex items-center gap-1.5">
                    ⚙️ Equipment Needed
                  </h5>
                  <ul className="space-y-1 text-xs text-gray-600 pl-1">
                    {selectedIdea.equipmentNeeded.map((eq, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span> {eq}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h5 className="text-xs font-extrabold text-gray-800 uppercase flex items-center gap-1.5">
                    📜 Required Licenses & Permits
                  </h5>
                  <ul className="space-y-1 text-xs text-gray-600 pl-1">
                    {selectedIdea.requiredLicenses.map((lic, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-amber-600 font-bold">•</span> {lic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Market Demand & Success Story */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-1.5">
                  <h5 className="text-xs font-black text-blue-900 uppercase">📊 Market Demand</h5>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">{selectedIdea.marketDemand}</p>
                </div>

                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 space-y-1.5">
                  <h5 className="text-xs font-black text-green-900 uppercase">🌟 Real Success Story</h5>
                  <p className="text-xs text-green-800 leading-relaxed font-medium">{selectedIdea.successStory}</p>
                </div>
              </div>

              {/* YouTube Learning Videos */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-red-700 uppercase tracking-wide flex items-center gap-2">
                  <Play className="w-4 h-4 text-red-600" /> Recommended Learning Videos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.youtubeVideos.map((vid, idx) => (
                    <a
                      key={idx}
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span>{vid.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" /> Frequently Asked Questions
                </h4>
                <div className="space-y-2">
                  {selectedIdea.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-extrabold text-gray-800"
                      >
                        <span>{faq.question}</span>
                        {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      {expandedFaq === idx && (
                        <div className="p-3.5 bg-white text-xs text-gray-600 border-t border-gray-200 leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleDownloadGuidePdf(selectedIdea)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-3xs"
              >
                <Download className="w-4 h-4" /> Download Full Business Guide (PDF/Text)
              </button>

              <button
                onClick={() => setSelectedIdea(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Close Blueprint
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

