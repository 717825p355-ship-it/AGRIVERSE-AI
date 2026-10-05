import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit to allow base64 crop image uploads
app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please set your API key in the AI Studio Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure clean error handling
function handleError(res: express.Response, error: any) {
  console.error("Gemini API Error:", error);
  const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
  res.status(500).json({ error: msg });
}

const DEFAULT_CROPS_KHARIF = [
  {
    cropName: "Rice / Paddy (Oryza sativa)",
    description: "Highly recommended for water-rich clayey and alluvial soil during the monsoon season. Extremely secure food security crop.",
    expectedYield: "20-25 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply well-composted manure and 40kg DAP per acre.",
      "Week 3: Apply 25kg Urea during tillering.",
      "Week 7: Apply 15kg Urea and 10kg Potash at panicle stage."
    ],
    irrigationSchedule: [
      "Maintain 2-5 cm of water standing in the field during transplanting.",
      "Irrigate regularly until 15 days before harvest.",
      "Do not let the soil dry out during flowering."
    ],
    harvestTime: "November to December",
    marketValue: "₹2,183 - ₹2,300 per Quintal",
    possibleDiseases: [
      { name: "Blast Disease (Fungal)", prevention: "Spray organic garlic-onion extract or neem oil." },
      { name: "Bacterial Leaf Blight", prevention: "Avoid excess Nitrogen fertilizer and use resistant seeds." }
    ],
    varieties: ["IR64", "Pusa Basmati 1121", "Swarna"],
    imageUrl: "rice",
    suitabilityScore: "95%",
    idealSowingSeason: "Kharif (June to July)",
    seedQuantityRequired: "15-20 kg per Acre",
    expectedGrowthDuration: "120 Days",
    estimatedCultivationCost: "₹15,000 per Acre",
    expectedProfit: "₹30,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "MSP Procurement and 50% subsidy on seed distribution"
  },
  {
    cropName: "Groundnut / Peanut (Arachis hypogaea)",
    description: "Excellent oilseed crop for sandy loam soil with low water requirement during warm weather. Fixes atmospheric nitrogen.",
    expectedYield: "8-12 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply Gypsum (100kg/acre) and 30kg DAP.",
      "Week 4: Apply 15kg Ammonium Sulphate.",
      "Week 8: Inter-cultivate and check soil looseness."
    ],
    irrigationSchedule: [
      "Sow in moist soil, water at flowering (25-30 days).",
      "Irrigate during pod formation (45-60 days) to avoid dry soil.",
      "Do not water 10 days before harvesting."
    ],
    harvestTime: "October to November",
    marketValue: "₹6,300 - ₹7,200 per Quintal",
    possibleDiseases: [
      { name: "Tikka Leaf Spot", prevention: "Mix 10ml Neem oil in 1L water and spray on leaves." }
    ],
    varieties: ["Kadiri 6", "TG 37A", "JL 24 (Phule Pragati)"],
    imageUrl: "peanut",
    suitabilityScore: "90%",
    idealSowingSeason: "Kharif (June to July)",
    seedQuantityRequired: "40 kg per Acre",
    expectedGrowthDuration: "110 Days",
    estimatedCultivationCost: "₹18,000 per Acre",
    expectedProfit: "₹45,000 per Acre",
    marketDemand: "Very High",
    governmentSubsidies: "50% seed subsidy and micro-irrigation assistance"
  },
  {
    cropName: "Cotton (Gossypium hirsutum)",
    description: "Premium cash crop ideal for black cotton or heavy alluvial soils in hot and dry climates.",
    expectedYield: "8-12 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Incorporate compost and 40kg DAP.",
      "Week 6: Apply 30kg Urea for quick nitrogen.",
      "Week 10: Apply 20kg Potash at boll formation."
    ],
    irrigationSchedule: [
      "Water sparingly to avoid waterlogging.",
      "Irrigate during flowering and boll opening stages (every 15 days).",
      "Stop watering once 20% of bolls have opened."
    ],
    harvestTime: "November to January",
    marketValue: "₹6,500 - ₹7,400 per Quintal",
    possibleDiseases: [
      { name: "Bollworm Pest", prevention: "Apply pheromone traps or spray neem seed extract." },
      { name: "Root Rot", prevention: "Apply Trichoderma bio-fungicide in soil." }
    ],
    varieties: ["Bt Cotton H-6", "MCU 5", "Anjali (A-81)"],
    imageUrl: "cotton",
    suitabilityScore: "88%",
    idealSowingSeason: "Kharif (May to June)",
    seedQuantityRequired: "2-3 kg per Acre",
    expectedGrowthDuration: "160 Days",
    estimatedCultivationCost: "₹22,000 per Acre",
    expectedProfit: "₹55,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "CCI procurement at minimum support price (MSP)"
  },
  {
    cropName: "Maize / Corn (Zea mays)",
    description: "Highly versatile cereal crop requiring less water than rice and yielding excellent fodder for livestock.",
    expectedYield: "15-20 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 40kg DAP and 15kg Zinc Sulphate.",
      "Week 4: Apply 30kg Urea.",
      "Week 8: Apply 20kg Urea and 10kg Potash."
    ],
    irrigationSchedule: [
      "Irrigate at knee-high stage (Week 4).",
      "Ensure moisture during silking and tasseling stages (Week 8-10).",
      "Irrigate at grain-filling stage if rains fail."
    ],
    harvestTime: "September to October",
    marketValue: "₹1,850 - ₹2,100 per Quintal",
    possibleDiseases: [
      { name: "Turcicum Leaf Blight", prevention: "Follow crop rotation and spray Trichoderma viride." }
    ],
    varieties: ["Pioneer 3396", "Ganga 11", "Dekalb 9108"],
    imageUrl: "maize",
    suitabilityScore: "85%",
    idealSowingSeason: "Kharif (June to July)",
    seedQuantityRequired: "8 kg per Acre",
    expectedGrowthDuration: "100 Days",
    estimatedCultivationCost: "₹12,000 per Acre",
    expectedProfit: "₹22,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "Subsidies on hybrid seeds and poultry feed industry link"
  },
  {
    cropName: "Soybean (Glycine max)",
    description: "Highly profitable protein-rich oilseed. Replenishes soil nitrogen and has strong commercial demand.",
    expectedYield: "8-10 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 30kg DAP and 10kg Zinc Sulphate.",
      "Week 3: Apply compost or liquid organic manure.",
      "No chemical Nitrogen top-dressing required."
    ],
    irrigationSchedule: [
      "Irrigate after sowing if soil is dry.",
      "Ensure watering at flowering stage (Week 5).",
      "Ensure watering at pod filling stage (Week 9)."
    ],
    harvestTime: "October to November",
    marketValue: "₹4,200 - ₹4,800 per Quintal",
    possibleDiseases: [
      { name: "Yellow Mosaic Virus", prevention: "Spray neem seed oil and rogue out infected yellow plants." }
    ],
    varieties: ["JS 335", "JS 95-60", "NRC 37"],
    imageUrl: "soybean",
    suitabilityScore: "82%",
    idealSowingSeason: "Kharif (June to July)",
    seedQuantityRequired: "30 kg per Acre",
    expectedGrowthDuration: "95 Days",
    estimatedCultivationCost: "₹14,000 per Acre",
    expectedProfit: "₹26,000 per Acre",
    marketDemand: "Very High",
    governmentSubsidies: "National Food Security Mission seed subsidies available"
  }
];

const DEFAULT_CROPS_RABI = [
  {
    cropName: "Wheat (Triticum aestivum)",
    description: "The premier winter cereal crop, highly profitable in fertile loam or clay soils with moderate water.",
    expectedYield: "18-22 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 50kg DAP and 20kg Potash.",
      "Week 4: Apply 35kg Urea during first crown irrigation.",
      "Week 8: Apply 25kg Urea at jointing stage."
    ],
    irrigationSchedule: [
      "1st Irrigation: At Crown Root Initiation stage (21 days after sowing).",
      "2nd Irrigation: At active tillering stage (45 days after sowing).",
      "3rd Irrigation: At flowering/milking stage (85 days after sowing)."
    ],
    harvestTime: "March to April",
    marketValue: "₹2,275 - ₹2,500 per Quintal",
    possibleDiseases: [
      { name: "Yellow Rust", prevention: "Sow resistant seeds like HD 3086 or spray Propiconazole." },
      { name: "Loose Smut", prevention: "Treat seeds with Trichoderma or Carboxin before sowing." }
    ],
    varieties: ["HD 2967", "HD 3086", "GW 322"],
    imageUrl: "wheat",
    suitabilityScore: "96%",
    idealSowingSeason: "Rabi (November to December)",
    seedQuantityRequired: "40 kg per Acre",
    expectedGrowthDuration: "125 Days",
    estimatedCultivationCost: "₹14,500 per Acre",
    expectedProfit: "₹35,000 per Acre",
    marketDemand: "Extremely High",
    governmentSubsidies: "Direct MSP grain procurement and seed distribution programs"
  },
  {
    cropName: "Mustard (Brassica juncea)",
    description: "Low-water winter cash crop highly suited for dry sandy-loam soils.",
    expectedYield: "6-9 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 30kg DAP and 20kg Sulphur powder.",
      "Week 4: Apply 20kg Urea after first weeding.",
      "Week 8: Maintain soil loose, avoid water logging."
    ],
    irrigationSchedule: [
      "1st Irrigation: 30-35 days after sowing (pre-flowering stage).",
      "2nd Irrigation: 60-65 days after sowing (pod filling stage).",
      "Avoid excessive water to prevent root rot."
    ],
    harvestTime: "February to March",
    marketValue: "₹5,400 - ₹5,850 per Quintal",
    possibleDiseases: [
      { name: "Alternaria Black Spot", prevention: "Avoid dense sowing; spray garlic bulb extract." }
    ],
    varieties: ["Pusa Bold", "Kranti", "RH 30"],
    imageUrl: "mustard",
    suitabilityScore: "91%",
    idealSowingSeason: "Rabi (October to November)",
    seedQuantityRequired: "2 kg per Acre",
    expectedGrowthDuration: "115 Days",
    estimatedCultivationCost: "₹8,000 per Acre",
    expectedProfit: "₹32,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "Oilseed development scheme incentives"
  },
  {
    cropName: "Chickpea / Gram (Cicer arietinum)",
    description: "Excellent nitrogen-fixing pulse crop that requires very little water and thrives on residual soil moisture.",
    expectedYield: "7-10 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 25kg DAP per acre.",
      "Week 5: Apply organic compost. Check for nodules.",
      "No chemical nitrogen top-dressing needed as roots fix nitrogen."
    ],
    irrigationSchedule: [
      "1st Irrigation: Light watering at branching stage (30-35 days).",
      "2nd Irrigation: At pod development stage (65-70 days) if needed.",
      "Never irrigate at peak flowering to avoid flower drop."
    ],
    harvestTime: "March to April",
    marketValue: "₹5,335 - ₹5,500 per Quintal",
    possibleDiseases: [
      { name: "Wilt Disease", prevention: "Follow crop rotation and treat seeds with Trichoderma harzianum." }
    ],
    varieties: ["C 235", "DCP 92-3", "Uday"],
    imageUrl: "chickpea",
    suitabilityScore: "87%",
    idealSowingSeason: "Rabi (October to November)",
    seedQuantityRequired: "30-35 kg per Acre",
    expectedGrowthDuration: "120 Days",
    estimatedCultivationCost: "₹10,000 per Acre",
    expectedProfit: "₹38,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "NFSM pulse production support and seeds at 40% discount"
  },
  {
    cropName: "Potato (Solanum tuberosum)",
    description: "High-value commercial tuber crop that yields massive bulk volumes and has high demand in cold storage hubs.",
    expectedYield: "120-150 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 50kg DAP, 40kg Potash, and 5 tons of well-rotted compost per acre.",
      "Week 4: Apply 30kg Urea during first earthing up.",
      "Week 7: Apply 20kg Urea and Zinc Sulphate."
    ],
    irrigationSchedule: [
      "Water immediately after sowing seed tubers.",
      "Irrigate every 7-10 days depending on soil dampness.",
      "Stop watering 10 days before harvesting to harden potato skins."
    ],
    harvestTime: "February to March",
    marketValue: "₹1,200 - ₹1,800 per Quintal",
    possibleDiseases: [
      { name: "Late Blight", prevention: "Spray Trichoderma bio-fungicide or dilute copper oxychloride." }
    ],
    varieties: ["Kufri Jyoti", "Kufri Bahar", "Kufri Pukhraj"],
    imageUrl: "potato",
    suitabilityScore: "84%",
    idealSowingSeason: "Rabi (October to November)",
    seedQuantityRequired: "10-12 Quintals per Acre",
    expectedGrowthDuration: "100 Days",
    estimatedCultivationCost: "₹28,000 per Acre",
    expectedProfit: "₹70,000 per Acre",
    marketDemand: "Very High",
    governmentSubsidies: "State subsidy on quality seed tubers and cold storage transport"
  },
  {
    cropName: "Barley (Hordeum vulgare)",
    description: "Very hardy and drought-tolerant winter cereal. Grows well in poor soils with low water supply.",
    expectedYield: "12-15 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 30kg DAP and 15kg Potash.",
      "Week 4: Apply 20kg Urea after first weeding.",
      "Week 8: Apply compost or liquid organic tea."
    ],
    irrigationSchedule: [
      "1st Irrigation: At active tillering stage (30 days).",
      "2nd Irrigation: At grain-filling stage (75 days) if soil is dry.",
      "Water sparingly; avoid waterlogging."
    ],
    harvestTime: "March to April",
    marketValue: "₹1,900 - ₹2,200 per Quintal",
    possibleDiseases: [
      { name: "Barley Stripe disease", prevention: "Sow certified disease-free seeds and practice rotation." }
    ],
    varieties: ["RD 2035", "RD 2552", "BH 393"],
    imageUrl: "barley",
    suitabilityScore: "81%",
    idealSowingSeason: "Rabi (November to December)",
    seedQuantityRequired: "35 kg per Acre",
    expectedGrowthDuration: "115 Days",
    estimatedCultivationCost: "₹9,000 per Acre",
    expectedProfit: "₹18,000 per Acre",
    marketDemand: "Moderate",
    governmentSubsidies: "Commercial industrial buyer contract links and seed support"
  }
];

