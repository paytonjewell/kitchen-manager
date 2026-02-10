/**
 * List of common ingredients for autocomplete suggestions
 * Organized by category for better maintainability
 */

// Proteins
const proteins = [
  'chicken breast',
  'chicken thigh',
  'ground beef',
  'steak',
  'pork chop',
  'bacon',
  'sausage',
  'ham',
  'turkey',
  'salmon',
  'tuna',
  'shrimp',
  'cod',
  'tilapia',
  'tofu',
  'tempeh',
  'egg',
];

// Dairy & Eggs
const dairy = [
  'milk',
  'heavy cream',
  'sour cream',
  'yogurt',
  'butter',
  'cheese',
  'cheddar cheese',
  'mozzarella cheese',
  'parmesan cheese',
  'cream cheese',
  'feta cheese',
  'goat cheese',
];

// Vegetables
const vegetables = [
  'onion',
  'garlic',
  'tomato',
  'bell pepper',
  'carrot',
  'celery',
  'potato',
  'sweet potato',
  'broccoli',
  'cauliflower',
  'spinach',
  'lettuce',
  'cucumber',
  'zucchini',
  'mushroom',
  'corn',
  'green bean',
  'asparagus',
  'kale',
  'cabbage',
  'eggplant',
  'jalapeño',
  'ginger',
  'scallion',
  'leek',
  'shallot',
];

// Fruits
const fruits = [
  'apple',
  'banana',
  'orange',
  'lemon',
  'lime',
  'strawberry',
  'blueberry',
  'raspberry',
  'avocado',
  'mango',
  'pineapple',
  'grape',
  'watermelon',
  'peach',
  'pear',
  'cherry',
  'tomato',
];

// Grains & Pasta
const grains = [
  'rice',
  'brown rice',
  'pasta',
  'spaghetti',
  'penne',
  'linguine',
  'bread',
  'flour',
  'all-purpose flour',
  'whole wheat flour',
  'oat',
  'quinoa',
  'couscous',
  'barley',
  'cornmeal',
];

// Legumes & Beans
const legumes = [
  'black beans',
  'kidney beans',
  'pinto beans',
  'chickpea',
  'lentil',
  'white beans',
  'navy beans',
  'peas',
];

// Herbs & Spices
const herbs = [
  'salt',
  'black pepper',
  'oregano',
  'basil',
  'thyme',
  'rosemary',
  'parsley',
  'cilantro',
  'dill',
  'mint',
  'cumin',
  'paprika',
  'chili powder',
  'cayenne pepper',
  'turmeric',
  'cinnamon',
  'nutmeg',
  'vanilla extract',
  'garlic powder',
  'onion powder',
  'bay leaf',
];

// Condiments & Sauces
const condiments = [
  'olive oil',
  'vegetable oil',
  'sesame oil',
  'vinegar',
  'balsamic vinegar',
  'apple cider vinegar',
  'soy sauce',
  'worcestershire sauce',
  'hot sauce',
  'ketchup',
  'mustard',
  'mayonnaise',
  'honey',
  'maple syrup',
  'sugar',
  'brown sugar',
  'chicken broth',
  'beef broth',
  'vegetable broth',
  'tomato paste',
  'tomato sauce',
];

// Baking
const baking = [
  'baking powder',
  'baking soda',
  'yeast',
  'chocolate chip',
  'cocoa powder',
  'powdered sugar',
  'cornstarch',
];

// Nuts & Seeds
const nutsAndSeeds = [
  'almond',
  'walnut',
  'pecan',
  'cashew',
  'peanut',
  'peanut butter',
  'almond butter',
  'sunflower seed',
  'chia seed',
  'flaxseed',
  'sesame seed',
];

/**
 * Complete list of common ingredients
 * All ingredients should be in singular, lowercase form
 */
export const COMMON_INGREDIENTS = [
  ...proteins,
  ...dairy,
  ...vegetables,
  ...fruits,
  ...grains,
  ...legumes,
  ...herbs,
  ...condiments,
  ...baking,
  ...nutsAndSeeds,
].sort();
