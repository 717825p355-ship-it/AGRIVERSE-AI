import { LearningLesson, GovtScheme, MarketPrice } from '../types';

export const INITIAL_LESSONS: LearningLesson[] = [
  {
    id: 'lesson-1',
    title: 'How to Prepare Your Land',
    category: 'Preparation',
    difficulty: 'Beginner',
    description: 'Learn how to clear, plow, and level your soil to create a perfect home for your crops.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    steps: [
      {
        title: 'Clear the Field',
        description: 'Remove all weeds, large stones, and old crop roots from the field. This prevents disease and makes plowing easier.',
        audioInstruction: 'Clean the ground. Remove weeds, stones, and old roots so your plants can grow easily.'
      },
      {
        title: 'Plow the Soil',
        description: 'Plow the soil to a depth of 15-20 cm. This loosens the soil, allows air to enter, and helps water flow smoothly to the roots.',
        audioInstruction: 'Plow the soil deep. This lets air inside and helps water reach plant roots easily.'
      },
      {
        title: 'Add Organic Compost',
        description: 'Mix cow manure or decomposed compost into the soil. This provides essential nutrients for the seeds.',
        audioInstruction: 'Add cow manure or dry compost to the soil. This makes the soil rich and strong for seeds.'
      },
      {
        title: 'Level the Land',
        description: 'Use a leveler to flatten the soil. This ensures water spreads evenly across the entire field without pooling.',
        audioInstruction: 'Level the soil. Make it flat so water spreads evenly and does not collect in one place.'
      }
    ],
    quiz: [
      {
        question: 'Why do we plow the soil?',
        options: [
          'To make the soil compact and hard',
          'To loosen the soil, let air in, and help water flow',
          'To dye the soil a different color',
          'To get rid of water'
        ],
        correctAnswerIndex: 1,
        explanation: 'Plowing loosens the soil. This allows oxygen to reach plant roots and improves water absorption.'
      },
      {
        question: 'What should we add to the soil during preparation for nutrients?',
        options: [
          'Sand only',
          'Plastics',
          'Organic compost or cow manure',
          'Salt'
        ],
        correctAnswerIndex: 2,
        explanation: 'Organic compost or cow manure adds natural nutrients and helpful microbes to the soil.'
      }
    ]
  },
  {
    id: 'lesson-2',
    title: 'How to Sow Seeds Properly',
    category: 'Sowing',
    difficulty: 'Beginner',
    description: 'Master the methods of sowing seeds at the right depth and spacing for maximum growth.',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    steps: [
      {
        title: 'Select Good Seeds',
        description: 'Choose seeds that are heavy, clean, and free of cracks. You can test them by putting them in water; seeds that sink are healthy.',
        audioInstruction: 'Choose heavy, healthy seeds. Put them in water; the good seeds will sink to the bottom.'
      },
      {
        title: 'Correct Sowing Depth',
        description: 'Sow seeds at a depth equal to 2-3 times their width. Sowing too deep prevents them from sprouting; sowing too shallow exposes them to birds.',
        audioInstruction: 'Sow seeds at medium depth. Sowing too deep blocks light, and too shallow lets birds eat them.'
      },
      {
        title: 'Maintain Spacing',
        description: 'Leave enough space between seeds (usually 10-15 cm depending on the crop) so they do not fight for sunlight and water.',
        audioInstruction: 'Keep space between seeds. This ensures every plant gets enough sunlight and water.'
      },
      {
        title: 'Light Watering',
        description: 'Water gently immediately after sowing. Use a sprinkler or fine spray to avoid washing the seeds away.',
        audioInstruction: 'Water very gently after planting. Do not pour heavy water or seeds will wash away.'
      }
    ],
    quiz: [
      {
        question: 'What is a simple test to check seed quality?',
        options: [
          'Burning the seeds',
          'Placing seeds in water to see if healthy seeds sink',
          'Crushing them with a stone',
          'Sowing them in dark rooms'
        ],
        correctAnswerIndex: 1,
        explanation: 'Healthy seeds are denser and sink in water. Unhealthy, hollow, or diseased seeds float.'
      },
      {
        question: 'What happens if you sow seeds too deep?',
        options: [
          'They sprout faster',
          'They will grow sideways',
          'They may fail to reach the surface and rot',
          'They turn into organic compost'
        ],
        correctAnswerIndex: 2,
        explanation: 'Seeds planted too deep run out of energy before their leaves can reach sunlight for photosynthesis.'
      }
    ]
  },
  {
    id: 'lesson-3',
    title: 'Modern Irrigation Methods',
    category: 'Irrigation',
    difficulty: 'Medium',
    description: 'Learn about drip and sprinkler systems that save water and supply it directly to plant roots.',
    imageUrl: 'https://images.unsplash.com/photo-1463123081488-729f60c3c527?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    steps: [
      {
        title: 'Understand Drip Irrigation',
        description: 'Drip systems deliver water slowly and directly to the roots of the plants through plastic tubes. This reduces water waste by 60%.',
        audioInstruction: 'Drip system drops water slowly right at the root. This saves water and keeps weeds from growing.'
      },
      {
        title: 'Using Sprinklers',
        description: 'Sprinklers spray water into the air like rain. It is ideal for closely spaced crops like wheat, tea, or vegetables.',
        audioInstruction: 'Sprinklers spray water like light rain. Perfect for tea, wheat, and small vegetables.'
      },
      {
        title: 'Check Moisture Before Watering',
        description: 'Stick your finger 2 inches into the soil. If it feels dry, it is time to irrigate. Overwatering causes root rot.',
        audioInstruction: 'Touch the soil. If it feels dry 2 inches deep, water it. Too much water will rot the roots.'
      }
    ],
    quiz: [
      {
        question: 'Which irrigation method is most water-efficient?',
        options: [
          'Flood irrigation',
          'Drip irrigation',
          'Sprinkler irrigation',
          'No irrigation'
        ],
        correctAnswerIndex: 1,
        explanation: 'Drip irrigation delivers water directly to the plant root zones, minimizing evaporation and weed growth.'
      }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Natural Pest & Weed Control',
    category: 'Pest Control',
    difficulty: 'Medium',
    description: 'Protect your crops using organic neem extracts, companion planting, and hand-weeding.',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    steps: [
      {
        title: 'Make Neem Oil Spray',
        description: 'Mix 10 ml of organic neem oil with a few drops of dish soap in 1 liter of warm water. Spray on leaf tops and bottoms to repel chewing insects.',
        audioInstruction: 'Mix neem oil with mild soap and water. Spray on leaves to keep insects away naturally.'
      },
      {
        title: 'Introduce Friendly Insects',
        description: 'Ladybugs and lacewings eat aphids and pests. Plant marigolds around your crops to attract these friendly bugs.',
        audioInstruction: 'Plant orange marigold flowers. They attract ladybugs that eat bad crop pests.'
      },
      {
        title: 'Regular Hand Weeding',
        description: 'Remove weeds early before they produce seeds. Weeds steal food and water from your main crops.',
        audioInstruction: 'Pull out weeds early by hand. If you leave weeds, they steal your plant’s food.'
      }
    ],
    quiz: [
      {
        question: 'Which natural oil is commonly used to repel insect pests?',
        options: [
          'Coconut oil',
          'Neem oil',
          'Mustard oil',
          'Kerosene'
        ],
        correctAnswerIndex: 1,
        explanation: 'Neem oil contains Azadirachtin, which disrupts the life cycles and feeding habits of over 200 insect species.'
      }
    ]
  }
];

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'scheme-1',
    name: 'PM-KISAN Samman Nidhi',
    description: 'An initiative by the Government of India providing income support to all landholding farmer families across the country.',
    benefits: '₹6,000 per year, paid in three equal installments of ₹2,000 directly into the farmers\' bank accounts.',
    eligibility: 'All small and marginal landholder farmer families who have cultivable land holding in their names.',
    howToApply: 'Apply online through the PM-Kisan portal or visit your nearest Common Service Centre (CSC).'
  },
  {
    id: 'scheme-2',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'A comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss/damage arising out of natural calamities.',
    benefits: 'Low premium rates (1.5% to 2% for food crops, 5% for commercial crops) with full sum insured coverage for crop failure.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    howToApply: 'Register through your agricultural bank, cooperative society, or apply online on the National Crop Insurance Portal.'
  },
  {
    id: 'scheme-3',
    name: 'Agricultural Infrastructure Fund (AIF)',
    description: 'A medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    benefits: '3% interest subvention per annum on loans up to ₹2 Crore, with credit guarantee coverage up to ₹2 Crore.',
    eligibility: 'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, Agri-Entrepreneurs, and Farmers.',
    howToApply: 'Apply through the online portal with a detailed project report (DPR) or directly contact registered commercial banks.'
  },
  {
    id: 'scheme-4',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    description: 'A scheme promoting the use of modern farm machinery to increase agricultural productivity in remote and small-scale farms.',
    benefits: '40% to 50% subsidy on purchase of tractors, rotavators, power tillers, sprayers, and harvesting equipment.',
    eligibility: 'Individual small, marginal, women, and SC/ST farmers registered in agricultural department.',
    howToApply: 'Register on the SMAM portal with your land registry document, Aadhaar, and bank passbook, then choose the machinery.'
  }
];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  { cropName: 'Rice / Paddy', priceRange: '₹2,183 - ₹2,300', trend: 'up', district: 'Thanjavur' },
  { cropName: 'Wheat', priceRange: '₹2,275 - ₹2,450', trend: 'stable', district: 'Karnal' },
  { cropName: 'Sugarcane', priceRange: '₹315 - ₹340', trend: 'stable', district: 'Meerut' },
  { cropName: 'Cotton', priceRange: '₹6,800 - ₹7,500', trend: 'up', district: 'Warangal' },
  { cropName: 'Tomato', priceRange: '₹1,500 - ₹2,200', trend: 'down', district: 'Kolar' },
  { cropName: 'Onion', priceRange: '₹2,000 - ₹2,800', trend: 'up', district: 'Nashik' },
  { cropName: 'Maize (Corn)', priceRange: '₹1,962 - ₹2,100', trend: 'stable', district: 'Belagavi' },
  { cropName: 'Banana', priceRange: '₹1,200 - ₹1,800', trend: 'up', district: 'Trichy' },
  { cropName: 'Groundnut', priceRange: '₹6,300 - ₹7,200', trend: 'stable', district: 'Anantapur' },
  { cropName: 'Coconut', priceRange: '₹2,500 - ₹3,100', trend: 'up', district: 'Kozhikode' }
];