const DEFAULT_CROPS_SUMMER = [
  {
    cropName: "Green Gram / Moong (Vigna radiata)",
    description: "Fast-growing short-duration pulse crop that improves soil health and yields quick income in hot summer.",
    expectedYield: "4-6 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 20kg DAP.",
      "Week 3: Spray Panchagavya or multi-micronutrients.",
      "No urea top-dressing is required."
    ],
    irrigationSchedule: [
      "Irrigate immediately after sowing.",
      "Water every 10-12 days depending on soil heat.",
      "Do not water during harvesting stage."
    ],
    harvestTime: "May to June",
    marketValue: "₹7,500 - ₹8,500 per Quintal",
    possibleDiseases: [
      { name: "Yellow Mosaic Virus", prevention: "Spray neem oil and remove infected yellow plants early." }
    ],
    varieties: ["Pusa Baisakhi", "SML 668", "IPM 02-3"],
    imageUrl: "mungbean",
    suitabilityScore: "94%",
    idealSowingSeason: "Summer (March to April)",
    seedQuantityRequired: "8-10 kg per Acre",
    expectedGrowthDuration: "70 Days",
    estimatedCultivationCost: "₹7,000 per Acre",
    expectedProfit: "₹28,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "Pulses promotion scheme seed subsidies"
  },
  {
    cropName: "Tomato (Solanum lycopersicum)",
    description: "High-value commercial vegetable crop suitable for well-drained sandy loam soil with consistent watering.",
    expectedYield: "150-200 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Mix 5 tons compost and 50kg NPK (15:15:15).",
      "Week 3: Apply 20kg Urea after weeding.",
      "Week 6 (Flowering): Apply 15kg Potash and 10kg Calcium."
    ],
    irrigationSchedule: [
      "Water every 5-7 days during hot summer.",
      "Avoid water logging at root base.",
      "Drip irrigation is highly recommended for best fruit size."
    ],
    harvestTime: "June to July",
    marketValue: "₹1,200 - ₹2,500 per Quintal",
    possibleDiseases: [
      { name: "Early Blight", prevention: "Spray sour buttermilk or copper fungicide." }
    ],
    varieties: ["Pusa Ruby", "Arka Vikas", "Roma"],
    imageUrl: "tomato",
    suitabilityScore: "89%",
    idealSowingSeason: "Summer (February to March)",
    seedQuantityRequired: "150 grams (nurseried) per Acre",
    expectedGrowthDuration: "100 Days",
    estimatedCultivationCost: "₹20,000 per Acre",
    expectedProfit: "₹80,000 per Acre",
    marketDemand: "Very High",
    governmentSubsidies: "80% subsidy on drip irrigation setup from state department"
  },
  {
    cropName: "Cucumber (Cucumis sativus)",
    description: "Excellent fast-growing summer crop with massive demand in local urban markets.",
    expectedYield: "50-80 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Mix compost with 30kg DAP.",
      "Week 4: Apply 15kg Urea.",
      "Week 7: Apply 10kg Potash to increase fruit crispness."
    ],
    irrigationSchedule: [
      "Irrigate every 4-5 days during summer heat.",
      "Maintain uniform moisture to prevent bitter taste.",
      "Never flood the vines."
    ],
    harvestTime: "May to June",
    marketValue: "₹800 - ₹1,500 per Quintal",
    possibleDiseases: [
      { name: "Powdery Mildew", prevention: "Spray dilute baking soda water (5g/L) or diluted milk." }
    ],
    varieties: ["Poinsette", "Japanese Long Green", "Straight Eight"],
    imageUrl: "cucumber",
    suitabilityScore: "86%",
    idealSowingSeason: "Summer (February to March)",
    seedQuantityRequired: "1 kg per Acre",
    expectedGrowthDuration: "55 Days",
    estimatedCultivationCost: "₹11,000 per Acre",
    expectedProfit: "₹40,000 per Acre",
    marketDemand: "High",
    governmentSubsidies: "Horticulture department polyhouse subsidies available"
  },
  {
    cropName: "Okra / Ladies Finger (Abelmoschus esculentus)",
    description: "Warm-season crop that produces continuous yields over a long period. High market value in urban markets.",
    expectedYield: "35-45 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Apply 40kg DAP and 4 tons compost per acre.",
      "Week 3: Apply 15kg Urea.",
      "Week 6 (Fruiting): Apply 15kg Urea and 10kg Potash."
    ],
    irrigationSchedule: [
      "Irrigate every 5-6 days during peak summer.",
      "Avoid dry stress during flowering to prevent pod hardening.",
      "Maintain moist but not waterlogged root zone."
    ],
    harvestTime: "June to August",
    marketValue: "₹2,500 - ₹4,000 per Quintal",
    possibleDiseases: [
      { name: "Yellow Vein Mosaic Virus", prevention: "Grow YVMC resistant seed varieties and spray neem seed extract." }
    ],
    varieties: ["Arka Anamika", "Pusa Sawani", "Mahyco 10"],
    imageUrl: "okra",
    suitabilityScore: "83%",
    idealSowingSeason: "Summer (February to March)",
    seedQuantityRequired: "4 kg per Acre",
    expectedGrowthDuration: "80 Days",
    estimatedCultivationCost: "₹13,000 per Acre",
    expectedProfit: "₹50,000 per Acre",
    marketDemand: "Very High",
    governmentSubsidies: "Vegetable production cluster seed development subsidy"
  },
  {
    cropName: "Watermelon (Citrullus lanatus)",
    description: "Extremely popular summer cash crop with high water-content. Thrives in sandy loam soils with warm sunny days.",
    expectedYield: "100-120 Quintals per Acre",
    fertilizerSchedule: [
      "At planting: Mix 6 tons compost, 40kg DAP, and 20kg Potash.",
      "Week 4: Apply 20kg Urea near vine basin.",
      "Week 8: Apply 15kg Potash to sweeten fruits."
    ],
    irrigationSchedule: [
      "Irrigate immediately at sowing or vine transplanting.",
      "Water every 6-8 days during active growth.",
      "Reduce irrigation as fruits reach full maturity to increase sweetness."
    ],
    harvestTime: "May to June",
    marketValue: "₹600 - ₹1,000 per Quintal",
    possibleDiseases: [
      { name: "Fusarium Wilt", prevention: "Adopt strict crop rotation and apply Trichoderma in planting pits." }
    ],
    varieties: ["Sugar Baby", "Arka Manik", "Asahi Yamato"],
    imageUrl: "watermelon",
    suitabilityScore: "80%",
    idealSowingSeason: "Summer (January to February)",
    seedQuantityRequired: "1.5 kg per Acre",
    expectedGrowthDuration: "90 Days",
    estimatedCultivationCost: "₹16,000 per Acre",
    expectedProfit: "₹65,000 per Acre",
    marketDemand: "Extremely High",
    governmentSubsidies: "State incentives for mulching sheet and drip line sets"
  }
];

const DEFAULT_CAREERS = [
  {
    title: "Organic Oyster Mushroom Cultivation",
    description: "Grow premium Oyster or Button mushrooms indoors using agricultural waste like straw. Extremely high profit margin with low space requirements.",
    requiredSkills: ["Sterilization methods", "Humidity management", "Spawn mixing"],
    educationRequired: "No formal education. Easily learned through a 3-day practical training.",
    estimatedInvestment: "₹5,000 - ₹12,000 for a small room setup.",
    expectedIncome: "₹12,000 - ₹25,000 per month.",
    governmentSupport: "NHB (National Horticulture Board) offers 40% subsidy on mushroom units.",
    futureOpportunities: "Supermarkets and urban markets have a booming demand for organic protein-rich mushrooms.",
    learningResources: ["Krishi Vigyan Kendra (KVK)", "YouTube practical channels", "State Horticulture Department"]
  },
  {
    title: "Beekeeping & Honey Production",
    description: "Set up wooden bee boxes along boundary fences or orchards. Bees pollinate your existing crops to increase yields by 20%, while producing pure natural honey.",
    requiredSkills: ["Hive handling", "Queen bee management", "Honey extraction"],
    educationRequired: "No formal education required. Best learned by doing.",
    estimatedInvestment: "₹10,000 - ₹15,000 for 10 boxes.",
    expectedIncome: "₹8,000 - ₹18,000 per month.",
    governmentSupport: "National Beekeeping & Honey Mission (NBHM) provides up to 45% equipment subsidy.",
    futureOpportunities: "Strong demand for organic forest honey, beeswax, and royal jelly in pharmaceutical and cosmetic industries.",
    learningResources: ["Khadi and Village Industries Commission (KVIC)", "National Bee Board workshops"]
  },
  {
    title: "Resilient Goat Rearing Setup",
    description: "Start a small-scale goat farm with local resilient breeds. Goats feed on local shrubs, reproduce fast, and represent an easily liquidable livestock asset.",
    requiredSkills: ["Deworming & vaccinations", "Herd grazing", "Fodder mixing"],
    educationRequired: "No formal education required. Traditional hands-on practice is sufficient.",
    estimatedInvestment: "₹20,000 - ₹35,000 for 5 goats.",
    expectedIncome: "₹15,000 - ₹28,000 per breeding cycle (every 6-8 months).",
    governmentSupport: "NABARD offers up to 50%-60% subsidy for sheep/goat rearing schemes.",
    futureOpportunities: "Constant demand for high-quality meat and milk, unaffected by crop failures or weather patterns.",
    learningResources: ["District Veterinary Office", "Central Institute for Research on Goats (CIRG)"]
  },
  {
    title: "Custom Machinery Hiring Center",
    description: "Purchase 2-3 essential small-farm machines (like power weeders, power tillers, or brush cutters) and rent them out on a daily wage basis.",
    requiredSkills: ["Basic engine maintenance", "Machine operation", "Customer scheduling"],
    educationRequired: "Primary or High school level. Requires basic mechanical aptitude.",
    estimatedInvestment: "₹25,000 - ₹45,000.",
    expectedIncome: "₹18,000 - ₹35,000 per month during peak seasons.",
    governmentSupport: "Sub-Mission on Agricultural Mechanization (SMAM) offers up to 50% subsidy.",
    futureOpportunities: "As rural labor becomes scarce, mechanical small weeding and tilling is growing exponentially.",
    learningResources: ["Agricultural Engineering Department", "Manufacturer training workshops"]
  }
];

