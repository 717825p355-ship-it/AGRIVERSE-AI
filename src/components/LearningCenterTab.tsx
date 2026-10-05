import React, { useState } from 'react';
import { UserProfile, LearningLesson, QuizQuestion, RecentActivity } from '../types';
import { 
  BookOpen, Play, CheckCircle, ArrowRight, ArrowLeft, 
  HelpCircle, RotateCcw, Award, Check, X, Search,
  Bot, Download, Sparkles, AlertTriangle, Lightbulb,
  Droplets, Sprout, ShieldAlert, Cpu, DollarSign, Building2,
  Tractor, Package, Milk, TestTube, FileText
} from 'lucide-react';
import voiceController from '../lib/voice';

interface LearningCenterTabProps {
  userProfile: UserProfile;
  isEasyMode: boolean;
  onNavigateToChat?: (initialMessage?: string) => void;
  onLogActivity?: (activity: RecentActivity) => void;
}

// 12 Agriculture Learning Categories
const LEARNING_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: BookOpen, count: 12 },
  { id: 'soil', name: 'Soil Health & Management', icon: Sprout, count: 1 },
  { id: 'water', name: 'Water & Irrigation Systems', icon: Droplets, count: 1 },
  { id: 'organic', name: 'Organic Farming Practices', icon: Sprout, count: 1 },
  { id: 'fertilizer', name: 'Fertilizer & Nutrient Guide', icon: TestTube, count: 1 },
  { id: 'crop', name: 'Crop Cultivation Guides', icon: Sprout, count: 1 },
  { id: 'pest', name: 'Pest & Disease Control', icon: ShieldAlert, count: 1 },
  { id: 'livestock', name: 'Livestock & Dairy Farming', icon: Milk, count: 1 },
  { id: 'storage', name: 'Post-Harvest & Storage', icon: Package, count: 1 },
  { id: 'machinery', name: 'Farm Machinery & Automation', icon: Tractor, count: 1 },
  { id: 'business', name: 'Agriculture Business & Finance', icon: DollarSign, count: 1 },
  { id: 'schemes', name: 'Government Schemes & Subsidies', icon: Building2, count: 1 },
  { id: 'smart', name: 'Smart & Precision Farming', icon: Cpu, count: 1 },
];

