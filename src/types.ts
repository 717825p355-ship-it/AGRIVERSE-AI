export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  preferredLanguage: 'English' | 'Tamil' | 'Hindi' | 'Telugu' | 'Kannada' | 'Malayalam' | 'Marathi' | 'Gujarati' | 'Punjabi' | 'Bengali' | 'Urdu' | 'Odia';
  country?: string;
  state: string;
  district: string;
  village: string;
  aadhaarNumber?: string;
  educationLevel: 'No Education' | 'Primary School' | 'High School' | 'Diploma' | 'Undergraduate' | 'Graduate';
  occupation: 'Farmer' | 'Student' | 'Agricultural Worker' | 'Business Owner' | 'Other';
  soilType?: string;
  landSize?: string; // in acres
  cropType?: string; // Primary crop grown e.g. Paddy, Wheat, Cotton, Sugarcane, Vegetables
  cropsGrown?: string[];
  annualIncome?: string; // e.g. ₹1,20,000
  category?: string; // Small & Marginal, General, SC/ST, OBC, Women Farmer
  irrigationAvailability?: string; // Borewell, Canal, Rainfed, Drip
  livestockDetails?: string[]; // Cows, Buffaloes, Goats, Poultry, Bees, None
  machineryOwned?: string[]; // Tractor, Harvester, Sprinkler, Power Tiller, None
  farmingPractice?: 'Organic' | 'Conventional' | 'Both';
  farmingBudget?: string;
  irrigationMethod?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  audioUrl?: string; // Optional generated TTS audio
  followUpQuestions?: string[];
  originalText?: string;
  translatedLang?: string;
  isTranslating?: boolean;
}

export interface FarmingReminder {
  id: string;
  title: string;
  description: string;
  cropName: string;
  date: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Harvest' | 'Weeding' | 'Market Visit' | 'Government Scheme' | 'Custom';
  repeat: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  completed: boolean;
  dateCreated: string;
}

export interface FarmerNote {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Crops' | 'Fertilizer' | 'Equipment' | 'Market' | 'Finance';
  isPinned: boolean;
  attachedImage?: string;
  voiceNoteText?: string;
  dateCreated: string;
  updatedAt: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  type: 'scheme' | 'disease' | 'weather' | 'mandi' | 'advisory' | 'calculator' | 'note' | 'reminder' | 'learning';
  timestamp: string;
  tabTarget: string;
  metadata?: any;
}

export interface CareerGuidance {
  title: string;
  description: string;
  requiredSkills: string[];
  educationRequired: string;
  estimatedInvestment: string;
  expectedIncome: string;
  governmentSupport: string;
  futureOpportunities: string;
  learningResources: string[];
}

export interface CropRecommendation {
  cropName: string;
  expectedYield: string;
  fertilizerSchedule: string[];
  irrigationSchedule: string[];
  harvestTime: string;
  marketValue: string;
  possibleDiseases: { name: string; prevention: string }[];
  description: string;
  varieties?: string[];
  imageUrl?: string;
  suitabilityScore?: string;
  idealSowingSeason?: string;
  seedQuantityRequired?: string;
  expectedGrowthDuration?: string;
  estimatedCultivationCost?: string;
  expectedProfit?: string;
  marketDemand?: string;
  governmentSubsidies?: string;
}

export interface SavedItem {
  id: string;
  type: 'crop' | 'career' | 'chat' | 'lesson' | 'analysis';
  title: string;
  timestamp: string;
  data: any; // Flexible format based on the saved item type
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LessonStep {
  title: string;
  description: string;
  imageUrl?: string;
  audioInstruction?: string; // Prompt text for audio instruction
}

export interface LearningLesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Medium' | 'Intermediate' | 'Advanced' | string;
  description: string;
  steps: LessonStep[];
  quiz: QuizQuestion[];
  imageUrl?: string;
}

export interface MarketPrice {
  cropName: string;
  priceRange: string; // e.g. "₹2,100 - ₹2,300 per Quintal"
  trend: 'up' | 'down' | 'stable';
  district: string;
}

export interface GovtScheme {
  id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility: string;
  howToApply: string;
}

export interface DistrictAgriProfile {
  districtName: string;
  stateName: string;
  country: string;
  climate: string;
  avgRainfall: string;
  tempRange: string;
  soilTypes: string[];
  irrigationSources: string[];
  majorCrops: string[];
  minorCrops: string[];
  horticultureCrops: string[];
  plantationCrops: string[];
  livestockInfo: string;
  cropRotation: string;
  kvkCenter?: string;
  dataSourceAttribution?: string;
}

export interface DetailedCropInfo {
  cropName: string;
  imageUrl?: string;
  description: string;
  suitableSoil: string;
  suitableClimate: string;
  bestSowingMonths: string;
  growingSeason: string;
  cropDuration: string;
  waterRequirement: string;
  fertilizerSchedule: string[];
  organicFarmingTips: string[];
  commonPests: string[];
  commonDiseases: string[];
  diseasePrevention: string[];
  harvestTime: string;
  storageMethods: string;
  expectedYield: string;
  averageMarketPrice: string;
  expectedProfit: string;
  governmentSchemes?: string;
  governmentSubsidies?: string;
  cultivationGuide: string;
  suitabilityScore?: string;
  profitPotential?: string;
  marketDemand?: string;
  cultivationCost?: string;
  estimatedIncome?: string;
  varieties?: string[];
}

export interface SeasonInfo {
  name: 'Kharif' | 'Rabi' | 'Zaid';
  months: string;
  description: string;
  majorCrops: string[];
  sowingMonths: string;
  harvestMonths: string;
  icon: string;
}