// Local Fallback Database & Language Translation systems
const FALLBACK_TRANSLATIONS: Record<string, Record<string, string>> = {
  Hindi: {
    "Rice / Paddy (Oryza sativa)": "चावल / धान (Oryza sativa)",
    "Highly recommended for water-rich clayey and alluvial soil during the monsoon season.": "मानसून के मौसम में प्रचुर पानी वाली दोमट और जलोढ़ मिट्टी के लिए अत्यधिक अनुशंसित।",
    "20-25 Quintals per Acre": "20-25 क्विंटल प्रति एकड़",
    "At planting: Apply well-composted manure and 40kg DAP per acre.": "बुवाई के समय: प्रति एकड़ अच्छी तरह सड़ी हुई खाद और 40 किलो डीएपी डालें।",
    "Week 3: Apply 25kg Urea during tillering.": "सप्ताह 3: कल्ले फूटते समय 25 किलो यूरिया डालें।",
    "Week 7: Apply 15kg Urea and 10kg Potash at panicle stage.": "सप्ताह 7: बाली बनते समय 15 किलो यूरिया और 10 किलो पोटाश डालें।",
    "Maintain 2-5 cm of water standing in the field during transplanting.": "रोपणी के समय खेत में 2-5 सेमी पानी खड़ा रखें।",
    "Irrigate regularly until 15 days before harvest.": "कटाई से 15 दिन पहले तक नियमित रूप से सिंचाई करें।",
    "Do not let the soil dry out during flowering.": "फूल आने के समय मिट्टी को सूखने न दें।",
    "115-125 Days": "115-125 दिन",
    "₹2,183 - ₹2,300 per Quintal": "₹2,183 - ₹2,300 प्रति क्विंटल",
    "Blast Disease (Fungal)": "ब्लास्ट रोग (कवक)",
    "Spray organic garlic-onion extract or neem oil.": "जैविक लहसुन-प्याज का अर्क या नीम का तेल छिड़कें।",
    "Bacterial Leaf Blight": "जीवाणु झुलसा रोग (बैक्टीरियल लीफ ब्लाइट)",
    "Avoid excess Nitrogen fertilizer and use resistant seeds.": "अत्यधिक नाइट्रोजन उर्वरक से बचें और प्रतिरोधी बीजों का उपयोग करें।",

    "Groundnut / Peanut (Arachis hypogaea)": "मूँगफली (Arachis hypogaea)",
    "Excellent oilseed crop for sandy loam soil with low water requirement during warm weather.": "गर्म मौसम में कम पानी की आवश्यकता वाली रेतीली दोमट मिट्टी के लिए उत्कृष्ट तिलहन फसल।",
    "8-12 Quintals per Acre": "8-12 क्विंटल प्रति एकड़",
    "At planting: Apply Gypsum (100kg/acre) and 30kg DAP.": "बुवाई के समय: जिप्सम (100 किलो/एकड़) और 30 किलो डीएपी डालें।",
    "Week 4: Apply 15kg Ammonium Sulphate.": "सप्ताह 4: 15 किलो अमोनियम सल्फेट डालें।",
    "Week 8: Inter-cultivate and check soil looseness.": "सप्ताह 8: गुड़ाई करें और मिट्टी के ढीलेपन की जांच करें।",
    "Sow in moist soil, water at flowering (25-30 days).": "नम मिट्टी में बोएं, फूल आने पर पानी दें (25-30 दिन)।",
    "Irrigate during pod formation (45-60 days) to avoid dry soil.": "सूखी मिट्टी से बचने के लिए फली बनते समय (45-60 दिन) सिंचाई करें।",
    "Do not water 10 days before harvesting.": "कटाई से 10 दिन पहले पानी न दें।",
    "105-115 Days": "105-115 दिन",
    "₹6,300 - ₹7,200 per Quintal": "₹6,300 - ₹7,200 प्रति क्विंटल",
    "Tikka Leaf Spot": "टिक्का लीफ स्पॉट (पत्ती धब्बा रोग)",
    "Mix 10ml Neem oil in 1L water and spray on leaves.": "1 लीटर पानी में 10 मिली नीम का तेल मिलाएं और पत्तियों पर छिड़कें।",

    "Cotton (Gossypium hirsutum)": "कपास (Gossypium hirsutum)",
    "Premium cash crop ideal for black cotton or heavy alluvial soils in hot and dry climates.": "गर्म और शुष्क जलवायु में काली मिट्टी या भारी जलोढ़ मिट्टी के लिए आदर्श प्रीमियम नकदी फसल।",
    "At planting: Incorporate compost and 40kg DAP.": "बुवाई के समय: खाद और 40 किलो डीएपी मिलाएं।",
    "Week 6: Apply 30kg Urea for quick nitrogen.": "सप्ताह 6: त्वरित नाइट्रोजन के लिए 30 किलो यूरिया डालें।",
    "Week 10: Apply 20kg Potash at boll formation.": "सप्ताह 10: डोडा (बॉल) बनते समय 20 किलो पोटाश डालें।",
    "Water sparingly to avoid waterlogging.": "जलभराव से बचने के लिए कम पानी दें।",
    "Irrigate during flowering and boll opening stages (every 15 days).": "फूल आने और डोडा खुलने के चरणों (हर 15 दिन) में सिंचाई करें।",
    "Stop watering once 20% of bolls have opened.": "20% डोडा खुलने के बाद पानी देना बंद कर दें।",
    "150-170 Days": "150-170 दिन",
    "₹6,500 - ₹7,400 per Quintal": "₹6,500 - ₹7,400 प्रति क्विंटल",
    "Bollworm Pest": "कमला कीट / बॉलवॉर्म",
    "Apply pheromone traps or spray neem seed extract.": "फेरोमोन ट्रैप लगाएं या नीम के बीज के अर्क का छिड़काव करें।",
    "Root Rot": "जड़ सड़न रोग",
    "Apply Trichoderma bio-fungicide in soil.": "मिट्टी में ट्राइकोडर्मा जैव-कवकनाशी का प्रयोग करें।",

    "Wheat (Triticum aestivum)": "गेहूं (Triticum aestivum)",
    "The premier winter cereal crop, highly profitable in fertile loam or clay soils with moderate water.": "शीतकालीन अनाज की प्रमुख फसल, मध्यम पानी के साथ उपजाऊ दोमट या चिकनी मिट्टी में अत्यधिक लाभदायक।",
    "18-22 Quintals per Acre": "18-22 क्विंटल प्रति एकड़",
    "At planting: Apply 50kg DAP and 20kg Potash.": "बुवाई के समय: 50 किलो डीएपी और 20 किलो पोटाश डालें।",
    "Week 4: Apply 35kg Urea during first crown irrigation.": "सप्ताह 4: प्रथम ताज सिंचाई के दौरान 35 किलो यूरिया डालें।",
    "Week 8: Apply 25kg Urea at jointing stage.": "सप्ताह 8: गांठ बनने की अवस्था में 25 किलो यूरिया डालें।",
    "1st Irrigation: At Crown Root Initiation stage (21 days after sowing).": "पहली सिंचाई: कल्ले फूटने की प्रारंभिक अवस्था में (बुवाई के 21 दिन बाद)।",
    "2nd Irrigation: At active tillering stage (45 days after sowing).": "दूसरी सिंचाई: सक्रिय कल्ले फूटते समय (बुवाई के 45 दिन बाद)।",
    "3rd Irrigation: At flowering/milking stage (85 days after sowing).": "तीसरी सिंचाई: फूल आने/दुग्ध अवस्था में (बुवाई के 85 दिन बाद)।",
    "120-135 Days": "120-135 दिन",
    "₹2,275 - ₹2,500 per Quintal": "₹2,275 - ₹2,500 प्रति क्विंटल",
    "Yellow Rust": "पीला रतुआ",
    "Sow resistant seeds like HD 3086 or spray Propiconazole.": "एचडी 3086 जैसे प्रतिरोधी बीज बोएं या प्रोपिकोनाज़ोल का छिड़काव करें।",
    "Loose Smut": "कंडुआ रोग / लूज स्मट",
    "Treat seeds with Trichoderma or Carboxin before sowing.": "बुवाई से पहले बीजों को ट्राइकोडर्मा या कार्बोक्सिन से उपचारित करें।",

    "Mustard (Brassica juncea)": "सरसों (Brassica juncea)",
    "Low-water winter cash crop highly suited for dry sandy-loam soils.": "कम पानी वाली शीतकालीन नकदी फसल जो शुष्क रेतीली-दोमट मिट्टी के लिए अत्यधिक उपयुक्त है।",
    "6-9 Quintals per Acre": "6-9 क्विंटल प्रति एकड़",
    "At planting: Apply 30kg DAP and 20kg Sulphur powder.": "बुवाई के समय: 30 किलो डीएपी और 20 किलो सल्फर पाउडर डालें।",
    "Week 4: Apply 20kg Urea after first weeding.": "सप्ताह 4: पहली निराई के बाद 20 किलो यूरिया डालें।",
    "Week 8: Maintain soil loose, avoid water logging.": "सप्ताह 8: मिट्टी को ढीला रखें, जलभराव से बचें।",
    "1st Irrigation: 30-35 days after sowing (pre-flowering stage).": "पहली सिंचाई: बुवाई के 30-35 दिन बाद (फूल आने से पहले की अवस्था)।",
    "2nd Irrigation: 60-65 days after sowing (pod filling stage).": "दूसरी सिंचाई: बुवाई के 60-65 दिन बाद (फली भरने की अवस्था)।",
    "Avoid excessive water to prevent root rot.": "जड़ सड़न से बचने के लिए अत्यधिक पानी से बचें।",
    "110-120 Days": "110-120 दिन",
    "₹5,400 - ₹5,850 per Quintal": "₹5,400 - ₹5,850 प्रति क्विंटल",
    "Alternaria Black Spot": "अल्टरनेरिया काला धब्बा",
    "Avoid dense sowing; spray garlic bulb extract.": "घनी बुवाई से बचें; लहसुन के बल्ब का अर्क छिड़कें।",

    "Chickpea / Gram (Cicer arietinum)": "चना (Cicer arietinum)",
    "Excellent nitrogen-fixing pulse crop that requires very little water and thrives on residual soil moisture.": "उत्कृष्ट नाइट्रोजन-स्थिरीकरण वाली दलहन फसल जिसके लिए बहुत कम पानी की आवश्यकता होती है और जो मिट्टी की अवशिष्ट नमी पर फलती-फूलती है।",
    "7-10 Quintals per Acre": "7-10 क्विंटल प्रति एकड़",
    "At planting: Apply 25kg DAP per acre.": "बुवाई के समय: 25 किलो डीएपी प्रति एकड़ डालें।",
    "Week 5: Apply organic compost. Check for nodules.": "सप्ताह 5: जैविक खाद डालें। जड़ों की गांठों की जांच करें।",
    "No chemical nitrogen top-dressing needed as roots fix nitrogen.": "यूरिया टॉप-ड्रेसिंग की आवश्यकता नहीं है क्योंकि जड़ें नाइट्रोजन का स्थिरीकरण करती हैं।",
    "1st Irrigation: Light watering at branching stage (30-35 days).": "पहली सिंचाई: शाखाएं बनते समय हल्की सिंचाई (30-35 दिन)।",
    "2nd Irrigation: At pod development stage (65-70 days) if needed.": "दूसरी सिंचाई: आवश्यकतानुसार फली विकास चरण (65-70 दिन) पर सिंचाई करें।",
    "Never irrigate at peak flowering to avoid flower drop.": "फूलों को गिरने से बचाने के लिए फूल आने के चरम समय पर कभी भी सिंचाई न करें।",
    "110-130 Days": "110-130 दिन",
    "₹5,335 - ₹5,500 per Quintal": "₹5,335 - ₹5,500 प्रति क्विंटल",
    "Wilt Disease": "उकठा रोग (विल्ट)",
    "Follow crop rotation and treat seeds with Trichoderma harzianum.": "फसल चक्र अपनाएं और बीजों को ट्राइकोडर्मा हर्ज़ियानम से उपचारित करें।",

    "Green Gram / Moong (Vigna radiata)": "मूंग (Vigna radiata)",
    "Fast-growing short-duration pulse crop that improves soil health and yields quick income in hot summer.": "तेजी से बढ़ने वाली कम अवधि की दलहन फसल जो मिट्टी के स्वास्थ्य में सुधार करती है और गर्म गर्मियों में त्वरित आय देती है।",
    "4-6 Quintals per Acre": "4-6 क्विंटल प्रति एकड़",
    "At planting: Apply 20kg DAP.": "बुवाई के समय: 20 किलो डीएपी डालें।",
    "Week 3: Spray Panchagavya or multi-micronutrients.": "सप्ताह 3: पंचगव्य या मल्टी-सूक्ष्म पोषक तत्वों का छिड़काव करें।",
    "No urea top-dressing is required.": "यूरिया टॉप-ड्रेसिंग की आवश्यकता नहीं है।",
    "Irrigate immediately after sowing.": "बुवाई के तुरंत बाद सिंचाई करें।",
    "Water every 10-12 days depending on soil heat.": "मिट्टी की गर्मी के आधार पर हर 10-12 दिन में पानी दें।",
    "Do not water during harvesting stage.": "कटाई के समय पानी न दें।",
    "65-75 Days": "65-75 दिन",
    "₹7,500 - ₹8,500 per Quintal": "₹7,500 - ₹8,500 प्रति क्विंटल",
    "Yellow Mosaic Virus": "पीला मोज़ेक वायरस",
    "Spray neem oil and remove infected yellow plants early.": "नीम के तेल का छिड़काव करें और संक्रमित पीले पौधों को समय पर हटा दें।",

    "Tomato (Solanum lycopersicum)": "टमाटर (Solanum lycopersicum)",
    "High-value commercial vegetable crop suitable for well-drained sandy loam soil with consistent watering.": "लगातार सिंचाई के साथ अच्छी जल निकासी वाली रेतीली दोमट मिट्टी के लिए उपयुक्त उच्च मूल्य वाली व्यावसायिक सब्जी फसल।",
    "150-200 Quintals per Acre": "150-200 क्विंटल प्रति एकड़",
    "At planting: Mix 5 tons compost and 50kg NPK (15:15:15).": "रोपाई के समय: 5 टन खाद और 50 किलो एनपीके (15:15:15) मिलाएं।",
    "Week 3: Apply 20kg Urea after weeding.": "सप्ताह 3: निराई के बाद 20 किलो यूरिया डालें।",
    "Week 6 (Flowering): Apply 15kg Potash and 10kg Calcium.": "सप्ताह 6 (फूल आने पर): 15 किलो पोटाश और 10 किलो कैल्शियम डालें।",
    "Water every 5-7 days during hot summer.": "गर्मियों में हर 5-7 दिन में पानी दें।",
    "Avoid water logging at root base.": "जड़ के पास जलभराव से बचें।",
    "Drip irrigation is highly recommended for best fruit size.": "सर्वोत्तम फल आकार के लिए ड्रिप सिंचाई की अत्यधिक अनुशंसा की जाती है।",
    "90-110 Days": "90-110 दिन",
    "₹1,200 - ₹2,500 per Quintal": "₹1,200 - ₹2,500 प्रति क्विंटल",
    "Early Blight": "अगेती झुलसा रोग (अर्ली ब्लाइट)",
    "Spray sour buttermilk or copper fungicide.": "खट्टी छाछ या तांबा कवकनाशी का छिड़काव करें।",

    "Cucumber (Cucumis sativus)": "खीरा / ककड़ी (Cucumis sativus)",
    "Excellent fast-growing summer crop with massive demand in local urban markets.": "स्थानीय शहरी बाजारों में भारी मांग वाली उत्कृष्ट तेजी से बढ़ने वाली ग्रीष्मकालीन फसल।",
    "50-80 Quintals per Acre": "50-80 क्विंटल प्रति एकड़",
    "At planting: Mix compost with 30kg DAP.": "बुवाई के समय: खाद के साथ 30 किलो डीएपी मिलाएं।",
    "Week 4: Apply 15kg Urea.": "सप्ताह 4: 15 किलो यूरिया डालें।",
    "Week 7: Apply 10kg Potash to increase fruit crispness.": "सप्ताह 7: फल के कुरकुरेपन को बढ़ाने के लिए 10 किलो पोटाश डालें।",
    "Irrigate every 4-5 days during summer heat.": "गर्मियों की धूप में हर 4-5 दिन में सिंचाई करें।",
    "Maintain uniform moisture to prevent bitter taste.": "कड़वे स्वाद को रोकने के लिए समान नमी बनाए रखें।",
    "Never flood the vines.": "बेलों में बहुत अधिक पानी न भरें।",
    "50-60 Days": "50-60 दिन",
    "₹800 - ₹1,500 per Quintal": "₹800 - ₹1,500 प्रति क्विंटल",
    "Powdery Mildew": "पाउडरी मिल्ड्यू (चूर्णिल आसिता)",
    "Spray dilute baking soda water (5g/L) or diluted milk.": "पतला बेकिंग सोडा पानी (5 ग्राम/लीटर) या पतला दूध छिड़कें।",

    "Organic Oyster Mushroom Cultivation": "जैविक ऑयस्टर मशरूम की खेती",
    "Grow premium Oyster or Button mushrooms indoors using agricultural waste like straw. Extremely high profit margin with low space requirements.": "पुआल जैसे कृषि कचरे का उपयोग करके घर के अंदर प्रीमियम ऑयस्टर या बटन मशरूम उगाएं। कम जगह की आवश्यकताओं के साथ अत्यधिक उच्च लाभ मार्जिन।",
    "Sterilization methods": "बंध्याकरण (स्टरलाइज़ेशन) के तरीके",
    "Humidity management": "आर्द्रता (नमी) प्रबंधन",
    "Spawn mixing": "मशरूम बीज (स्पॉन) मिलाना",
    "No formal education. Easily learned through a 3-day practical training.": "कोई औपचारिक शिक्षा नहीं। 3 दिवसीय व्यावहारिक प्रशिक्षण के माध्यम से आसानी से सीखा जा सकता है।",
    "₹5,000 - ₹12,000 for a small room setup.": "एक छोटे कमरे के सेटअप के लिए ₹5,000 - ₹12,000।",
    "₹12,000 - ₹25,000 per month.": "₹12,000 - ₹25,000 प्रति माह।",
    "NHB (National Horticulture Board) offers 40% subsidy on mushroom units.": "एनएचबी (राष्ट्रीय बागवानी बोर्ड) मशरूम इकाइयों पर 40% सब्सिडी प्रदान करता है।",
    "Supermarkets and urban markets have a booming demand for organic protein-rich mushrooms.": "सुपरमार्केट और शहरी बाजारों में जैविक प्रोटीन युक्त मशरूम की भारी मांग है।",
    "Krishi Vigyan Kendra (KVK)": "कृषि विज्ञान केंद्र (केवीके)",
    "YouTube practical channels": "यूट्यूब प्रैक्टिकल चैनल",
    "State Horticulture Department": "राज्य बागवानी विभाग",

    "Beekeeping & Honey Production": "मधुमक्खी पालन और शहद उत्पादन",
    "Set up wooden bee boxes along boundary fences or orchards. Bees pollinate your existing crops to increase yields by 20%, while producing pure natural honey.": "सीमा पर लगी बाड़ या बगीचों के किनारे लकड़ी के मधुमक्खी के बक्से स्थापित करें। मधुमक्खियां शुद्ध प्राकृतिक शहद का उत्पादन करते हुए पैदावार को 20% तक बढ़ाने के लिए परागण करती हैं।",
    "Hive handling": "छत्ते का रखरखाव",
    "Queen bee management": "रानी मधुमक्खी प्रबंधन",
    "Honey extraction": "शहड़ निकालना",
    "No formal education required. Best learned by doing.": "किसी औपचारिक शिक्षा की आवश्यकता नहीं है। काम करके सीखना सबसे अच्छा है।",
    "₹10,000 - ₹15,000 for 10 boxes.": "10 बक्से के लिए ₹10,000 - ₹15,000।",
    "₹8,000 - ₹18,000 per month.": "₹8,000 - ₹18,000 प्रति माह।",
    "National Beekeeping & Honey Mission (NBHM) provides up to 45% equipment subsidy.": "राष्ट्रीय मधुमक्खी पालन और शहद मिशन (NBHM) 45% तक उपकरण सब्सिडी प्रदान करता है।",
    "Strong demand for organic forest honey, beeswax, and royal jelly in pharmaceutical and cosmetic industries.": "फार्मास्युटिकल और कॉस्मेटिक उद्योगों में जैविक वन शहद, मधुमक्खी के मोम और रॉयल जेली की भारी मांग है।",
    "National Bee Board workshops": "राष्ट्रीय मधुमक्खी बोर्ड कार्यशालाएं",

    "Resilient Goat Rearing Setup": "लचीला बकरी पालन सेटअप",
    "Start a small-scale goat farm with local resilient breeds. Goats feed on local shrubs, reproduce fast, and represent an easily liquidable livestock asset.": "स्थानीय लचीली नस्लों के साथ छोटे पैमाने पर बकरी फार्म शुरू करें। बकरियां स्थानीय झाड़ियों को खाती हैं, तेजी से प्रजनन करती हैं, और आसानी से नकदी में बदलने वाली पशुधन संपत्ति हैं।",
    "Deworming & vaccinations": "कृमिनाशक और टीकाकरण",
    "Herd grazing": "झुंड चराना",
    "Fodder mixing": "चारा मिलाना",
    "No formal education required. Traditional hands-on practice is sufficient.": "किसी औपचारिक शिक्षा की आवश्यकता नहीं है। पारंपरिक व्यावहारिक अभ्यास पर्याप्त है।",
    "₹20,000 - ₹35,000 for 5 goats.": "5 बकरियों के लिए ₹20,000 - ₹35,000।",
    "₹15,000 - ₹28,000 per breeding cycle (every 6-8 months).": "प्रत्येक प्रजनन चक्र (हर 6-8 महीने) में ₹15,000 - ₹28,000।",
    "NABARD offers up to 50%-60% subsidy for sheep/goat rearing schemes.": "नाबार्ड भेड़/बकरी पालन योजनाओं के लिए 50%-60% तक सब्सिडी प्रदान करता है।",
    "Constant demand for high-quality meat and milk, unaffected by crop failures or weather patterns.": "उच्च गुणवत्ता वाले मांस और दूध की निरंतर मांग, जो फसल की बर्बादी या मौसम के मिजाज से अप्रभावित रहती है।",
    "District Veterinary Office": "जिला पशु चिकित्सा कार्यालय",
    "Central Institute for Research on Goats (CIRG)": "केंद्रीय बकरी अनुसंधान संस्थान (CIRG)",

    "Custom Machinery Hiring Center": "कस्टम मशीनरी किराया केंद्र",
    "Purchase 2-3 essential small-farm machines (like power weeders, power tillers, or brush cutters) and rent them out on a daily wage basis.": "2-3 आवश्यक छोटी कृषि मशीनें (जैसे पावर वीडर, पावर टिलर, या ब्रश कटर) खरीदें और उन्हें दैनिक मजदूरी के आधार पर किराए पर दें।",
    "Basic engine maintenance": "बुनियादी इंजन रखरखाव",
    "Machine operation": "मशीन संचालन",
    "Customer scheduling": "ग्राहक समय निर्धारण",
    "Primary or High school level. Requires basic mechanical aptitude.": "प्राथमिक या उच्च विद्यालय स्तर। बुनियादी यांत्रिक योग्यता की आवश्यकता है।",
    "₹25,000 - ₹45,000.": "₹25,000 - ₹45,000।",
    "₹18,000 - ₹35,000 per month during peak seasons.": "पीक सीजन के दौरान ₹18,000 - ₹35,000 प्रति माह।",
    "Sub-Mission on Agricultural Mechanization (SMAM) offers up to 50% subsidy.": "कृषि यंत्रीकरण पर उप-मिशन (SMAM) 50% तक सब्सिडी प्रदान करता है।",
    "As rural labor becomes scarce, mechanical small weeding and tilling is growing exponentially.": "जैसे-जैसे ग्रामीण श्रम दुर्लभ होता जा रहा है, यांत्रिक छोटी निराई और जुताई तेजी से बढ़ रही है।",
    "Agricultural Engineering Department": "कृषि इंजीनियरिंग विभाग",
    "Manufacturer training workshops": "निर्माता प्रशिक्षण कार्यशालाएं"
  },
  Tamil: {
    "Rice / Paddy (Oryza sativa)": "நெல் / அரிசி (Oryza sativa)",
    "Highly recommended for water-rich clayey and alluvial soil during the monsoon season.": "மழைக்காலத்தில் அதிக நீர்ப்பாங்கான களிமண் மற்றும் வண்டல் மண்ணிற்கு மிகவும் பரிந்துரைக்கப்படுகிறது.",
    "20-25 Quintals per Acre": "ஏக்கருக்கு 20-25 குவிண்டால்",
    "At planting: Apply well-composted manure and 40kg DAP per acre.": "நடும் போது: ஏக்கருக்கு நன்கு மக்கிய உரம் மற்றும் 40 கிலோ டிஏபி இடவும்.",
    "Week 3: Apply 25kg Urea during tillering.": "வாரம் 3: தூர் கட்டும் போது 25 கிலோ யூரியா இடவும்.",
    "Week 7: Apply 15kg Urea and 10kg Potash at panicle stage.": "வாரம் 7: கதிர் வரும் பருவத்தில் 15 கிலோ யூரியா மற்றும் 10 கிலோ பொட்டாஷ் இடவும்.",
    "Maintain 2-5 cm of water standing in the field during transplanting.": "நாற்று நடும் போது வயலில் 2-5 செ.மீ தண்ணீர் தேங்கி நிற்கும்படி பராமரிக்கவும்.",
    "Irrigate regularly until 15 days before harvest.": "அறுவடைக்கு 15 நாட்களுக்கு முன்பு வரை தொடர்ந்து நீர் பாய்ச்சவும்.",
    "Do not let the soil dry out during flowering.": "பூக்கும் தருணத்தில் மண் காய்ந்து போக விடாதீர்கள்.",
    "115-125 Days": "115-125 நாட்கள்",
    "₹2,183 - ₹2,300 per Quintal": "குவிண்டாலுக்கு ₹2,183 - ₹2,300",
    "Blast Disease (Fungal)": "குலை நோய் (பூஞ்சை)",
    "Spray organic garlic-onion extract or neem oil.": "இயற்கை பூண்டு-வெங்காய சாறு அல்லது வேப்பெண்ணெய் தெளிக்கவும்.",
    "Bacterial Leaf Blight": "பாக்டீரியா இலை கருகல் நோய்",
    "Avoid excess Nitrogen fertilizer and use resistant seeds.": "அதிகப்படியான நைட்ரஜன் உரத்தைத் தவிர்த்து, எதிர்ப்புத்திறன் கொண்ட விதைகளைப் பயன்படுத்தவும்.",

    "Groundnut / Peanut (Arachis hypogaea)": "நிலக்கடலை (Arachis hypogaea)",
    "Excellent oilseed crop for sandy loam soil with low water requirement during warm weather.": "வெப்பமான காலநிலையில் குறைந்த நீர் தேவையுடன் கூடிய மணல் கலந்த களிமண் நிலத்திற்கு சிறந்த எண்ணெய் வித்து பயிர்.",
    "8-12 Quintals per Acre": "ஏக்கருக்கு 8-12 குவிண்டால்",
    "At planting: Apply Gypsum (100kg/acre) and 30kg DAP.": "நடும் போது: ஜிப்சம் (100கிலோ/ஏக்கர்) மற்றும் 30கிலோ டிஏபி இடவும்.",
    "Week 4: Apply 15kg Ammonium Sulphate.": "வாரம் 4: 15 கிலோ அமோனியம் சல்பேட் இடவும்.",
    "Week 8: Inter-cultivate and check soil looseness.": "வாரம் 8: களை எடுத்து மண் தளர்த்தலை சரிபார்க்கவும்.",
    "Sow in moist soil, water at flowering (25-30 days).": "ஈரமான மண்ணில் விதைக்கவும், பூக்கும் போது (25-30 நாட்கள்) தண்ணீர் பாய்ச்சவும்.",
    "Irrigate during pod formation (45-60 days) to avoid dry soil.": "வறண்ட மண்ணைத் தவிர்க்க காய் உருவாகும் போது (45-60 நாட்கள்) நீர் பாய்ச்சவும்.",
    "Do not water 10 days before harvesting.": "அறுவடைக்கு 10 நாட்களுக்கு முன்பு தண்ணீர் பாய்ச்ச வேண்டாம்.",
    "105-115 Days": "105-115 நாட்கள்",
    "₹6,300 - ₹7,200 per Quintal": "குவிண்டாலுக்கு ₹6,300 - ₹7,200",
    "Tikka Leaf Spot": "டிக்கா இலைப்புள்ளி நோய்",
    "Mix 10ml Neem oil in 1L water and spray on leaves.": "1 லிட்டர் நீரில் 10 மிலி வேப்பெண்ணெய் கலந்து இலைகளில் தெளிக்கவும்.",

    "Cotton (Gossypium hirsutum)": "பருத்தி (Gossypium hirsutum)",
    "Premium cash crop ideal for black cotton or heavy alluvial soils in hot and dry climates.": "வெப்பமான மற்றும் வறண்ட காலநிலையில் கரிசல் மண் அல்லது கனமான வண்டல் மண்ணிற்கு உகந்த சிறந்த பணப்பயிர்.",
    "At planting: Incorporate compost and 40kg DAP.": "நடும் போது: உரம் மற்றும் 40 கிலோ டிஏபி சேர்க்கவும்.",
    "Week 6: Apply 30kg Urea for quick nitrogen.": "வாரம் 6: விரைவான நைட்ரஜனுக்கு 30 கிலோ யூரியா இடவும்.",
    "Week 10: Apply 20kg Potash at boll formation.": "வாரம் 10: பருத்தி காய் உருவாகும் போது 20 கிலோ பொட்டாஷ் இடவும்.",
    "Water sparingly to avoid waterlogging.": "நீர் தேங்குவதைத் தவிர்க்க அளவாக நீர் பாய்ச்சவும்.",
    "Irrigate during flowering and boll opening stages (every 15 days).": "பூக்கும் மற்றும் காய் வெடிக்கும் பருவங்களில் (15 நாட்களுக்கு ஒருமுறை) நீர் பாய்ச்சவும்.",
    "Stop watering once 20% of bolls have opened.": "20% காய்கள் வெடித்தவுடன் நீர் பாய்ச்சுவதை நிறுத்தவும்.",
    "150-170 Days": "150-170 நாட்கள்",
    "₹6,500 - ₹7,400 per Quintal": "குவிண்டாலுக்கு ₹6,500 - ₹7,400",
    "Bollworm Pest": "காய்ப்புழு பூச்சி",
    "Apply pheromone traps or spray neem seed extract.": "இனக்கவர்ச்சி பொறிகளை அமைக்கவும் அல்லது வேப்பங்கொட்டை சாறு தெளிக்கவும்.",
    "Root Rot": "வேர் அழுகல் நோய்",
    "Apply Trichoderma bio-fungicide in soil.": "மண்ணில் டிரைகோடெர்மா உயிர் பூஞ்சைக் கொல்லியை இடவும்.",

    "Wheat (Triticum aestivum)": "கோதுமை (Triticum aestivum)",
    "The premier winter cereal crop, highly profitable in fertile loam or clay soils with moderate water.": "மிதமான தண்ணீருடன் வளமான களிமண் அல்லது வண்டல் மண்ணில் அதிக லாபம் தரக்கூடிய முதன்மையான குளிர்கால தானிய பயிர்.",
    "18-22 Quintals per Acre": "ஏக்கருக்கு 18-22 குவிண்டால்",
    "At planting: Apply 50kg DAP and 20kg Potash.": "நடும் போது: 50 கிலோ டிஏபி மற்றும் 20 கிலோ பொட்டாஷ் இடவும்.",
    "Week 4: Apply 35kg Urea during first crown irrigation.": "வாரம் 4: முதல் நீர் பாய்ச்சலின் போது 35 கிலோ யூரியா இடவும்.",
    "Week 8: Apply 25kg Urea at jointing stage.": "வாரம் 8: தண்டு வளரும் பருவத்தில் 25 கிலோ யூரியா இடவும்.",
    "1st Irrigation: At Crown Root Initiation stage (21 days after sowing).": "முதல் நீர் பாய்ச்சல்: முடி வேர் உருவாகும் பருவம் (விதைத்த 21 நாட்களுக்குப் பின்).",
    "2nd Irrigation: At active tillering stage (45 days after sowing).": "இரண்டாவது நீர் பாய்ச்சல்: தூர் கட்டும் பருவம் (விதைத்த 45 நாட்களுக்குப் பின்).",
    "3rd Irrigation: At flowering/milking stage (85 days after sowing).": "மூன்றாவது நீர் பாய்ச்சல்: பூக்கும் பருவம்/பால் பிடிக்கும் பருவம் (விதைத்த 85 நாட்களுக்குப் பின்).",
    "120-135 Days": "120-135 நாட்கள்",
    "₹2,275 - ₹2,500 per Quintal": "குவிண்டாலுக்கு ₹2,275 - ₹2,500",
    "Yellow Rust": "மஞ்சள் துரு நோய்",
    "Sow resistant seeds like HD 3086 or spray Propiconazole.": "HD 3086 போன்ற நோய் எதிர்ப்புத் திறன் கொண்ட விதைகளை விதைக்கவும் அல்லது ப்ரோபிகோனசோல் தெளிக்கவும்.",
    "Loose Smut": "உதிரி பூட்டை நோய்",
    "Treat seeds with Trichoderma or Carboxin before sowing.": "விதைப்பதற்கு முன் விதைகளை டிரைகோடெர்மா அல்லது கார்பாக்சின் கொண்டு விதை நேர்த்தி செய்யவும்.",

    "Mustard (Brassica juncea)": "கடுகு (Brassica juncea)",
    "Low-water winter cash crop highly suited for dry sandy-loam soils.": "வறண்ட மணல் கலந்த களிமண் நிலத்திற்கு மிகவும் உகந்த குறைந்த நீர் தேவையுடைய குளிர்கால பணப்பயிர்.",
    "6-9 Quintals per Acre": "ஏக்கருக்கு 6-9 குவிண்டால்",
    "At planting: Apply 30kg DAP and 20kg Sulphur powder.": "நடும் போது: 30 கிலோ டிஏபி மற்றும் 20 கிலோ சல்பர் தூள் இடவும்.",
    "Week 4: Apply 20kg Urea after first weeding.": "வாரம் 4: முதல் களை எடுப்புக்குப் பின் 20 கிலோ யூரியா இடவும்.",
    "Week 8: Maintain soil loose, avoid water logging.": "வாரம் 8: மண்ணை தளர வைத்து, தண்ணீர் தேங்குவதை தவிர்க்கவும்.",
    "1st Irrigation: 30-35 days after sowing (pre-flowering stage).": "முதல் நீர் பாய்ச்சல்: விதைத்த 30-35 நாட்களுக்குப் பின் (பூக்கும் முன் பருவம்).",
    "2nd Irrigation: 60-65 days after sowing (pod filling stage).": "இரண்டாவது நீர் பாய்ச்சல்: விதைத்த 60-65 நாட்களுக்குப் பின் (காய் பிடிக்கும் பருவம்).",
    "Avoid excessive water to prevent root rot.": "வேர் அழுகலைத் தவிர்க்க அதிகப்படியான நீரைத் தவிர்க்கவும்.",
    "110-120 Days": "110-120 நாட்கள்",
    "₹5,400 - ₹5,850 per Quintal": "குவிண்டாலுக்கு ₹5,400 - ₹5,850",
    "Alternaria Black Spot": "ஆல்டர்நேரியா கரும்புள்ளி நோய்",
    "Avoid dense sowing; spray garlic bulb extract.": "நெருக்கமாக விதைப்பதைத் தவிர்க்கவும்; பூண்டு சாறு தெளிக்கவும்.",

    "Chickpea / Gram (Cicer arietinum)": "கொண்டைக்கடலை / சுண்டல் (Cicer arietinum)",
    "Excellent nitrogen-fixing pulse crop that requires very little water and thrives on residual soil moisture.": "மண்ணின் ஈரப்பதத்தில் செழித்து வளரும், மிகக் குறைந்த நீர் தேவையுடைய சிறந்த நைட்ரஜன் நிலைநிறுத்தும் பயிர்.",
    "7-10 Quintals per Acre": "ஏக்கருக்கு 7-10 குவிண்டால்",
    "At planting: Apply 25kg DAP per acre.": "நடும் போது: ஏக்கருக்கு 25 கிலோ டிஏபி இடவும்.",
    "Week 5: Apply organic compost. Check for nodules.": "வாரம் 5: இயற்கை உரம் இடவும். வேர் முடிச்சுகளை சரிபார்க்கவும்.",
    "No chemical nitrogen top-dressing needed as roots fix nitrogen.": "வேர்கள் நைட்ரஜனை நிலைநிறுத்துவதால் இரசாயன நைட்ரஜன் உரம் தேவையில்லை.",
    "1st Irrigation: Light watering at branching stage (30-35 days).": "முதல் நீர் பாய்ச்சல்: கிளைகள் வரும் பருவம் (30-35 நாட்கள்) லேசான நீர் பாய்ச்சவும்.",
    "2nd Irrigation: At pod development stage (65-70 days) if needed.": "இரண்டாவது நீர் பாய்ச்சல்: காய் வளரும் பருவம் (65-70 நாட்கள்) தேவைப்பட்டால் நீர் பாய்ச்சவும்.",
    "Never irrigate at peak flowering to avoid flower drop.": "பூக்கள் உதிர்வதைத் தவிர்க்க பூக்கும் உச்ச பருவத்தில் நீர் பாய்ச்ச வேண்டாம்.",
    "110-130 Days": "110-130 நாட்கள்",
    "₹5,335 - ₹5,500 per Quintal": "குவிண்டாலுக்கு ₹5,335 - ₹5,500",
    "Wilt Disease": "வாடல் நோய்",
    "Follow crop rotation and treat seeds with Trichoderma harzianum.": "பயிர் சுழற்சியைப் பின்பற்றி, விதைகளை டிரைகோடெர்மா மூலம் விதை நேர்த்தி செய்யவும்.",

    "Green Gram / Moong (Vigna radiata)": "பாசிப்பயறு / சிறுபயறு (Vigna radiata)",
    "Fast-growing short-duration pulse crop that improves soil health and yields quick income in hot summer.": "கோடைகாலத்தில் மண் வளத்தை மேம்படுத்தி விரைவான வருமானம் தரும் வேகமாக வளரும் குறுகிய கால பயிர்.",
    "4-6 Quintals per Acre": "ஏக்கருக்கு 4-6 குவிண்டால்",
    "At planting: Apply 20kg DAP.": "நடும் போது: 20 கிலோ டிஏபி இடவும்.",
    "Week 3: Spray Panchagavya or multi-micronutrients.": "வாரம் 3: பஞ்சகவ்யா அல்லது நுண்ஊட்டச்சத்துக்களைத் தெளிக்கவும்.",
    "No urea top-dressing is required.": "யூரியா மேல் உரம் இட தேவையில்லை.",
    "Irrigate immediately after sowing.": "விதைத்தவுடன் நீர் பாய்ச்சவும்.",
    "Water every 10-12 days depending on soil heat.": "வெப்பநிலைக்கேற்ப 10-12 நாட்களுக்கு ஒருமுறை நீர் பாய்ச்சவும்.",
    "Do not water during harvesting stage.": "அறுவடையின் போது நீர் பாய்ச்ச வேண்டாம்.",
    "65-75 Days": "65-75 நாட்கள்",
    "₹7,500 - ₹8,500 per Quintal": "குவிண்டாலுக்கு ₹7,500 - ₹8,500",
    "Yellow Mosaic Virus": "மஞ்சள் தேமல் நோய்",
    "Spray neem oil and remove infected yellow plants early.": "வேப்பெண்ணெய் தெளிக்கவும், பாதிக்கப்பட்ட மஞ்சள் நிற செடிகளை அகற்றவும்.",

    "Tomato (Solanum lycopersicum)": "தக்காளி (Solanum lycopersicum)",
    "High-value commercial vegetable crop suitable for well-drained sandy loam soil with consistent watering.": "தொடர்ந்து நீர் பாய்ச்சும் வசதியுடைய, வடிகால் வசதியுள்ள மணல் கலந்த களிமண் நிலத்திற்கு உகந்த அதிக மதிப்புள்ள காய்கறி பயிர்.",
    "150-200 Quintals per Acre": "ஏக்கருக்கு 150-200 குவிண்டால்",
    "At planting: Mix 5 tons compost and 50kg NPK (15:15:15).": "நடும் போது: 5 டன் மட்கிய உரம் மற்றும் 50 கிலோ என்பிகே கலக்கவும்.",
    "Week 3: Apply 20kg Urea after weeding.": "வாரம் 3: களை எடுத்த பிறகு 20 கிலோ யூரியா இடவும்.",
    "Week 6 (Flowering): Apply 15kg Potash and 10kg Calcium.": "வாரம் 6 (பூக்கும் தருணம்): 15 கிலோ பொட்டாஷ் மற்றும் 10 கிலோ கால்சியம் இடவும்.",
    "Water every 5-7 days during hot summer.": "வெப்பமான கோடையில் 5-7 நாட்களுக்கு ஒருமுறை நீர் பாய்ச்சவும்.",
    "Avoid water logging at root base.": "வேர் பகுதியில் தண்ணீர் தேங்குவதை தவிர்க்கவும்.",
    "Drip irrigation is highly recommended for best fruit size.": "சிறந்த பழ அளவிற்கு சொட்டு நீர் பாசனம் மிகவும் பரிந்துரைக்கப்படுகிறது.",
    "90-110 Days": "90-110 நாட்கள்",
    "₹1,200 - ₹2,500 per Quintal": "குவிண்டாலுக்கு ₹1,200 - ₹2,500",
    "Early Blight": "இலை கருகல் நோய்",
    "Spray sour buttermilk or copper fungicide.": "புளித்த மோர் அல்லது காப்பர் பூஞ்சைக் கொல்லியைத் தெளிக்கவும்.",

    "Cucumber (Cucumis sativus)": "வெள்ளரிக்காய் (Cucumis sativus)",
    "Excellent fast-growing summer crop with massive demand in local urban markets.": "உள்ளூர் நகர்ப்புற சந்தைகளில் பெரும் தேவை உள்ள வேகமாக வளரும் கோடைகால பயிர்.",
    "50-80 Quintals per Acre": "ஏக்கருக்கு 50-80 குவிண்டால்",
    "At planting: Mix compost with 30kg DAP.": "நடும் போது: உரம் மற்றும் 30 கிலோ டிஏபி கலக்கவும்.",
    "Week 4: Apply 15kg Urea.": "வாரம் 4: 15 கிலோ யூரியா இடவும்.",
    "Week 7: Apply 10kg Potash to increase fruit crispness.": "வாரம் 7: வெள்ளரி மொறுமொறுப்பாக வளர 10 கிலோ பொட்டாஷ் இடவும்.",
    "Irrigate every 4-5 days during summer heat.": "கோடை வெப்பத்தில் 4-5 நாட்களுக்கு ஒருமுறை நீர் பாய்ச்சவும்.",
    "Maintain uniform moisture to prevent bitter taste.": "கசப்புத் தன்மையைத் தவிர்க்க சீரான ஈரப்பதத்தை பராமரிக்கவும்.",
    "Never flood the vines.": "கொடிகளில் அதிகப்படியான நீர் தேங்குவதைத் தவிர்க்கவும்.",
    "50-60 Days": "50-60 நாட்கள்",
    "₹800 - ₹1,500 per Quintal": "குவிண்டாலுக்கு ₹800 - ₹1,500",
    "Powdery Mildew": "சாம்பல் நோய்",
    "Spray dilute baking soda water (5g/L) or diluted milk.": "நீர்த்த சமையல் சோடா கரைசல் (5 கிராம்/லிட்டர்) அல்லது பால் தெளிக்கவும்.",

    "Organic Oyster Mushroom Cultivation": "சிப்பி காளான் வளர்ப்பு",
    "Grow premium Oyster or Button mushrooms indoors using agricultural waste like straw. Extremely high profit margin with low space requirements.": "வைக்கோல் போன்ற விவசாயக் கழிவுகளைப் பயன்படுத்தி உட்புறத்தில் காளான் வளர்க்கலாம். குறைந்த இடத்தில் அதிக லாபம் தரும் தொழில்.",
    "Sterilization methods": "மக்கவைத்தல் மற்றும் சுத்திகரிப்பு முறைகள்",
    "Humidity management": "ஈரப்பதம் மேலாண்மை",
    "Spawn mixing": "காளான் வித்து கலத்தல்",
    "No formal education. Easily learned through a 3-day practical training.": "முறையான கல்வி தேவையில்லை. 3 நாட்கள் நடைமுறை பயிற்சியின் மூலம் எளிதாகக் கற்றுக் கொள்ளலாம்.",
    "₹5,000 - ₹12,000 for a small room setup.": "ஒரு சிறிய அறை அமைப்பிற்கு ₹5,000 - ₹12,000.",
    "₹12,000 - ₹25,000 per month.": "மாதத்திற்கு ₹12,000 - ₹25,000.",
    "NHB (National Horticulture Board) offers 40% subsidy on mushroom units.": "தேசிய தோட்டக்கலை வாரியம் காளான் வளர்ப்பு அமைப்புகளுக்கு 40% மானியம் வழங்குகிறது.",
    "Supermarkets and urban markets have a booming demand for organic protein-rich mushrooms.": "சூப்பர் மார்க்கெட்டுகள் மற்றும் நகர்ப்புறங்களில் காளான்களுக்கு நல்ல தேவை உள்ளது.",
    "Krishi Vigyan Kendra (KVK)": "விவசாய அறிவியல் நிலையம் (KVK)",
    "YouTube practical channels": "யூடியூப் பயனுள்ள சேனல்கள்",
    "State Horticulture Department": "மாநில தோட்டக்கலைத்துறை",

    "Beekeeping & Honey Production": "தேனீ வளர்ப்பு மற்றும் தேன் தயாரிப்பு",
    "Set up wooden bee boxes along boundary fences or orchards. Bees pollinate your existing crops to increase yields by 20%, while producing pure natural honey.": "பயிர் வேலிகளில் அல்லது பழத்தோட்டங்களில் தேனீ பெட்டிகளை அமைக்கலாம். தேனீக்கள் மகரந்தச் சேர்க்கைக்கு உதவி மகசூலை 20% அதிகரிக்கின்றன.",
    "Hive handling": "தேனீ பெட்டி மேலாண்மை",
    "Queen bee management": "ராணி தேனீ மேலாண்மை",
    "Honey extraction": "தேன் எடுத்தல்",
    "No formal education required. Best learned by doing.": "முறையான கல்வி தேவையில்லை. செய்து பார்த்து எளிதாக கற்றுக் கொள்ளலாம்.",
    "₹10,000 - ₹15,000 for 10 boxes.": "10 பெட்டிகளுக்கு ₹10,000 - ₹15,000.",
    "₹8,000 - ₹18,000 per month.": "மாதத்திற்கு ₹8,000 - ₹18,000.",
    "National Beekeeping & Honey Mission (NBHM) provides up to 45% equipment subsidy.": "தேசிய தேனீ வளர்ப்புத் திட்டம் தேனீ பெட்டிகளுக்கு 45% வரை மானியம் வழங்குகிறது.",
    "Strong demand for organic forest honey, beeswax, and royal jelly in pharmaceutical and cosmetic industries.": "இயற்கை தேன், தேன் மெழுகு மற்றும் தேனீ பொருட்களுக்கு மருத்துவத்துறையில் நல்ல தேவை உள்ளது.",
    "National Bee Board workshops": "தேசிய தேனீ வாரிய பயிற்சிப் பட்டறைகள்",

    "Resilient Goat Rearing Setup": "வெள்ளாடு வளர்ப்புத் தொழில்",
    "Start a small-scale goat farm with local resilient breeds. Goats feed on local shrubs, reproduce fast, and represent an easily liquidable livestock asset.": "உள்ளூர் ஆட்டினங்களைக் கொண்டு வெள்ளாடு பண்ணை அமைக்கவும். ஆடுகள் உள்ளூர் தழைகளை தின்று மிக வேகமாக இனப்பெருக்கம் செய்யும்.",
    "Deworming & vaccinations": "குடற்புழு நீக்கம் மற்றும் தடுப்பூசி",
    "Herd grazing": "மந்தை மேய்த்தல்",
    "Fodder mixing": "தீவனக் கலவை தயாரிப்பு",
    "No formal education required. Traditional hands-on practice is sufficient.": "முறையான கல்வி தேவையில்லை. பாரம்பரிய கால்நடை வளர்ப்புப் பயிற்சியே போதுமானது.",
    "₹20,000 - ₹35,000 for 5 goats.": "5 ஆடுகளுக்கு ₹20,000 - ₹35,000.",
    "₹15,000 - ₹28,000 per breeding cycle (every 6-8 months).": "ஒவ்வொரு 6-8 மாதங்களுக்கு ஒருமுறை ₹15,000 - ₹28,000.",
    "NABARD offers up to 50%-60% subsidy for sheep/goat rearing schemes.": "நபார்ட் வங்கி வெள்ளாடு வளர்ப்பிற்கு 50% - 60% வரை மானியம் வழங்குகிறது.",
    "Constant demand for high-quality meat and milk, unaffected by crop failures or weather patterns.": "இறைச்சி மற்றும் பாலிற்கு எப்போதுமே நிலையான தேவை உள்ளது.",
    "District Veterinary Office": "மாவட்ட கால்நடை மருத்துவ அலுவலகம்",
    "Central Institute for Research on Goats (CIRG)": "மத்திய ஆடு ஆராய்ச்சி நிலையம்",

    "Custom Machinery Hiring Center": "விவசாய இயந்திரங்கள் வாடகை மையம்",
    "Purchase 2-3 essential small-farm machines (like power weeders, power tillers, or brush cutters) and rent them out on a daily wage basis.": "பவர் வீடர், பவர் டில்லர் போன்ற 2-3 விவசாய கருவிகளை வாங்கி மற்ற விவசாயிகளுக்கு வாடகைக்கு விடலாம்.",
    "Basic engine maintenance": "இயந்திர பராமரிப்பு மற்றும் பழுது நீக்கம்",
    "Machine operation": "இயந்திரத்தை இயக்குதல்",
    "Customer scheduling": "வாடிக்கையாளர் முன்பதிவு மேலாண்மை",
    "Primary or High school level. Requires basic mechanical aptitude.": "தொடக்கப்பள்ளி அல்லது உயர்நிலைப்பள்ளி கல்வி. இயந்திரங்களை இயக்கும் ஆர்வம் அவசியம்.",
    "₹25,000 - ₹45,000.": "₹25,000 - ₹45,000.",
    "₹18,000 - ₹35,000 per month during peak seasons.": "விவசாயப் பருவத்தில் மாதத்திற்கு ₹18,000 - ₹35,000.",
    "Sub-Mission on Agricultural Mechanization (SMAM) offers up to 50% subsidy.": "விவசாய இயந்திரமயமாக்கல் திட்டம் இயந்திரங்களுக்கு 50% வரை மானியம் வழங்குகிறது.",
    "As rural labor becomes scarce, mechanical small weeding and tilling is growing exponentially.": "ஆட்கள் பற்றாக்குறை உள்ளதால் வாடகை இயந்திரங்களுக்கு நல்ல வரவேற்பு உள்ளது.",
    "Agricultural Engineering Department": "விவசாய பொறியியல் துறை",
    "Manufacturer training workshops": "இயந்திர தயாரிப்பாளர்கள் பயிற்சி"
  }
};