const COMPREHENSIVE_LESSONS: LearningLesson[] = [
  {
    id: 'lesson-1',
    title: 'Soil Health & Management Masterclass',
    category: 'Soil Health & Management',
    difficulty: 'Beginner',
    description: 'Learn how to test soil pH, loosen compacted earth, incorporate green manure, and build fertile organic humus.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Test Soil pH & Texture',
        description: 'Take soil samples from 5 different spots in your field at 6 inches depth. Test using a pH meter or litmus kit. Ideal pH for most crops is 6.0 - 7.5.',
        audioInstruction: 'Take soil from 5 spots in your field. Test pH. Aim for 6 to 7 for healthy crops.'
      },
      {
        title: 'Step 2: Deep Plowing & Aeration',
        description: 'Plow the field to 15-20 cm depth to break hard subsoil crusts. This enables plant roots to access oxygen and prevents waterlogging.',
        audioInstruction: 'Plow 20 cm deep to loosen hard dirt so air reaches plant roots.'
      },
      {
        title: 'Step 3: Incorporate Organic Compost & Bio-fertilizer',
        description: 'Add 4-5 tons of well-composted cow dung or vermicompost per acre along with Azotobacter and PSB bio-fertilizers.',
        audioInstruction: 'Mix cow dung compost and bio-fertilizer into the soil before sowing.'
      },
      {
        title: 'Step 4: Green Manuring with Dhaincha',
        description: 'Sow Sesbania (Dhaincha) during pre-monsoon and plow it back into the soil after 45 days. Adds 30kg natural nitrogen per acre.',
        audioInstruction: 'Sow green Dhaincha plants and plow them into the dirt to add natural nitrogen.'
      }
    ],
    quiz: [
      {
        question: 'What is the ideal soil pH range for most agricultural crops?',
        options: ['2.0 - 4.0 (Highly Acidic)', '6.0 - 7.5 (Slightly Acidic to Neutral)', '9.0 - 11.0 (Highly Alkaline)', '14.0 (Pure Base)'],
        correctAnswerIndex: 1,
        explanation: 'A pH between 6.0 and 7.5 provides optimum availability of essential macro and micronutrients.'
      },
      {
        question: 'How does green manuring with Dhaincha benefit soil?',
        options: ['Adds heavy plastic residue', 'Fixes atmospheric nitrogen and adds organic matter', 'Dries out soil completely', 'Prevents seeds from germinating'],
        correctAnswerIndex: 1,
        explanation: 'Leguminous green manures decompose quickly, enriching soil with organic carbon and nitrogen.'
      }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Precision Water & Drip Irrigation Systems',
    category: 'Water & Irrigation Systems',
    difficulty: 'Intermediate',
    description: 'Master micro-drip emitters, discharge rate calibration, fertigation integration, and sensor-based watering.',
    imageUrl: 'https://images.unsplash.com/photo-1463123081488-729f60c3c527?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Install Drip Lines & Filters',
        description: 'Connect main PVC lines to a sand disc filter unit. Lay lateral dripper tubes along crop rows at 30-50 cm spacing.',
        audioInstruction: 'Lay plastic drip tubes along crop rows. Connect water filters to keep tubes from clogging.'
      },
      {
        title: 'Step 2: Calibrate Dripper Discharge Rate',
        description: 'Ensure each dripper emits 2 to 4 Liters per Hour (LPH). Check pressure gauges to maintain 1.5 kg/cm2 uniform flow.',
        audioInstruction: 'Check water pressure so every drop feeds plant roots equally.'
      },
      {
        title: 'Step 3: Fertigation (Liquid Fertilizer Injection)',
        description: 'Inject water-soluble NPK fertilizers (19:19:19) directly into the drip line via a venturi injector for 95% nutrient absorption.',
        audioInstruction: 'Mix liquid food into drip water so fertilizers go directly to the roots.'
      }
    ],
    quiz: [
      {
        question: 'Why is fertigation through drip irrigation more effective than broadcasting dry fertilizer?',
        options: ['It wastes 90% water', 'It delivers nutrients directly to root zones with minimal leaching', 'It requires manual digging for every plant', 'It turns water into salt'],
        correctAnswerIndex: 1,
        explanation: 'Fertigation delivers water-soluble nutrients precisely where active roots absorb them, saving up to 40% fertilizer cost.'
      }
    ]
  },
  {
    id: 'lesson-3',
    title: 'Zero-Budget Organic Farming (ZBNF)',
    category: 'Organic Farming Practices',
    difficulty: 'Beginner',
    description: 'Prepare Jeevamrutha, Beejamrutha seed coatings, Neemastra biopesticide, and multi-crop intercropping.',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Prepare Liquid Jeevamrutha Bio-Enhancer',
        description: 'Mix 10kg fresh cow dung, 10L cow urine, 2kg jaggery, 2kg pulse flour, and 200L water. Ferment for 48 hours and apply near root zones.',
        audioInstruction: 'Mix cow dung, urine, jaggery, and pulse flour in water. Ferment 2 days for rich bio-fertilizer.'
      },
      {
        title: 'Step 2: Beejamrutha Seed Treatment',
        description: 'Coat raw seeds with a paste of local cow dung, lime, and cow urine to prevent seed-borne fungal infections.',
        audioInstruction: 'Coat seeds with cow dung paste before planting to protect them from disease.'
      },
      {
        title: 'Step 3: Multi-Crop Intercropping',
        description: 'Plant legumes (beans/gram) alongside tall cereal crops (corn/cotton). Legumes fix nitrogen while cereals provide structural shade.',
        audioInstruction: 'Plant beans between corn rows. Beans feed the soil with nitrogen.'
      }
    ],
    quiz: [
      {
        question: 'Which natural ingredient provides beneficial microbial colonies in Jeevamrutha?',
        options: ['Fresh indigenous cow dung & urine', 'Synthetic pesticides', 'Chemical urea', 'Refined sugar'],
        correctAnswerIndex: 0,
        explanation: 'Desi cow dung contains millions of beneficial soil bacteria and mycorrhizal fungi that accelerate nutrient cycling.'
      }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Balanced Fertilizer & NPK Management',
    category: 'Fertilizer & Nutrient Guide',
    difficulty: 'Intermediate',
    description: 'Learn the exact functions of Nitrogen (N), Phosphorus (P), and Potassium (K) and calculate split dosage schedules.',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Basal Application at Sowing',
        description: 'Apply 100% Phosphorus (DAP) and 50% Potassium (MOP) as basal dose during land preparation.',
        audioInstruction: 'Put DAP and half your potash in the dirt right when planting seeds.'
      },
      {
        title: 'Step 2: Split Nitrogen Top-Dressing',
        description: 'Never apply all Urea at once! Divide Urea into 3 split doses: 25% at tillering, 50% at vegetative growth, and 25% at flowering.',
        audioInstruction: 'Give urea in 3 small doses as the crop grows, not all at once.'
      },
      {
        title: 'Step 3: Micronutrient Foliar Spray',
        description: 'Spray Zinc Sulphate (0.5%) and Boron (0.2%) during early vegetative growth to prevent leaf yellowing and blossom drop.',
        audioInstruction: 'Spray Zinc and Boron on leaves to make flowers stay strong and fruits grow big.'
      }
    ],
    quiz: [
      {
        question: 'Why should Urea (Nitrogen) be applied in split doses rather than all at once?',
        options: ['To prevent nitrogen volatilization and leaching losses in rainwater', 'To make soil completely dry', 'To change crop color to blue', 'Urea cannot be split'],
        correctAnswerIndex: 0,
        explanation: 'Nitrogen washes away easily with water or converts into ammonia gas if applied in excessive single amounts.'
      }
    ]
  },
  {
    id: 'lesson-5',
    title: 'High-Yield Rice & Paddy Cultivation',
    category: 'Crop Cultivation Guides',
    difficulty: 'Beginner',
    description: 'SRI (System of Rice Intensification) technique, nursery bed management, transplanting, and panicle health.',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Mat Nursery Preparation',
        description: 'Prepare raised mat beds with rich compost. Sow 10-12 kg sprouted seeds per acre. Seedlings are ready in 12-14 days.',
        audioInstruction: 'Grow young rice seedlings in raised soil beds for 12 days.'
      },
      {
        title: 'Step 2: Single-Seedling Square Transplanting (SRI)',
        description: 'Transplant single young seedlings at 25x25 cm wider square spacing rather than dense bunches.',
        audioInstruction: 'Plant single seedlings 25 cm apart in clean straight lines.'
      },
      {
        title: 'Step 3: Alternate Wetting and Drying (AWD)',
        description: 'Do not keep fields continuously flooded! Allow soil to dry slightly until fine cracks appear before re-irrigating. Saves 30% water.',
        audioInstruction: 'Let the field dry slightly between waterings to grow deeper roots.'
      }
    ],
    quiz: [
      {
        question: 'What is a major advantage of the System of Rice Intensification (SRI)?',
        options: ['Requires 50% more seeds', 'Higher tiller production, deeper roots, and 30% water savings', 'Works only in desert sand', 'Destroys crop yield'],
        correctAnswerIndex: 1,
        explanation: 'Wider spacing and single young seedlings encourage massive root proliferation and stronger tillers.'
      }
    ]
  },
  {
    id: 'lesson-6',
    title: 'Integrated Pest & Disease Management (IPM)',
    category: 'Pest & Disease Control',
    difficulty: 'Intermediate',
    description: 'Pheromone traps, yellow sticky cards, biological parasitoids (Trichogramma), and economic threshold limits.',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Deploy Pheromone & Light Traps',
        description: 'Install 5 funnel pheromone traps per acre to monitor bollworm/stem borer moths. Traps break mating cycles.',
        audioInstruction: 'Hang 5 moth traps in your field to catch male pests before they multiply.'
      },
      {
        title: 'Step 2: Yellow Sticky Card Installation',
        description: 'Place bright yellow plastic cards coated with grease 1 foot above crop height to trap sap-sucking whiteflies and thrips.',
        audioInstruction: 'Hang yellow sticky cards above crop tops to catch small flying insects.'
      },
      {
        title: 'Step 3: Biological Release of Trichogramma Cards',
        description: 'Tie Trichogramma egg parasitoid cards onto leaf undersides. Tiny beneficial wasps hatch and destroy pest eggs naturally.',
        audioInstruction: 'Tie friendly wasp cards under leaves to destroy pest eggs naturally.'
      }
    ],
    quiz: [
      {
        question: 'What color sticky traps are most effective for capturing sap-sucking whiteflies and aphids?',
        options: ['Black', 'Bright Yellow', 'Dark Brown', 'Transparent'],
        correctAnswerIndex: 1,
        explanation: 'Yellow wavelengths naturally attract flying sucking pests like whiteflies, jassids, and aphids.'
      }
    ]
  },
  {
    id: 'lesson-7',
    title: 'Modern Dairy Farming & Breed Care',
    category: 'Livestock & Dairy Farming',
    difficulty: 'Beginner',
    description: 'Gir/Sahiwal indigenous cow management, green fodder silaging, automated milking, and mastitis prevention.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Hygienic Shed Design',
        description: 'Build well-ventilated, non-slippery sloped sheds with dedicated drinking water troughs. Ensures clean milk production.',
        audioInstruction: 'Build clean, airy cow sheds with fresh running water troughs.'
      },
      {
        title: 'Step 2: Balanced Total Mixed Ration (TMR)',
        description: 'Feed 60% green fodder (Napier grass/Maize), 20% dry fodder (straw), and 20% cattle feed concentrate enriched with mineral mixture.',
        audioInstruction: 'Feed cows a mix of green grass, dry straw, and mineral grain feed.'
      },
      {
        title: 'Step 3: Mastitis Prevention & Teat Dipping',
        description: 'Dip cow teats in 0.5% iodine solution immediately after milking to prevent bacterial udder infections.',
        audioInstruction: 'Clean cow teats with disinfectant right after milking to stop diseases.'
      }
    ],
    quiz: [
      {
        question: 'Why is post-milking teat dipping recommended in dairy herds?',
        options: ['To change milk taste', 'To prevent bacterial entrance into teat canals and stop mastitis', 'To make cows sleep faster', 'To increase hair growth'],
        correctAnswerIndex: 1,
        explanation: 'Teat sphincter muscles remain open for 30 minutes after milking; disinfectant dips seal the entrance against environmental pathogens.'
      }
    ]
  },
  {
    id: 'lesson-8',
    title: 'Post-Harvest Grain & Fruit Storage',
    category: 'Post-Harvest & Storage',
    difficulty: 'Beginner',
    description: 'Moisture testing before bagging, hermetic bags (PICS), solar drying, and cold storage temperature controls.',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Sun-Drying Grains to Safe Moisture Level',
        description: 'Sun-dry harvested paddy/wheat until grain moisture drops below 12%. High moisture causes fungal mold and storage rot.',
        audioInstruction: 'Dry grains thoroughly in the sun until moisture is below 12% before storing.'
      },
      {
        title: 'Step 2: Hermetic Storage in Triple-Layer PICS Bags',
        description: 'Store dry grains in airtight hermetic PICS bags. Oxygen drops rapidly, suffocating all weevils and insects without chemicals.',
        audioInstruction: 'Store grains in sealed airtight PICS bags. Insects suffocate without oxygen.'
      }
    ],
    quiz: [
      {
        question: 'What is the maximum safe moisture percentage for long-term grain storage?',
        options: ['25% - 30%', 'Below 12%', '50%', '80%'],
        correctAnswerIndex: 1,
        explanation: 'Grains stored above 12-14% moisture heat up, attract storage weevils, and grow toxic aflatoxin molds.'
      }
    ]
  },
  {
    id: 'lesson-9',
    title: 'Farm Machinery Operation & Maintenance',
    category: 'Farm Machinery & Automation',
    difficulty: 'Intermediate',
    description: 'Power tiller maintenance, tractor PTO shaft safety, laser land levelers, and drone spraying setups.',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Pre-Start Engine Oil & Air Filter Check',
        description: 'Check tractor engine oil level and clean the air filter bowl every morning before entering dusty fields.',
        audioInstruction: 'Check tractor oil level and clean dusty air filters every morning.'
      },
      {
        title: 'Step 2: Laser Guided Land Leveling',
        description: 'Attach a laser transmitter to level fields to a 0.5% slope. Saves 25% irrigation water and increases crop uniformity.',
        audioInstruction: 'Use laser land leveler machines to make fields perfectly flat.'
      }
    ],
    quiz: [
      {
        question: 'How does laser land leveling help farmers?',
        options: ['Increases diesel usage', 'Provides uniform field flatness, saving 25% irrigation water', 'Reduces seed germination', 'Turns soil into concrete'],
        correctAnswerIndex: 1,
        explanation: 'Precision laser-guided leveling eliminates high and low spots, ensuring uniform water coverage across the whole field.'
      }
    ]
  },
  {
    id: 'lesson-10',
    title: 'Agri-Business Financial Planning & FPO Formation',
    category: 'Agriculture Business & Finance',
    difficulty: 'Advanced',
    description: 'Farmer Producer Organization (FPO) registration, working capital management, direct-to-consumer sales, and crop insurance.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Form a Farmer Producer Organization (FPO)',
        description: 'Unite 100-300 local smallholders into an FPO company. Bulk purchase fertilizers at wholesale and negotiate better crop selling rates.',
        audioInstruction: 'Join 100 neighborhood farmers into an FPO group to buy supplies cheaper and sell crops higher.'
      },
      {
        title: 'Step 2: PM Fasal Bima Yojana (Crop Insurance)',
        description: 'Insure crops for 1.5% premium (Rabi) or 2.0% (Kharif) to protect against droughts, floods, and unseasonal hail.',
        audioInstruction: 'Insure your crops under government insurance to get money back if weather destroys fields.'
      }
    ],
    quiz: [
      {
        question: 'What is a primary benefit of forming a Farmer Producer Organization (FPO)?',
        options: ['Increases middleman commission', 'Gives small farmers collective bargaining power to buy cheap and sell higher', 'Bans farm machinery', 'Restricts market access'],
        correctAnswerIndex: 1,
        explanation: 'FPOs pool output, enabling small farmers to sell direct to retail processors and bypass commission agents.'
      }
    ]
  },
  {
    id: 'lesson-11',
    title: 'Government Subsidies & PM-KISAN Portal Guide',
    category: 'Government Schemes & Subsidies',
    difficulty: 'Beginner',
    description: 'Step-by-step application process for PM-KISAN, KCC (Kisan Credit Card), PMKSY drip subsidy, and Sub-Mission on Ag Mechanization.',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Kisan Credit Card (KCC) Low-Interest Loan',
        description: 'Apply at local public bank with land patta documents. Get crop credit up to ₹3 Lakh at 4% effective interest rate with prompt repayment.',
        audioInstruction: 'Apply for Kisan Credit Card at bank to get low 4% interest crop loans.'
      },
      {
        title: 'Step 2: PMKSY 80% Drip Irrigation Subsidy',
        description: 'Submit land records to District Horticulture Officer to claim 50% - 80% subsidy on drip and sprinkler installations.',
        audioInstruction: 'Apply at horticulture office to get 80% government subsidy on drip irrigation sets.'
      }
    ],
    quiz: [
      {
        question: 'What is the effective interest rate on Kisan Credit Card (KCC) loans with prompt repayment incentive?',
        options: ['18%', '12%', '4%', '25%'],
        correctAnswerIndex: 2,
        explanation: 'Standard interest is 7%, but government provides a 3% prompt repayment subvention, reducing effective interest to 4%.'
      }
    ]
  },
  {
    id: 'lesson-12',
    title: 'Smart Farming with Drones & IoT Soil Sensors',
    category: 'Smart & Precision Farming',
    difficulty: 'Advanced',
    description: 'Drone liquid spraying, NPK soil sensor probes, satellite vegetation indexing (NDVI), and automated greenhouse controllers.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=60',
    steps: [
      {
        title: 'Step 1: Drone Spraying Calibration',
        description: 'Agricultural drones spray 10 acres in 30 minutes using 10 Liters water per acre. Reduces chemical exposure and saves 90% water.',
        audioInstruction: 'Agri drones spray 10 acres in 30 minutes using very little water.'
      },
      {
        title: 'Step 2: IoT Soil Moisture Probes',
        description: 'Insert wireless sensor probes at root depth. Probe sends live moisture alerts to your phone when fields need water.',
        audioInstruction: 'Put digital sensor probes in soil to get phone alerts when plants need water.'
      }
    ],
    quiz: [
      {
        question: 'What is a major advantage of using agriculture spraying drones over manual backpack sprayers?',
        options: ['Wastes 500 liters water', 'Sprays 10 acres in 30 minutes with 90% less water and zero human chemical exposure', 'Takes 10 days to spray 1 acre', 'Cannot carry liquid'],
        correctAnswerIndex: 1,
        explanation: 'Drones utilize micro-atomizing nozzles to cover foliage evenly in minutes without farmers inhaling hazardous fumes.'
      }
    ]
  }
];