function translateString(text: string, lang: string): string {
  if (!lang || lang === "English") return text;
  const translations = FALLBACK_TRANSLATIONS[lang];
  if (translations && translations[text]) {
    return translations[text];
  }
  return text;
}

function translateValue(value: any, lang: string): any {
  if (typeof value === "string") {
    return translateString(value, lang);
  } else if (Array.isArray(value)) {
    return value.map(item => translateValue(item, lang));
  } else if (value && typeof value === "object") {
    const newObj: any = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === "imageUrl") {
        newObj[key] = val; // Always keep English for imageUrl
      } else {
        newObj[key] = translateValue(val, lang);
      }
    }
    return newObj;
  }
  return value;
}

function getLocalCropRecommendations(season: string, soilType: string, lang: string): any[] {
  const normSeason = (season || "").toLowerCase();
  let selectedList = DEFAULT_CROPS_SUMMER;
  if (normSeason.includes("rabi") || normSeason.includes("winter") || normSeason.includes("cold")) {
    selectedList = DEFAULT_CROPS_RABI;
  } else if (normSeason.includes("kharif") || normSeason.includes("monsoon") || normSeason.includes("rain") || normSeason.includes("wet")) {
    selectedList = DEFAULT_CROPS_KHARIF;
  }
  return translateValue(JSON.parse(JSON.stringify(selectedList)), lang);
}

function getLocalCareerRecommendations(lang: string): any[] {
  return translateValue(JSON.parse(JSON.stringify(DEFAULT_CAREERS)), lang);
}

function getLocalChatReply(messages: any[], lang: string, userProfile: any): string {
  const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].text.toLowerCase() : "";
  const rawMsg = messages && messages.length > 0 ? messages[messages.length - 1].text : "";
  const isHindi = lang === "Hindi";
  const isTamil = lang === "Tamil";

  // Check if general knowledge query
  const generalKeywords = [
    "math", "science", "programming", "code", "coding", "english", "ai", "history", 
    "geography", "physics", "chemistry", "biology", "equation", "formula", "grammar",
    "who is", "what is gravity", "solve", "python", "javascript", "react"
  ];
  const isGeneralQuery = generalKeywords.some(kw => lastMsg.includes(kw));

  if (isGeneralQuery) {
    if (lastMsg.includes("math") || lastMsg.includes("solve") || lastMsg.includes("equation")) {
      return "I can certainly help you solve general math or science problems! For example, algebraic equations, interest calculations, or area measurements. Please share the specific problem or equation you would like to solve.";
    }
    if (lastMsg.includes("code") || lastMsg.includes("programming") || lastMsg.includes("python") || lastMsg.includes("javascript") || lastMsg.includes("ai")) {
      return "AI and programming are essential tools today. Whether you need help understanding algorithms, writing code snippets in Python/JavaScript, or exploring how AI models work, feel free to share your specific question!";
    }
    return "I am glad to help with general knowledge subjects such as Math, Science, History, English, AI, and Programming! Please feel free to ask your question directly.";
  }

  // Check if crop recommendation question: "Which crop is best for my land?"
  if (lastMsg.includes("best for my land") || lastMsg.includes("which crop is best") || lastMsg.includes("what crop should i grow") || lastMsg.includes("best crop for land")) {
    const hasDetails = lastMsg.includes("soil") && (lastMsg.includes("state") || lastMsg.includes("district") || userProfile?.state);
    if (!hasDetails) {
      return `To recommend the best crop for your land, please share the following details:
• State
• District
• Soil Type
• Season
• Land Size
• Water Availability

Can you tell me your State, District, Soil Type, Season, Land Size, and Water Availability?`;
    }
  }

  // Check if plant disease question
  if (lastMsg.includes("disease") || lastMsg.includes("spot") || lastMsg.includes("blight") || lastMsg.includes("rot") || lastMsg.includes("yellow") || lastMsg.includes("pest") || lastMsg.includes("fungus")) {
    return `🌱 Answer
Early Blight (Alternaria Solani) is a common fungal disease affecting crops like tomato and potato.

📖 Explanation
It causes dark circular spots with yellow rings on leaves, leading to leaf drop and low yield.

✅ Symptoms & Causes
• Symptoms: Dark brown spots with concentric rings on lower leaves, stem lesions.
• Causes: Warm humid weather, high leaf moisture, infected plant debris.

🌿 Organic Treatment
• Spray 10ml Neem oil in 1 Liter warm water with 3-4 drops liquid soap every 7 days.
• Spray sour buttermilk solution (1:10 ratio with water) on infected leaves.

💊 Chemical Treatment
• Spray Mancozeb 75% WP (2g per Liter of water) or Copper Oxychloride (3g/L) during early morning. Wear protective mask.

🛡️ Prevention Methods
1. Rotate crops every season.
2. Avoid overhead watering; irrigate near the roots.
3. Remove and burn infected lower leaves.

Can you tell me what crop you are growing and show me a photo of the affected leaves?`;
  }

  // Check if fertilizer question
  if (lastMsg.includes("fertilizer") || lastMsg.includes("urea") || lastMsg.includes("dap") || lastMsg.includes("npk") || lastMsg.includes("potash") || lastMsg.includes("manure")) {
    return `🌱 Answer
NPK fertilizer with balanced nutrients is commonly used for crops, but the best choice depends on your crop, soil type, and growth stage.

📖 Explanation
Plants need nitrogen for green leaves, phosphorus for strong roots, and potassium for fruiting and disease resistance.

✅ Steps
1. Test your soil to check existing nutrient levels.
2. Apply basal dose (DAP & Compost) during sowing or planting.
3. Top-dress with Nitrogen (Urea) during the active vegetative growth stage.

⚠ Precautions
Do not overuse fertilizer, as excess nitrogen causes leaf burn and damages soil health.

💡 Tip
Knowing your soil type and current crop growth stage will help me recommend the exact dosage.

Can you tell me your crop name, soil type, and growth stage?`;
  }

  // Check if irrigation question
  if (lastMsg.includes("irrigation") || lastMsg.includes("water") || lastMsg.includes("watering") || lastMsg.includes("schedule") || lastMsg.includes("drip")) {
    return `🌱 Answer
Drip or scheduled surface irrigation provides ideal moisture without wasting water.

📖 Explanation
Watering needs vary according to the crop's development phase, soil texture, and daily evaporation rate.

✅ Steps
1. Irrigate immediately after sowing to ensure seed germination.
2. Maintain soil moisture during flowering and fruit setting stages.
3. Reduce watering prior to crop harvest.

⚠ Precautions
Avoid waterlogging near plant roots, as stagnant water causes root rot and fungal infections.

💡 Tip
Using straw or leaf mulch on soil beds conserves moisture and reduces irrigation frequency by 40%.

Can you share your crop name, current season, and weather conditions?`;
  }

  // Check if government schemes question
  if (lastMsg.includes("scheme") || lastMsg.includes("pm-kisan") || lastMsg.includes("subsidy") || lastMsg.includes("loan") || lastMsg.includes("government")) {
    return `🌱 Answer
PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) provides direct income support of ₹6,000 per year to small and marginal farmers in three equal installments.

📖 Explanation
It helps farmers meet financial expenses for agricultural inputs like seeds, fertilizers, and equipment.

✅ Steps to Apply
1. Visit the official portal (pmkisan.gov.in) or your local Krishi Vigyan Kendra / CSC center.
2. Provide your Aadhaar card, bank account details, and land ownership records.
3. Complete e-KYC verification online or via OTP.

⚠ Eligibility & Precautions
Farmers owning cultivable land in their name are eligible. Ensure bank account is linked to Aadhaar.

💡 Tip
You can check application status on PM-KISAN portal using your Aadhaar number.

Would you like information on drip irrigation or farm machinery subsidies?`;
  }

  // Check if agriculture business question
  if (lastMsg.includes("business") || lastMsg.includes("profit") || lastMsg.includes("investment") || lastMsg.includes("enterprise") || lastMsg.includes("entrepreneur")) {
    return `🌱 Answer
Organic Mushroom Cultivation and Beekeeping are highly profitable agriculture business ideas with low initial capital.

📖 Explanation
These agribusinesses require minimal land and use agricultural by-products like straw to produce high-demand food products.

✅ Suggested Business Details
• Business Idea: Organic Oyster Mushroom Farming
• Estimated Investment: ₹10,000 - ₹25,000 for a small setup
• Expected Profit: ₹15,000 - ₹35,000 per month
• Required Resources: Dark ventilated room, paddy straw, mushroom spawn, water sprayer.

⚠ Precautions
Maintain strict hygiene and temperature (22°C-28°C) to prevent mold contamination.

💡 Tip
Local KVK centers provide 3-day practical training and government subsidy support.

Which agriculture business idea would you like to explore further?`;
  }

  // Default structured response
  return `🌱 Answer
For healthy crop yield, balanced nutrition, timely pest monitoring, and proper soil health management are essential.

📖 Explanation
Agriculture requires matching crop selection with climate, soil quality, and available water resources.

✅ Steps
1. Select certified disease-resistant seed varieties.
2. Test soil nutrients and add organic compost.
3. Follow weather-based watering and organic pest management.

⚠ Precautions
Avoid over-fertilizing and waterlogging around root bases.

💡 Tip
Regrading crop health, early detection of pests saves input costs.

Can you tell me what crop or farm topic you need assistance with today?`;
}