export default function LearningCenterTab({ 
  userProfile, 
  isEasyMode, 
  onNavigateToChat,
  onLogActivity
}: LearningCenterTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Quiz states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Filter lessons by category and search
  const filteredLessons = COMPREHENSIVE_LESSONS.filter(lesson => {
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSelectLesson = (lesson: LearningLesson) => {
    setSelectedLesson(lesson);
    setCurrentStepIdx(0);
    setShowQuiz(false);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);

    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        title: `Study Lesson: ${lesson.title}`,
        subtitle: `${lesson.category} • ${lesson.difficulty}`,
        type: 'learning',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tabTarget: 'learning'
      });
    }

    if (isEasyMode) {
      voiceController.speak(`Starting lesson: ${lesson.title}. Let us study step-by-step.`, userProfile.preferredLanguage);
    }
  };

  const handleNextStep = () => {
    if (!selectedLesson) return;
    if (currentStepIdx < selectedLesson.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (isEasyMode) {
        const stepAudio = selectedLesson.steps[nextIdx].audioInstruction || selectedLesson.steps[nextIdx].description;
        voiceController.speak(stepAudio, userProfile.preferredLanguage);
      }
    } else {
      setShowQuiz(true);
      if (isEasyMode) {
        voiceController.speak("You completed all study steps! Let's do a simple quiz to test your memory.", userProfile.preferredLanguage);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      if (isEasyMode) {
        const stepAudio = selectedLesson?.steps[prevIdx].audioInstruction || selectedLesson?.steps[prevIdx].description;
        voiceController.speak(stepAudio || '', userProfile.preferredLanguage);
      }
    }
  };

  const handleSpeakStep = () => {
    if (!selectedLesson) return;
    const step = selectedLesson.steps[currentStepIdx];
    const text = `Step ${currentStepIdx + 1}: ${step.title}. Instructions: ${step.audioInstruction || step.description}`;
    voiceController.speak(text, userProfile.preferredLanguage);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIdx(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (!selectedLesson || selectedAnswerIdx === null || isAnswerSubmitted) return;

    const question = selectedLesson.quiz[currentQuestionIdx];
    const isCorrect = selectedAnswerIdx === question.correctAnswerIndex;
    
    setIsAnswerSubmitted(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      voiceController.speakInstruction('quiz_correct', userProfile.preferredLanguage);
    } else {
      voiceController.speakInstruction('quiz_wrong', userProfile.preferredLanguage);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedLesson) return;
    if (currentQuestionIdx < selectedLesson.quiz.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      const isPerfect = quizScore + (selectedAnswerIdx === selectedLesson.quiz[currentQuestionIdx].correctAnswerIndex ? 1 : 0) === selectedLesson.quiz.length;
      const text = isPerfect 
        ? "Excellent job! You answered all questions correctly. You are now a certified master of this lesson."
        : `Quiz finished! You scored ${quizScore} out of ${selectedLesson.quiz.length}. Good effort!`;
      voiceController.speak(text, userProfile.preferredLanguage);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  const handleDownloadLessonNotes = () => {
    if (!selectedLesson) return;
    let notes = `🌾 **AGRIGPT LEARNING ACADEMY STUDY NOTES**\n`;
    notes += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    notes += `TOPIC: ${selectedLesson.title.toUpperCase()}\n`;
    notes += `CATEGORY: ${selectedLesson.category}\n`;
    notes += `DIFFICULTY: ${selectedLesson.difficulty}\n\n`;
    notes += `📖 OVERVIEW:\n${selectedLesson.description}\n\n`;
    notes += `📋 STEP-BY-STEP PRACTICAL GUIDE:\n`;
    selectedLesson.steps.forEach((step, idx) => {
      notes += `${idx + 1}. ${step.title}\n   ${step.description}\n`;
    });
    notes += `\n❓ QUIZ REVIEW QUESTIONS:\n`;
    selectedLesson.quiz.forEach((q, idx) => {
      notes += `Q${idx + 1}: ${q.question}\nCorrect Answer: ${q.options[q.correctAnswerIndex]}\nExplanation: ${q.explanation}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([notes], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `AgriGPT_Notes_${selectedLesson.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAskAITutor = () => {
    if (!selectedLesson) return;
    const prompt = `I am studying the lesson "${selectedLesson.title}" (${selectedLesson.category}). Please explain the key concepts simply, share 3 expert farming tips, and tell me how I can apply this on my farm.`;
    if (onNavigateToChat) {
      onNavigateToChat(prompt);
    } else {
      voiceController.speak(`Asking AI Tutor about ${selectedLesson.title}. Please open the AI Assistant Chatbot tab to view detailed tutor response.`, userProfile.preferredLanguage);
      alert(`💡 AI Tutor Query Ready:\n"${prompt}"\n\nPlease switch to the AI Assistant Chatbot tab to converse directly with your tutor!`);
    }
  };

  return (
    <div id="learning-center-container" className="space-y-6">
      
      {/* If no lesson is selected: Show Catalog & Search */}
      {!selectedLesson ? (
        <>
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5.5 h-5.5 text-emerald-600" /> Agriculture Learning Center & Academy
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Explore 12 interactive agricultural categories, master step-by-step farming guides, listen to audio instructions, consult AI Tutors, and test your knowledge with quizzes.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 12 Categories
                </span>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-learning-topics-input"
                type="text"
                placeholder="Search learning topics (e.g., drip, soil pH, organic neem, SRI paddy, drones)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LEARNING_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id || (cat.id !== 'all' && selectedCategory === cat.name);
              return (
                <button
                  id={`cat-filter-btn-${cat.id}`}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Grid list of lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <div
                id={`lesson-card-${lesson.id}`}
                key={lesson.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="relative">
                    <img
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300 referrer-policy-no"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {lesson.difficulty}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100 inline-block">
                      {lesson.category}
                    </span>
                    <h4 className="font-extrabold text-base text-gray-800 leading-tight group-hover:text-emerald-700 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/30">
                  <button
                    id={`start-lesson-btn-${lesson.id}`}
                    onClick={() => handleSelectLesson(lesson)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
                  >
                    Start Lesson Study <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredLessons.length === 0 && (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="font-bold text-gray-700 text-sm">No learning topics found matching "{searchQuery}"</h4>
                <p className="text-xs text-gray-400">Try clearing your search query or selecting "All Categories".</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Detailed Lesson View */
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-md overflow-hidden min-h-[520px] flex flex-col justify-between animate-fade-in">
          
          {/* Header Bar */}
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3">
            <button
              id="exit-lesson-btn"
              onClick={() => {
                setSelectedLesson(null);
                voiceController.stop();
              }}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-2 rounded-xl shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Lessons
            </button>

            <div className="flex items-center gap-2">
              <button
                id="ask-ai-tutor-btn"
                onClick={handleAskAITutor}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Bot className="w-4 h-4" /> Ask AI Tutor
              </button>

              <button
                id="download-notes-btn"
                onClick={handleDownloadLessonNotes}
                className="bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Notes (.txt)
              </button>
            </div>

            <div className="text-right w-full sm:w-auto">
              <span className="text-xs font-bold text-emerald-800 block">
                {selectedLesson.title}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">
                {!showQuiz 
                  ? `Step ${currentStepIdx + 1} of ${selectedLesson.steps.length}` 
                  : isQuizCompleted 
                  ? 'Quiz Completed' 
                  : `Question ${currentQuestionIdx + 1} of ${selectedLesson.quiz.length}`
                }
              </span>
            </div>
          </div>

          {/* Core Content Box */}
          <div className="p-6 flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full space-y-6">
            
            {/* 1. STUDY STEPS SCREEN */}
            {!showQuiz && (
              <div className="space-y-6 animate-fade-in">
                
                {selectedLesson.steps[currentStepIdx].imageUrl ? (
                  <img
                    src={selectedLesson.steps[currentStepIdx].imageUrl}
                    alt={selectedLesson.steps[currentStepIdx].title}
                    className="w-full h-52 object-cover rounded-2xl border border-emerald-100 shadow-sm"
                  />
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-sm border border-emerald-100">
                    <img
                      src={selectedLesson.imageUrl}
                      alt={selectedLesson.title}
                      className="w-full h-48 object-cover referrer-policy-no"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                      Step {currentStepIdx + 1} of {selectedLesson.steps.length}
                    </span>

                    <button
                      id="speak-step-instructions-btn"
                      onClick={handleSpeakStep}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Read Aloud
                    </button>
                  </div>

                  <h4 className="text-2xl font-black text-gray-800">
                    {selectedLesson.steps[currentStepIdx].title}
                  </h4>
                  
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {selectedLesson.steps[currentStepIdx].description}
                  </p>

                  {/* Easy Mode highlight box */}
                  {isEasyMode && selectedLesson.steps[currentStepIdx].audioInstruction && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-2.5">
                      <span className="text-xl shrink-0">📢</span>
                      <p className="text-xs font-bold text-amber-900 leading-relaxed">
                        {selectedLesson.steps[currentStepIdx].audioInstruction}
                      </p>
                    </div>
                  )}

                  {/* Pro Tip Box */}
                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl flex items-start gap-2.5">
                    <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                      <b>Expert Tip:</b> Always verify soil moisture and air humidity before executing field steps. Ask your AI Tutor if you need local dosage variations.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ACTIVE QUIZ SCREEN */}
            {showQuiz && !isQuizCompleted && (
              <div className="space-y-5 animate-fade-in">
                
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600 animate-pulse" /> Quiz Challenge: Question {currentQuestionIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-blue-800">
                    Score: {quizScore} / {selectedLesson.quiz.length}
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-gray-800 leading-snug">
                  {selectedLesson.quiz[currentQuestionIdx].question}
                </h4>

                {/* Options list */}
                <div className="space-y-2.5">
                  {selectedLesson.quiz[currentQuestionIdx].options.map((opt, i) => {
                    const isSelected = selectedAnswerIdx === i;
                    const isCorrect = i === selectedLesson.quiz[currentQuestionIdx].correctAnswerIndex;
                    
                    let btnClass = 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50';
                    if (isSelected) {
                      btnClass = 'border-blue-500 bg-blue-50/50 text-blue-900 ring-2 ring-blue-300 font-bold';
                    }
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'border-green-500 bg-green-50/60 text-green-900 font-bold';
                      } else if (isSelected) {
                        btnClass = 'border-red-500 bg-red-50/60 text-red-900 line-through';
                      } else {
                        btnClass = 'border-gray-100 bg-white text-gray-300 opacity-60';
                      }
                    }

                    return (
                      <button
                        id={`quiz-option-btn-${i}`}
                        key={i}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(i)}
                        className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && <Check className="w-4 h-4 text-green-600" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-red-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation notes */}
                {isAnswerSubmitted && (
                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 animate-fade-in space-y-1">
                    <h5 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Lesson Explanation:
                    </h5>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {selectedLesson.quiz[currentQuestionIdx].explanation}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* 3. QUIZ SCORECARD COMPLETED */}
            {showQuiz && isQuizCompleted && (
              <div className="text-center py-6 space-y-6 animate-fade-in">
                
                <div className="bg-emerald-100 text-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-gray-800">
                    {quizScore === selectedLesson.quiz.length ? 'Perfect Score!' : 'Great Effort!'}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    You finished the quiz for <b>{selectedLesson.title}</b>.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl max-w-xs mx-auto shadow-sm">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Quiz Grade</span>
                  <span className="text-4xl font-black text-emerald-700 block mt-1">
                    {quizScore} / {selectedLesson.quiz.length}
                  </span>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">
                    {quizScore === selectedLesson.quiz.length ? '100% correct! Master Farmer Certificate status achieved.' : 'Review study steps and retry to get 100%.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    id="retry-quiz-btn"
                    onClick={handleResetQuiz}
                    className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl px-4 py-3 border border-emerald-200 shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Quiz Again
                  </button>

                  <button
                    id="complete-lesson-btn"
                    onClick={() => {
                      setSelectedLesson(null);
                      voiceController.stop();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-4 py-3 shadow-sm transition-all"
                  >
                    Study Another Lesson
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Navigation Drawer */}
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            {!showQuiz ? (
              <>
                <button
                  id="study-prev-btn"
                  disabled={currentStepIdx === 0}
                  onClick={handlePrevStep}
                  className={`text-xs font-bold rounded-xl px-4 py-2.5 flex items-center gap-1.5 border transition-all ${
                    currentStepIdx === 0
                      ? 'text-gray-300 border-gray-100 bg-white cursor-not-allowed'
                      : 'text-emerald-700 border-emerald-200 bg-white hover:bg-emerald-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back Step
                </button>

                <button
                  id="study-next-btn"
                  onClick={handleNextStep}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                >
                  <span>{currentStepIdx === selectedLesson.steps.length - 1 ? 'Go to Quiz Challenge' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : !isQuizCompleted ? (
              <>
                <div className="text-xs text-gray-400 font-medium">
                  Select your answer to unlock the explanation.
                </div>

                <button
                  id="quiz-submit-next-btn"
                  disabled={selectedAnswerIdx === null}
                  onClick={isAnswerSubmitted ? handleNextQuestion : handleSubmitAnswer}
                  className={`font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-1.5 shadow-sm transition-all shrink-0 ${
                    selectedAnswerIdx === null
                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{isAnswerSubmitted ? 'Next Question / Result' : 'Lock Answer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full text-center text-xs text-gray-400 font-semibold">
                Study and complete quizzes to build your farming expertise!
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