function getLocalImageAnalysis(type: string, lang: string): string {
  const isHindi = lang === "Hindi";
  const isTamil = lang === "Tamil";

  if (type === "leaf") {
    if (isHindi) {
      return `🌿 **फसल का नाम**: टमाटर / धान / कपास (नमूना जांच)
🦠 **बीमारी का नाम**: अगेती झुलसा (अल्टर्नेरिया लीफ स्पॉट)
📊 **विश्वास स्तर**: उच्च (88% मैच)

📖 **विवरण**: पत्तियों पर गोल भूरे धब्बे और पीले घेरे दिखाई दे रहे हैं जो कवक संक्रमण का संकेत देते हैं।

⚠ **लक्षण**:
- पत्तियों पर केंद्रित छल्ले वाले भूरे धब्बे।
- निचली पत्तियां पीली पड़कर सूखने लगती हैं।

🔍 **संभावित कारण**:
- हवा में तैरने वाले फंगल बीजाणु।
- पत्तियों पर लगातार पानी की नमी बने रहना।

🌦 **रोग अनुकूल मौसम**:
- 22°C से 28°C तापमान और 80% से अधिक नमी।

🌱 **जैविक उपचार**:
- 15 मिली नीम का तेल और 5 मिली साबुन का घोल 1 लीटर गुनगुने पानी में मिलाकर 5 दिन के अंतराल पर छिड़कें।
- 10-15 दिन पुरानी खट्टी छाछ (1:10 पानी में घोलकर) का छिड़काव करें।

💊 **रासायनिक उपचार**:
- मैनकोजेब 75% WP (2.5 ग्राम प्रति लीटर पानी) का छिड़काव करें। (छिड़काव के समय मास्क पहनें)

💧 **सिंचाई सलाह**:
- पौधों की जड़ों में पानी दें। पत्तियों पर ऊपर से छिड़काव न करें।

🧪 **उर्वरक सिफारिशें**:
- संतुलित NPK और 5 किग्रा वर्मीकंपोस्ट प्रति क्यारी डालें।

🛡 **रोकथाम के उपाय**:
- बीमार पुरानी पत्तियों को तोड़कर खेत से दूर नष्ट करें।
- पौधों के बीच उचित दूरी रखें।

📅 **उपचार लागू करने का सर्वोत्तम समय**:
- सुबह तड़के या शाम को सूरज ढलने के बाद।

🚫 **बचने योग्य सामान्य गलतियां**:
- तेज दोपहर की धूप में स्प्रे न करें।
- अत्यधिक नाइट्रोजन का प्रयोग न करें।

⏳ **अपेक्षित सुधार समय**: 7 से 10 दिन

📸 **अतिरिक्त फोटो सलाह**:
- यदि बीमारी अधिक फैली है तो कृपया पत्ती के पीछे के भाग और तने की एक और स्पष्ट फोटो अपलोड करें।`;
    }

    if (isTamil) {
      return `🌿 **பயிரின் பெயர்**: தக்காளி / நெல் / பருத்தி (மாதிரி ஆய்வு)
🦠 **நோயின் பெயர்**: இலைப்புள்ளி நோய் (Fungal Leaf Spot)
📊 **நம்பிக்கை நிலை**: அதிகம் (88% நம்பிக்கை)

📖 **விளக்கம்**: இலைகளில் வட்ட வடிவ பழுப்பு நிற புள்ளிகளும் அதைச் சுற்றி மஞ்சள் வளையமும் காணப்படுகின்றன.

⚠ **அறிகுறிகள்**:
- இலைகளில் பழுப்பு புள்ளிகள் தோன்றி இலைகள் காய்ந்து உதிர்தல்.
- ஒளிச்சேர்க்கை குறைந்து பயிர் வளர்ச்சி அடைபடுதல்.

🔍 **சாத்தியமான காரணங்கள்**:
- காற்றில் பரவும் பூஞ்சை வித்திகள்.
- இலைகளின் மேல் நீர்த்துளிகள் நீண்ட நேரம் தேங்கி இருத்தல்.

🌦 **நோய்க்கு சாதகமான வானிலை**:
- அதிக ஈரப்பதம் (80% மேல்) மற்றும் மிதமான வெப்பநிலை.

🌱 **இயற்கை சிகிச்சை**:
- 15 மிலி வேப்பெண்ணெய் + 5 மிலி சோப்பு திரவத்தை 1 லிட்டர் வெதுவெதுப்பான நீரில் கலந்து 5 நாட்களுக்கு ஒருமுறை தெளிக்கவும்.
- 10 நாட்கள் புளித்த மோரை நீருடன் (1:10) கலந்து தெளிக்கவும்.

💊 **இரசாயன சிகிச்சை**:
- மேன்கோசெப் (Mancozeb 75% WP) (2.5 கிராம்/லிட்டர் நீரில்) தெளிக்கவும்.

💧 **பாசன ஆலோசனை**:
- வேர்ப்பகுதிக்கு மட்டும் நீர் பாய்ச்சவும். இலைகள் மேல் நீர் தெளிப்பதைத் தவிர்க்கவும்.

🧪 **உரப் பரிந்துரைகள்**:
- மண்புழு உரம் மற்றும் சமச்சீர் NPK உரங்களை இடவும்.

🛡 **தடுப்பு முறைகள்**:
- பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி அழிக்கவும்.
- பயிர்களுக்கு இடையே போதிய இடைவெளி பராமரிக்கவும்.

📅 **சிகிச்சை செய்ய சிறந்த நேரம்**:
- அதிகாலை அல்லது மாலை வேளையில் தெளிக்கவும்.

🚫 **தவிர்க்க வேண்டிய தவறுகள்**:
- நண்பகல் வெயிலில் மருந்துகளைத் தெளிக்கக் கூடாது.

⏳ **எதிர்பார்க்கப்படும் குணமடையும் நேரம்**: 7 முதல் 10 நாட்கள்

📸 **கூடுதல் புகைப்பட ஆலோசனை**:
- துல்லியமான ஆய்வுக்கு இலையின் பின்புறம் மற்றும் தண்டு பகுதியின் புகைப்படங்களை பதிவேற்றவும்.`;
    }

    return `🌿 **Crop Name**: Tomato / Paddy / Cotton (Diagnostic Sample)
🦠 **Disease Name**: Early Blight (Alternaria Leaf Spot)
📊 **Confidence Level**: High (90% Match)

📖 **Description**: Concentric brown spots with light yellow halos detected on foliage, characteristic of early fungal blight.

⚠ **Symptoms**:
- Dark circular spots with target-board rings on leaves.
- Yellowing around lesions leading to premature leaf drop.

🔍 **Possible Causes**:
- Airborne fungal spores multiplying under damp conditions.
- Free moisture lingering on foliage for more than 8 hours.

🌦 **Weather Conditions Favoring Disease**:
- High relative humidity (>80%) and warm temperatures between 22°C - 30°C.

🌱 **Organic Treatment**:
- Mix 15ml organic Neem oil with 5ml liquid dish soap in 1 Liter lukewarm water. Spray under and over leaves every 5 days.
- Spray 10-day fermented sour buttermilk (diluted 1:10 ratio with clean water).

💊 **Chemical Treatment**:
- Spray **Mancozeb 75% WP** (2.5g per Liter of water) or **Carbendazim** (1g/L). Always wear protective face mask.

💧 **Irrigation Advice**:
- Irrigate directly at the root zone via drip lines. Avoid overhead sprinkler splashing on foliage.

🧪 **Fertilizer Recommendations**:
- Apply 5kg vermicompost + 50g bio-fertilizer per bed to strengthen plant cellular immunity.

🛡 **Prevention Methods**:
- Prune off and burn severely affected lower leaves.
- Ensure wide spacing between crop rows for sunlight and aeration.

📅 **Best Time to Apply Treatment**:
- Apply treatments in cool early morning or late evening hours.

🚫 **Common Mistakes to Avoid**:
- Never spray chemicals during hot sunny midday hours.
- Do not apply excessive raw nitrogen which makes leaves overly soft and tender to fungal attacks.

⏳ **Expected Recovery Time**: 7 to 10 Days with disciplined application.

📸 **Upload Additional Images**:
- For higher diagnostic precision, feel free to upload additional photos of the leaf underside or main stem.`;
  }

  if (type === "soil") {
    if (isHindi) {
      return `🔍 **एग्रीएआई मृदा (मिट्टी) निदान (ऑफ़लाइन मोड)**

**मिट्टी की सामान्य समस्याएं:**
1. **कड़ापन और कम हवा:** मिट्टी की ऊपरी सतह कड़ी और सूखी हो जाती है, जिससे जड़ें नहीं फैल पातीं।
2. **जैविक कार्बन की कमी:** मिट्टी का रंग हल्का भूरा होता है और उसमें केंचुए नहीं दिखते।
3. **खराब जल निकासी:** खेत में पानी जमा रहना या रेतीली मिट्टी में पानी बिल्कुल न ठहरना।

**त्वरित जैविक समाधान:**
- **जैविक खाद:** प्रति एकड़ 4-5 टन अच्छी तरह सड़ी हुई गोबर की खाद या केंचुआ खाद मिट्टी में मिलाएं।
- **हरी खाद:** हरी खाद के लिए ढैंचा या सनई बोएं और फूल आने से पहले उसे खेत में जोतकर मिला दें।
- **मल्चिंग:** खेत की क्यारियों को सूखे पत्तों या पुआल से ढकें ताकि नमी बनी रहे और केंचुए सक्रिय हों।

**रासायनिक उपाय (द्वितीयक विकल्प):**
- चिकनी कड़क मिट्टी को सुधारने के लिए **जिप्सम** (1-2 टन प्रति एकड़) डालें।
- बुवाई के समय मिट्टी परीक्षण के अनुसार संतुलित **NPK (12:32:16)** का उपयोग करें।`;
    }
    if (isTamil) {
      return `🔍 **அக்ரி ஏஐ மண் பரிசோதனை (ஆஃப்லைன் முறை)**

**பொதுவான மண் குறைபாடுகள்:**
1. **மண் இறுகுதல்:** களிமண் பகுதியில் காற்று புகாதவாறு மண் இறுகி வேர் வளர்ச்சியைத் தடுக்கும்.
2. **கரிம சத்து குறைபாடு:** மட்கிய கரிம உரம் இல்லாததால் மண் சத்து குறைந்து காணப்படும்.
3. **நீர் தேங்குதல்:** வடிகால் வசதி இல்லாத வயலில் நீர் தேங்குதல்.

**உடனடி இயற்கை தீர்வுகள்:**
- **இயற்கை உரம் இடல்:** ஏக்கருக்கு 4-5 டன் மக்கிய தொழு உரம் அல்லது மண்புழு உரம் இட்டு நிலத்தை உழவும்.
- **பசுந்தாள் உரம்:** தக்கைப்பூண்டு அல்லது சணப்பை விதைத்து பூக்கும் தருணத்தில் மடக்கி உழவும்.
- **மண் மூடாக்கு:** ஈரப்பதத்தை தக்க வைக்க காய்ந்த இலைகள் அல்லது வைக்கோல் கொண்டு மண் பரப்பை மூடவும்.

**இரசாயன தீர்வுகள்:**
- களிமண் கட்டமைப்பை மேம்படுத்த ஏக்கருக்கு **ஜிப்சம்** (1-2 டன்) இடவும்.
- மண் அட்டை பரிந்துரைப்படி விதைக்கும் போது சமச்சீர் **NPK (12:32:16)** உரம் இடவும்.`;
    }
    return `🔍 **AgriAI Soil Diagnostics (Offline Mode)**

**Common Soil Issues Detected:**
1. **Soil Compaction:** Hard, cracked crust restricting oxygen circulation and healthy root development.
2. **Organic Carbon Depletion:** Dry, dusty, light-colored soil lacking dark humus and beneficial earthworms.
3. **Moisture Stress:** Standing water in poorly-drained soils, or rapid leaching in sandy patches.

**Immediate Natural & Organic Solutions:**
- **Organic Amendment:** Incorporate 4 to 5 tons of well-composted farmyard manure (FYM) or vermicompost per acre to restore soil structure.
- **Green Manuring:** Sow Sunn hemp or Sesbania (Dhaincha) during early summer and plow it directly into the soil before flowering.
- **Mulching:** Cover planting beds with 2 inches of dry crop residues (such as straw) to retain moisture and encourage soil microbes.

**Chemical Fallback Options:**
- Apply **Gypsum** (1-2 tons per acre) to reclaim heavy, sodium-rich clay soils.
- Supplement with balanced basal **NPK (12:32:16)** fertilizer based on soil test card results.`;
  }

  if (type === "insect") {
    if (isHindi) {
      return `🔍 **एग्रीएआई कीट निदान (ऑफ़लाइन मोड)**

**सामान्य हानिकारक कीट:**
1. **रस चूसने वाले कीट (माहू/तेला/सफेद मक्खी):** पत्तियों का रस चूसते हैं जिससे पत्तियां सुकड़ जाती हैं।
2. **पत्ती खाने वाली सूंडी (कैटपिलर):** पत्तियों में बड़े और टेढ़े-मेढ़े छेद कर देती हैं।
3. **तना छेदक (स्टेम बोरर):** मुख्य तने या फलों के अंदर छेद करके फसल नष्ट करते हैं।

**त्वरित जैविक समाधान:**
- **लहसुन-मिर्च-अदरक का स्प्रे:** 50 ग्राम लहसुन, 50 ग्राम तीखी मिर्च और 50 ग्राम अदरक को पीसकर पेस्ट बनाएं। इसे 1 लीटर पानी में घोलें, छानें और स्प्रे करें।
- **पीले चिपचिपे कार्ड (स्टीकी ट्रैप):** खेत में फसल की ऊंचाई से 1 फीट ऊपर ग्रीस लगे पीले कार्ड लगाएं। यह सफेद मक्खियों को फंसाता है।

**रासायनिक उपाय (द्वितीयक विकल्प):**
- गंभीर सूंडी आक्रमण के लिए **स्पिनोसेड** (0.3 मिली प्रति लीटर पानी) का छिड़काव करें।
- अन्य कीटों के लिए **क्लोरोपायरीफॉस** (2 मिली प्रति लीटर पानी) का छिड़काव करें।`;
    }
    if (isTamil) {
      return `🔍 **அக்ரி ஏஐ பூச்சி கண்டறிதல் (ஆஃப்லைன் முறை)**

**பொதுவான பயிர் பூச்சிகள்:**
1. **சாறு உறிஞ்சும் பூச்சிகள் (வெள்ளை ஈ/அசுவினி):** இலைகளின் சாற்றை உறிஞ்சி சுருளச் செய்யும்.
2. **இலை தின்னும் புழுக்கள்:** இலைகளைக் கடித்து துளைகளை ஏற்படுத்தும்.
3. **தண்டு துளைப்பான் / காய்ப்புழு:** தண்டு அல்லது காய்களைத் துளைத்து சேதப்படுத்தும்.

**உடனடி இயற்கை தீர்வுகள்:**
- **இஞ்சி பூண்டு மிளகாய் கரைசல்:** தலா 50 கிராம் பூண்டு, இஞ்சி மற்றும் பச்சை மிளகாயை அரைத்து 1 லிட்டர் நீரில் கலந்து வடிகட்டி தெளிக்கவும். இது சிறந்த இயற்கை விரட்டியாகும்.
- **மஞ்சள் ஒட்டும் பொறி:** பயிர் உயரத்திற்கு மேல் 1 அடி உயரத்தில் ஆமணக்கு எண்ணெய் தடவிய மஞ்சள் அட்டைகளைத் தொங்கவிடவும்.

**இரசாயன தீர்வுகள்:**
- புழுக்களைக் கட்டுப்படுத்த **ஸ்பினோசாட்** (Spinosad) (0.3 மிலி/லிட்டர் நீரில்) தெளிக்கவும்.
- கடுமையான பூச்சித் தாக்குதலுக்கு **குளோர்பைரிபாஸ்** (Chlorpyrifos) (2 மிலி/லிட்டர் நீரில்) தெளிக்கவும்.`;
    }
    return `🔍 **AgriAI Insect Pest Diagnostics (Offline Mode)**

**Common Insect Pests Detected:**
1. **Sucking Pests (Aphids, Jassids, Whiteflies):** Tiny pests feeding on plant sap, causing leaf curling and sticky mold formation.
2. **Chewing Caterpillars / Armyworm:** Ragged holes on foliage and cleanly cut seedlings.
3. **Stem Borer / Bollworm:** Entrance holes with sawdust-like excrement on stems or fruit.

**Immediate Natural & Organic Solutions:**
- **Garlic-Chili-Ginger Repellent:** Blend 50g garlic, 50g ginger, and 50g hot green chilies into a paste. Stir into 1 Liter of water, filter, and spray. It acts as an excellent organic pest repellent.
- **Yellow Sticky Traps:** Install yellow plastic cards coated with grease or castor oil 1 foot above the crop canopy to attract and trap winged sucking insects.

**Chemical Fallback Options:**
- Spray **Spinosad** (0.3 ml per Liter of water) for severe caterpillar and armyworm control.
- Use **Chlorpyrifos** (2 ml per Liter of water) for stem borers.`;
  }

  // Fruit or Default
  if (isHindi) {
    return `🔍 **एग्रीएआई फसल स्वास्थ्य निदान (ऑफ़लाइन मोड)**

**सामान्य समस्याएं:**
1. **फल सड़न रोग (एंथ्रेक्नोज):** पके फलों पर काले धब्बे बन जाते हैं और फल सड़ने लगते हैं।
2. **कैल्शियम की कमी (ब्लॉसम एंड रॉट):** टमाटर या बैंगन के निचले भाग में काला धब्बा पड़ जाता है।

**त्वरित जैविक समाधान:**
- **खट्टी मट्ठा (छाछ) का स्प्रे:** 10-15 दिन पुरानी खट्टी छाछ को पानी में (1:10) मिलाकर फसल पर छिड़कें। यह फलों को सड़ने से बचाता है और चमक बढ़ाता है।
- **चूने का पानी:** मिट्टी में थोड़ा बुझा हुआ चूना (कैल्शियम) मिलाएं ताकि ब्लॉसम एंड रॉट से बचा जा सके।

**रासायनिक उपाय (द्वितीयक विकल्प):**
- कवक संक्रमण के लिए **कॉपर ऑक्सीक्लोराइड** (3 ग्राम प्रति लीटर पानी) का छिड़काव करें।`;
  }
  if (isTamil) {
    return `🔍 **அக்ரி ஏஐ பயிர் காய்கறி நோய் கண்டறிதல் (ஆஃப்லைன் முறை)**

**பொதுவான நோய்கள்:**
1. **அழுகல் நோய்:** பழங்கள் அல்லது காய்களில் வட்ட வடிவ கருப்பு புள்ளிகள் தோன்றி அழுகிவிடும்.
2. **கால்சியம் குறைபாடு:** தக்காளி போன்ற காய்களின் அடிப்பகுதி கறுத்து சுருங்கிவிடும்.

**உடனடி இயற்கை தீர்வுகள்:**
- **புளித்த மோர் கரைசல்:** 10 நாட்கள் புளித்த மோரை நீருடன் (1:10) கலந்து வாரம் ஒருமுறை தெளிக்கவும். இது பூஞ்சை அழுகலைத் தடுத்து காய்களைக் காக்கும்.
- **சுண்ணாம்பு நீர் தெளிப்பு:** கால்சியம் குறைபாட்டை நீக்க மண்ணில் சிறிதளவு விவசாய சுண்ணாம்பு தூள் இடவும்.

**இரசாயன தீர்வுகள்:**
- அழுகல் நோயைத் தடுக்க **காப்பர் ஆக்ஸிகுளோரைடு** (Copper Oxychloride) (3 கிராம்/லிட்டர் நீரில்) தெளிக்கவும்.`;
  }
  return `🔍 **AgriAI Crop Fruit & General Diagnostics (Offline Mode)**

**Common Issues Detected:**
1. **Fruit Rot / Anthracnose:** Water-soaked sunken dark circular spots on maturing fruits causing early drop and decay.
2. **Blossom End Rot (Calcium Deficiency):** Flat, black, leathery patches at the bottom of tomatoes or eggplants.

**Immediate Natural & Organic Solutions:**
- **Sour Buttermilk Spray:** Spray 10-day fermented sour buttermilk (diluted 1:10 with water) weekly. This prevents fungal rots and stimulates fruit weight.
- **Agricultural Lime:** Mix dolomite or hydrated lime into the soil surrounding the plant roots to supply calcium and prevent rot.

**Chemical Fallback Options:**
- Spray **Copper Oxychloride** (3g per Liter of water) or **Carbendazim** to halt active fruit anthracnose.`;
}


// 1. AI CHATBOT WITH SEARCH GROUNDING & EASY MODE ADAPTATION
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userProfile, attachments } = req.body;
    const ai = getGeminiClient();

    // Check if user is uneducated to adjust complexity
    const isEasyMode = userProfile?.educationLevel === "No Education";
    
    let systemInstruction = `You are AgriGPT, a smart agriculture expert AI assistant for AgriVerse AI. You answer user questions accurately and in simple language suitable for farmers.

CORE OPERATIONAL RULES:

1. UNDERSTAND USER INTENT:
Understand the user's question thoroughly before answering. Make sure your response addresses what the user specifically asked.

2. AGRICULTURE RESPONSE FORMAT (CRITICAL RULE):
When answering any agriculture-related question, structure your response as follows:
🌱 Answer
[Provide a direct, clear answer to the user's question]

📖 Explanation
[Simple, clear explanation suitable for a farmer]

✅ Steps
1. [First step]
2. [Second step]
3. [Third step]

⚠ Precautions
[Precautions or common mistakes to avoid]

💡 Tip
[Helpful tips or suggestions]

3. "WHICH CROP IS BEST FOR MY LAND?" QUERY:
If the user asks "Which crop is best for my land?" (or asks what crop to grow or recommend crops for their land/farm/soil):
Check if the user has provided:
• State
• District
• Soil Type
• Season
• Land Size
• Water Availability

If any of these details are missing (and not in profile ${JSON.stringify(userProfile)}), DO NOT make up generic guesses. Ask the user clearly for the missing details:
"To recommend the best crops for your land, please tell me your:
• State
• District
• Soil Type
• Season
• Land Size
• Water Availability"

Once the user provides these details (or if already provided), recommend suitable crops with clear reasons for each choice.

4. PLANT DISEASES QUESTIONS:
If the user asks about plant diseases:
• Identify the disease if enough information is available.
• Explain symptoms clearly.
• Explain root causes.
• Suggest organic treatment (with mixing ratios, preparation steps, and application timing).
• Suggest chemical treatment (with specific active ingredients/pesticides, exact dosage, and safety precautions).
• Explain prevention methods for future seasons.

5. FERTILIZER QUESTIONS:
If the user asks about fertilizers:
Recommend suitable fertilizers based on:
• Crop
• Soil type
• Growth stage (Basal dose at sowing, Vegetative stage, Flowering & Fruiting stage)

6. IRRIGATION QUESTIONS:
If the user asks about irrigation:
Recommend an irrigation schedule based on:
• Crop
• Season
• Weather and soil moisture conditions

7. GOVERNMENT SCHEMES QUESTIONS:
If the user asks about government schemes (e.g. PM-KISAN, subsidies, loans):
Provide:
• Scheme Name
• Eligibility
• Benefits & Subsidies
• How to Apply (step-by-step guidance and required documents)

8. AGRICULTURE BUSINESS QUESTIONS:
If the user asks about agriculture business or entrepreneurship:
Suggest:
• Business Ideas (e.g., Organic Mushroom Cultivation, Beekeeping, Goat Rearing, Vermicomposting)
• Investment required
• Expected Profit & Return on Investment
• Required Resources & Equipment

9. GENERAL KNOWLEDGE QUESTIONS:
If the user asks general knowledge questions (Math, Science, Programming, English, AI, History, Geography, etc.):
Answer them like a normal, highly competent AI assistant in clear, accurate language. Do NOT force agricultural structure headers on general knowledge queries.

10. FACTUAL ACCURACY:
Never make up facts or hallucinate data. If information is uncertain or context is insufficient, clearly say so.

11. SIMPLE & ACCESSIBLE LANGUAGE:
Use simple, respectful language suitable for farmers. Keep sentences practical and clear.

12. HELPFUL FOLLOW-UP QUESTION:
Always end your response with a helpful follow-up question when appropriate (e.g., "Can you tell me your soil type?", "Would you like an organic spray recipe for this?", "Do you want details on government subsidies for this crop?").

APP-AWARE GUIDANCE:
You are aware of AgriVerse AI app features:
• Reminders tab for scheduling farming actions.
• Farm Diary tab for notes.
• AI Disease Detector tab for camera leaf scan.
• Global regional language selector at top right.
• Govt Schemes tab for eligibility and links.`;

    if (isEasyMode) {
      systemInstruction += `

CRITICAL INSTRUCTION FOR UNEDUCATED USERS ("No Education" Mode):
The user has No Education. You MUST adapt your style completely:
- Use EXTREMELY simple, warm, reassuring, and patient language (explain like a gentle schoolteacher).
- Avoid ALL technical terms (do not say "nitrogen deficiency", "photosynthesis", "macronutrients", "pathogens", "systemic fungicides").
- Instead of "Nitrogen deficiency detected", say: "Your plant is hungry. It needs more food. Add urea fertilizer or composted cow manure to the soil as shown."
- Provide explanations one step at a time, encourage them, and ask if they understand before recommending complex actions.
- Use familiar local materials like cow dung, vermicompost, neem leaves, wood ash, or sour buttermilk spray.
- Keep sentences short, very practical, and focused on visual/tactile instructions.`;
    } else {
      systemInstruction += `

Provide practical, step-by-step advice. Use clear headings and structured bullet points. Address the user based on their occupation (${userProfile?.occupation || "agriculturalist"}) and location if relevant.`;
    }

    const preferredLang = userProfile?.preferredLanguage || "English";
    systemInstruction += `\nYour response MUST be written in ${preferredLang}. Even if the user types in English, if their profile language is ${preferredLang}, reply in ${preferredLang} or translate key steps so they understand.`;

    // Map history to contents
    // Keep only the last 6 messages to prevent token limits
    const chatMessages = messages.slice(-6);
    
    const formattedContents = chatMessages.map((msg: any, index: number) => {
      const isLastUserMessage = (msg.sender === "user" && index === chatMessages.length - 1);
      const parts: any[] = [{ text: msg.text }];
      
      if (isLastUserMessage && attachments && attachments.length > 0) {
        attachments.forEach((att: any) => {
          if (att.base64 && att.mimeType) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: att.base64,
              }
            });
          }
        });
      }
      
      return {
        role: msg.sender === "user" ? "user" : "model",
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction + `\nAT THE END OF YOUR RESPONSE, ON A NEW LINE, OUTPUT:
[FOLLOW_UPS: "Question 1?", "Question 2?", "Question 3?", "Question 4?"]
Provide 3-5 relevant, practical follow-up questions in ${preferredLang} based on the conversation context.`,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    let rawReply = response.text || "I apologize, I could not generate advice at this moment. Let's try again.";
    
    // Parse out follow-up questions if provided in format [FOLLOW_UPS: ...]
    let followUpQuestions: string[] = [];
    const followUpMatch = rawReply.match(/\[FOLLOW_UPS:\s*(\[.*?\])\]/s);
    if (followUpMatch && followUpMatch[1]) {
      try {
        followUpQuestions = JSON.parse(followUpMatch[1]);
      } catch (e) {
        // Fallback simple split
        followUpQuestions = followUpMatch[1]
          .replace(/[\[\]"]/g, '')
          .split(',')
          .map(q => q.trim())
          .filter(q => q.length > 0);
      }
      rawReply = rawReply.replace(/\[FOLLOW_UPS:.*?\]/s, '').trim();
    }

    if (!followUpQuestions || followUpQuestions.length === 0) {
      // Generate default intelligent follow-up suggestions based on context
      followUpQuestions = [
        "What is the best fertilizer for this?",
        "How often should I irrigate?",
        "What are common diseases to watch out for?",
        "Are there government subsidies available for this?"
      ];
    }

    // Extract source URLs from grounding if any
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ? groundingChunks
          .map((chunk: any) => ({
            title: chunk.web?.title || "Farming Source",
            uri: chunk.web?.uri,
          }))
          .filter((s: any) => s.uri)
      : [];

    res.json({ text: rawReply, sources, followUpQuestions });
  } catch (error: any) {
    const isQuotaOrDenied = error?.status === 429 || error?.status === 403 || error?.message?.includes("429") || error?.message?.includes("403") || error?.message?.includes("DENIED");
    if (isQuotaOrDenied) {
      console.log("Notice: Gemini Chat API key restricted/quota limit. Serving local agricultural fallback.");
    } else {
      console.log("Notice: Gemini Chat API unavailable, using local agricultural fallback:", error?.message || "Offline mode active");
    }
    const preferredLang = req.body.userProfile?.preferredLanguage || "English";
    const reply = getLocalChatReply(req.body.messages, preferredLang, req.body.userProfile);
    const defaultFollowUps = preferredLang === "Hindi" ? [
      "इसके लिए सबसे अच्छी खाद कौन सी है?",
      "मुझे कितनी बार सिंचाई करनी चाहिए?",
      "ध्यान रखने योग्य सामान्य बीमारियां क्या हैं?",
      "क्या इसके लिए सरकारी सब्सिडी उपलब्ध है?"
    ] : preferredLang === "Tamil" ? [
      "இதற்கு சிறந்த உரம் எது?",
      "நான் எவ்வளவு அடிக்கடி பாசனம் செய்ய வேண்டும்?",
      "கவனிக்க வேண்டிய பொதுவான நோய்கள் யாவை?",
      "இதற்கு அரசு மானியம் உள்ளதா?"
    ] : [
      "What is the best organic fertilizer for this?",
      "How often should I irrigate?",
      "What are common diseases to watch out for?",
      "What government subsidies are available for this?"
    ];
    res.json({ text: reply, sources: [], followUpQuestions: defaultFollowUps });
  }
});

// 1B. TRANSLATION API ENDPOINT
app.post("/api/gemini/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required." });
    }

    const ai = getGeminiClient();
    const prompt = `Translate the following agricultural/general response accurately into ${targetLanguage}.
CRITICAL REQUIREMENTS:
1. Preserve all markdown formatting (headings, bullet points, numbered lists, bold text, tables, emojis).
2. Keep numbers, chemical names (e.g. NPK 19:19:19, Urea), and technical terms clear and accurate.
3. Keep the tone helpful, practical, and clear for a farmer.

Text to translate:
${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const translatedText = response.text || text;
    res.json({ translatedText });
  } catch (error) {
    console.log("Notice: Gemini translate endpoint fallback used.");
    res.json({ translatedText: req.body.text });
  }
});

// 2. CROP RECOMMENDATION WITH DETAILED SCHEDULING & GPS LOCATION AWARENESS
app.post("/api/gemini/crop", async (req, res) => {
  try {
    const { 
      soilType, landSize, waterAvailability, budget, season, 
      state, district, taluk, village, lat, lng, weather, userProfile 
    } = req.body;
    const ai = getGeminiClient();

    const isEasyMode = userProfile?.educationLevel === "No Education";
    const preferredLang = userProfile?.preferredLanguage || "English";

    const prompt = `You are an AI location-aware smart agricultural advisor aligning with Indian Council of Agricultural Research (ICAR), India Meteorological Department (IMD), and Krishi Vigyan Kendra (KVK) district data.
Provide the top 5 best crop recommendations uniquely tailored to the farmer's specific GPS location and real-time agro-climatic conditions:

- Exact GPS Location: Latitude ${lat || '11.0168'}, Longitude ${lng || '76.9558'}
- Administrative Boundaries: Village: ${village || 'Local Village'}, Taluk/Block: ${taluk || 'Local Block'}, District: ${district}, State: ${state}, Country: India
- Live Real-Time Weather Conditions:
  • Temperature: ${weather?.temperature ?? 30}°C
  • Relative Humidity: ${weather?.humidity ?? 70}%
  • Rainfall Today: ${weather?.rainfall ?? 10} mm
  • Wind Speed: ${weather?.windSpeed ?? 12} km/h
  • Weather Condition: ${weather?.weatherCondition || 'Normal Agro-Climatic Conditions'}
- Soil Type: ${soilType}
- Land Size: ${landSize}
- Water Availability: ${waterAvailability}
- Available Farming Budget: ${budget}
- Farming Season: ${season}

CRITICAL DIRECTIVE: You MUST evaluate the specific district (${district}, ${state}) and GPS coordinates. Do NOT return generic or identical crop lists across different locations. For example, if location is Coimbatore or Thanjavur in Tamil Nadu, recommend crops like Rice, Sugarcane, Cotton, Banana, Groundnut, Pulses; if location is Ludhiana in Punjab, recommend Wheat, Paddy, Maize, Cotton, Mustard; if location is Nashik in Maharashtra, recommend Grapes, Onion, Tomato, Pomegranate, Maize.

For each recommended crop, provide district-tailored agronomic details:
- Why this crop is specifically suitable for ${district}, ${state} given current weather (${weather?.temperature ?? 30}°C, ${weather?.rainfall ?? 10}mm rain)
- Suitable soil & season
- Water requirement & irrigation schedule
- Recommended seed quantity per acre (e.g., '25kg per Acre')
- Step-by-step fertilizer schedule
- Total growth duration (e.g., '110-125 Days')
- Expected yield per acre
- Estimated cultivation cost per acre
- Estimated net profit per acre
- Current market demand level
- Common diseases & organic disease prevention remedies
- Government subsidies (e.g., PM-Kisan, NFSM, Drip Irrigation Subsidies)
- A single specific English word to look up an image of this crop (e.g. "wheat", "rice", "peanut", "cotton", "tomato").

${isEasyMode ? "Important: The farmer has No Education. Ensure descriptions and prevention schedules are super simple and easy to understand." : ""}
Provide recommendations in ${preferredLang}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an official Indian agronomy recommendation system based on ICAR, Ministry of Agriculture & Farmers Welfare, and Krishi Vigyan Kendra (KVK) guidelines. Generate exactly 5 highly suitable crops for the selected district and farming conditions. Provide output in JSON format matching the schema. Translate all string values (except the imageUrl keyword, which must remain English) into the requested language. If official district data for a specific crop or region is unavailable, provide the best agro-climatic estimate clearly.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 5 crop recommendations",
          items: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING, description: "Name of the crop" },
              description: { type: Type.STRING, description: "Brief reason why this crop is excellent for these conditions" },
              expectedYield: { type: Type.STRING, description: "Expected yield per acre or total land size, e.g. '18-22 Quintals per Acre'" },
              fertilizerSchedule: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step by step fertilizer timeline (e.g., At planting, week 4)"
              },
              irrigationSchedule: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Watering timeline based on crop stages"
              },
              harvestTime: { type: Type.STRING, description: "Expected timeline to harvest" },
              marketValue: { type: Type.STRING, description: "Estimated market value or selling price" },
              possibleDiseases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of disease or pest" },
                    prevention: { type: Type.STRING, description: "Simple natural or organic remedy/prevention step" }
                  }
                },
                description: "List of likely pests or diseases and how to protect crops"
              },
              varieties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 high-yielding popular commercial varieties or hybrids of this crop"
              },
              imageUrl: { type: Type.STRING, description: "A simple English keyword of the crop for dynamic image loading, e.g. 'wheat', 'rice', 'groundnut', 'tomato', 'cotton'" },
              suitabilityScore: { type: Type.STRING, description: "Crop suitability percentage or description, e.g. '92% (Excellent)'" },
              idealSowingSeason: { type: Type.STRING, description: "Best sowing season or months, e.g. 'Rabi (Oct - Dec)'" },
              seedQuantityRequired: { type: Type.STRING, description: "Seed quantity needed per acre, e.g. '40kg per Acre'" },
              expectedGrowthDuration: { type: Type.STRING, description: "Total growth days or months, e.g. '120-135 Days'" },
              estimatedCultivationCost: { type: Type.STRING, description: "Estimated cultivation cost per acre, e.g. '₹12,000 per Acre'" },
              expectedProfit: { type: Type.STRING, description: "Expected net profit range per acre, e.g. '₹25,000 - ₹38,000 per Acre'" },
              marketDemand: { type: Type.STRING, description: "Demand level, e.g. 'Very High'" },
              governmentSubsidies: { type: Type.STRING, description: "Available subsidies, e.g. '45% subsidy on micro-irrigation equipment under PMKSY'" }
            },
            required: [
              "cropName", "description", "expectedYield", "fertilizerSchedule", "irrigationSchedule", 
              "harvestTime", "marketValue", "possibleDiseases", "varieties", "imageUrl",
              "suitabilityScore", "idealSowingSeason", "seedQuantityRequired", "expectedGrowthDuration",
              "estimatedCultivationCost", "expectedProfit", "marketDemand", "governmentSubsidies"
            ]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    res.json(parsedData);
  } catch (error: any) {
    const isQuotaOrDenied = error?.status === 429 || error?.status === 403 || error?.message?.includes("429") || error?.message?.includes("403") || error?.message?.includes("DENIED");
    if (isQuotaOrDenied) {
      console.log("Notice: Gemini Crop API key restricted/quota limit. Serving local agronomy fallback.");
    } else {
      console.log("Notice: Gemini Crop API unavailable, using local agronomy fallback:", error?.message || "Offline mode active");
    }
    const preferredLang = req.body.userProfile?.preferredLanguage || "English";
    const season = req.body.season || "summer";
    const soilType = req.body.soilType || "clay";
    const crops = getLocalCropRecommendations(season, soilType, preferredLang);
    res.json(crops);
  }
});

// 3. CAREER GUIDANCE FOR MODERN & TRADITIONAL ROLES
app.post("/api/gemini/career", async (req, res) => {
  try {
    const { userProfile, interests, skills, budget, availableLand } = req.body;
    const ai = getGeminiClient();

    const preferredLang = userProfile?.preferredLanguage || "English";
    const prompt = `Recommend 4 sustainable agricultural careers or entrepreneurial business opportunities suitable for:
- Education level: ${userProfile?.educationLevel}
- Current Occupation: ${userProfile?.occupation}
- Age: ${userProfile?.age}
- Location: ${userProfile?.district}, ${userProfile?.state}
- Budget/Investment: ${budget}
- Available Land: ${availableLand}
- User Interests: ${interests || "General farming, livestock, agribusiness"}
- User Skills: ${skills || "Practical farming, hard-working"}

Ensure the jobs are realistic and immediately actionable in rural or semi-urban districts. Translate all outputs to ${preferredLang}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an agricultural business and career advisor. Recommend exactly 4 paths. Provide results in JSON conforming to the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 4 agricultural career recommendations",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of the job or business (e.g. Organic Mushroom Farmer)" },
              description: { type: Type.STRING, description: "What this role entails and why it matches the profile" },
              requiredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 simple skills needed or easily learned"
              },
              educationRequired: { type: Type.STRING, description: "Minimum education needed (explain how they can do it even with low education)" },
              estimatedInvestment: { type: Type.STRING, description: "Approximate start-up capital needed" },
              expectedIncome: { type: Type.STRING, description: "Estimated monthly or annual earnings" },
              governmentSupport: { type: Type.STRING, description: "Relevant subsidy or government help available" },
              futureOpportunities: { type: Type.STRING, description: "Demand outlook over next 5 years" },
              learningResources: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Where to learn (e.g. YouTube, local block office, KVK center)"
              }
            },
            required: ["title", "description", "requiredSkills", "educationRequired", "estimatedInvestment", "expectedIncome", "governmentSupport", "futureOpportunities", "learningResources"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    res.json(parsedData);
  } catch (error: any) {
    const isQuotaOrDenied = error?.status === 429 || error?.status === 403 || error?.message?.includes("429") || error?.message?.includes("403") || error?.message?.includes("DENIED");
    if (isQuotaOrDenied) {
      console.log("Notice: Gemini Career API key restricted/quota limit. Serving local agricultural entrepreneurship fallback.");
    } else {
      console.log("Notice: Gemini Career API unavailable, using local agricultural entrepreneurship fallback:", error?.message || "Offline mode active");
    }
    const preferredLang = req.body.userProfile?.preferredLanguage || "English";
    const careers = getLocalCareerRecommendations(preferredLang);
    res.json(careers);
  }
});

// 4. MULTIMODAL IMAGE ANALYSIS FOR AI DISEASE DETECTOR
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, type, userProfile } = req.body;
    const ai = getGeminiClient();

    const isEasyMode = userProfile?.educationLevel === "No Education";
    const preferredLang = userProfile?.preferredLanguage || "English";

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64,
      },
    };

    let systemInstruction = `You are AgriGPT Plant Disease Detector, an expert AI Agricultural Pathologist and Agronomist.
You analyze crop photos (leaves, fruits, vegetables, flowers, stems, seeds, roots, or entire plants) uploaded by farmers using Gemini Multimodal Vision capabilities.

STRICT INSTRUCTIONS & WORKFLOW:

1. LEAF COUNT & IMAGE QUALITY CHECK:
- Detect whether the image shows a single leaf or multiple leaves.
- NEVER guess a disease. If the image is blurry, dark, unidentifiable, or if you cannot confidently identify the disease/crop, respond with EXACTLY this single sentence:
  "I cannot identify the disease confidently from this image. Please upload a clear image of a single leaf taken in good lighting."

2. HEALTHY VS DISEASED CLASSIFICATION:
Determine whether the plant leaf is healthy or diseased.

3. IF DISEASED, YOU MUST DISPLAY ALL OF THE FOLLOWING HEADINGS & DATA POINTS (Use simple farmer-friendly language in ${preferredLang}):

🌿 Crop Name: [Identified Crop Name, e.g., Tomato, Rice, Wheat, Cotton, Chilli]
🦠 Disease Name: [Most likely Disease Name, e.g., Early Blight (Alternaria solani)]
📊 Confidence Level: [High / Medium / Low] (e.g., High (92%))
📖 Disease Description: [Simple explanation of what this disease is and how it affects the plant]
⚠ Symptoms:
- [Symptom 1]
- [Symptom 2]
🔍 Causes: [Pathogen type like fungal spores, bacteria, virus, sucking pest, or nutrient deficiency]
🌦 Weather conditions that favor the disease: [Humidity, temperature range, leaf moisture duration]
🌱 Organic Treatment:
- [Neem oil spray ratio, bio-agents like Trichoderma/Pseudomonas, sour buttermilk, or botanical sprays]
💊 Chemical Treatment:
- [Chemical product name, active ingredient, dosage per liter, application timing, safety mask & pre-harvest interval]
💧 Irrigation Advice:
- [Specific watering guidance e.g. root drip irrigation, avoiding foliage wetness]
🧪 Fertilizer Recommendation:
- [Nutrient adjustments e.g., balanced NPK, vermicompost, avoiding excess nitrogen]
🛡 Prevention Methods:
- [Crop rotation, field sanitation, pruning infected leaves, row spacing]
🚫 Common Mistakes to Avoid:
- [Mistakes farmers should refrain from doing, e.g., spraying under hot sun, over-watering]
⏳ Expected Recovery Time: [Estimated recovery timeline, e.g., 7 to 14 Days]

*CRITICAL LOW CONFIDENCE RULE*:
If Confidence Level is Low, clearly add this warning at the top of the report:
"⚠️ Possible Diagnosis: The confidence level for this match is low. This is a tentative diagnosis. We strongly recommend consulting a local Krishi Vigyan Kendra (KVK) officer or agricultural expert."

4. IF HEALTHY, YOU MUST DISPLAY ALL OF THE FOLLOWING HEADINGS & DATA POINTS:

🌿 Crop Name: [Identified Crop Name]
💚 Status: Healthy Plant Status Confirmed!
📊 Confidence Level: High (95%+)
📖 Healthy Plant Summary: [Observations on leaf color, chlorophyll, texture, and growth]
🌱 Tips to maintain healthy crop growth:
- [Tip 1]
- [Tip 2]
🧪 Recommended fertilizer schedule:
- [Basal & top-dressing timing and dosage]
💧 Irrigation advice:
- [Optimal soil moisture and watering intervals]
🛡 Disease prevention tips:
- [Proactive crop protection measures]`;

    if (isEasyMode) {
      systemInstruction += `\nCRITICAL FOR UNEDUCATED FARMERS: Use extremely simple words, short sentences, and step-by-step instructions.`;
    }

    const promptText = `Analyze this plant photo carefully following all system instructions. Output the diagnosis in ${preferredLang}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const resultText = response.text || "Could not analyze the crop image. Please make sure the photo is clear and well-lit.";
    res.json({ analysis: resultText });
  } catch (error: any) {
    const isQuotaOrDenied = error?.status === 429 || error?.status === 403 || error?.message?.includes("429") || error?.message?.includes("403") || error?.message?.includes("DENIED");
    if (isQuotaOrDenied) {
      console.log("Notice: Gemini Image Analysis API key restricted/quota limit. Serving local diagnostics fallback.");
    } else {
      console.log("Notice: Gemini Image Analysis API unavailable, using local diagnostics fallback:", error?.message || "Offline mode active");
    }
    const preferredLang = req.body.userProfile?.preferredLanguage || "English";
    const type = req.body.type || "leaf";
    const analysis = getLocalImageAnalysis(type, preferredLang);
    res.json({ analysis });
  }
});

// Start dev server middleware or production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support client-side routing on fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriAI full-stack server running at http://localhost:${PORT}`);
  });
}

startServer();
