import { Category, Costume, Booking } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Inflatable Costumes',
    description: 'Fun and eye-catching inflatable costumes perfect for parties and events',
    image: '/images/categories/inflatable.jpg',
    icon: '🎈',
    slug: 'inflatable-costumes'
  },
  {
    id: '2',
    name: 'Character Costumes',
    description: 'Popular character costumes from movies, TV shows, and games',
    image: '/images/categories/characters.jpg',
    icon: '🦸',
    slug: 'character-costumes'
  },
  {
    id: '3',
    name: 'Animal Costumes',
    description: 'Adorable and realistic animal costumes for all ages',
    image: '/images/categories/animals.jpg',
    icon: '🦁',
    slug: 'animal-costumes'
  },
  {
    id: '4',
    name: 'Historical Costumes',
    description: 'Period costumes from different eras and cultures',
    image: '/images/categories/historical.jpg',
    icon: '🏛️',
    slug: 'historical-costumes'
  },
  {
    id: '5',
    name: 'Superhero Costumes',
    description: 'Powerful superhero costumes for comic book fans',
    image: '/images/categories/superheroes.jpg',
    icon: '🦸‍♂️',
    slug: 'superhero-costumes'
  },
  {
    id: '6',
    name: 'Horror Costumes',
    description: 'Spooky and scary costumes for Halloween and themed events',
    image: '/images/categories/horror.jpg',
    icon: '👻',
    slug: 'horror-costumes'
  }
];

export const costumes: Costume[] = [
  // Inflatable Costumes
  {
    id: '1',
    name: 'Inflatable T-Rex Costume',
    description: 'A hilarious inflatable T-Rex costume that will make you the life of any party. Features realistic dinosaur design with built-in fan for easy inflation.',
    categoryId: '1',
    images: ['/images/costumes/inflatable-trex-1.jpg', '/images/costumes/inflatable-trex-2.jpg'],
    pricePerDay: 2500,
    pricePer12Hours: 1400,
    pricePerWeek: 11000,
    size: 'One Size',
    difficulty: 'Easy',
    setupTime: 5,
    features: ['Built-in fan', 'Easy to wear', 'Comfortable', 'Eye-catching'],
    isAvailable: true,
    slug: 'inflatable-trex-costume'
  },
  {
    id: '2',
    name: 'Inflatable Unicorn Costume',
    description: 'Magical inflatable unicorn costume perfect for birthday parties and fantasy events. Features rainbow colors and sparkly details.',
    categoryId: '1',
    images: ['/images/costumes/inflatable-unicorn-1.jpg', '/images/costumes/inflatable-unicorn-2.jpg'],
    pricePerDay: 2200,
    pricePer12Hours: 1200,
    pricePerWeek: 9900,
    size: 'One Size',
    difficulty: 'Easy',
    setupTime: 5,
    features: ['Rainbow colors', 'Sparkly details', 'Built-in fan', 'Magical appearance'],
    isAvailable: true,
    slug: 'inflatable-unicorn-costume'
  },
  {
    id: '3',
    name: 'Inflatable Sumo Wrestler',
    description: 'Fun inflatable sumo wrestler costume that will have everyone laughing. Perfect for parties and team building events.',
    categoryId: '1',
    images: ['/images/costumes/inflatable-sumo-1.jpg', '/images/costumes/inflatable-sumo-2.jpg'],
    pricePerDay: 1900,
    pricePer12Hours: 1100,
    pricePerWeek: 8800,
    size: 'One Size',
    difficulty: 'Easy',
    setupTime: 5,
    features: ['Hilarious design', 'Built-in fan', 'Easy movement', 'Party favorite'],
    isAvailable: true,
    slug: 'inflatable-sumo-wrestler'
  },
  {
    id: '4',
    name: 'Inflatable Hot Dog Costume',
    description: 'Classic inflatable hot dog costume that never goes out of style. Great for food-themed parties and casual events.',
    categoryId: '1',
    images: ['/images/costumes/inflatable-hotdog-1.jpg', '/images/costumes/inflatable-hotdog-2.jpg'],
    pricePerDay: 1650,
    pricePer12Hours: 990,
    pricePerWeek: 7700,
    size: 'One Size',
    difficulty: 'Easy',
    setupTime: 5,
    features: ['Classic design', 'Built-in fan', 'Comfortable', 'Versatile'],
    isAvailable: true,
    slug: 'inflatable-hotdog-costume'
  },
  {
    id: '5',
    name: 'Inflatable Shark Costume',
    description: 'Scary and fun inflatable shark costume perfect for beach parties and ocean-themed events.',
    categoryId: '1',
    images: ['/images/costumes/inflatable-shark-1.jpg', '/images/costumes/inflatable-shark-2.jpg'],
    pricePerDay: 2100,
    pricePer12Hours: 1150,
    pricePerWeek: 9350,
    size: 'One Size',
    difficulty: 'Easy',
    setupTime: 5,
    features: ['Realistic design', 'Built-in fan', 'Scary appearance', 'Beach party favorite'],
    isAvailable: true,
    slug: 'inflatable-shark-costume'
  },
  {
    id: '6',
    name: 'Inflatable Pizza Slice',
    description: 'Delicious inflatable pizza slice costume that will make everyone hungry. Perfect for food festivals and casual parties.',
    categoryId: '1',
    images: ['/images/costumes/inflatable-pizza-1.jpg', '/images/costumes/inflatable-pizza-2.jpg'],
    pricePerDay: 1750,
    pricePer12Hours: 1050,
    pricePerWeek: 8250,
    size: 'One Size',
    difficulty: 'Easy',
    setupTime: 5,
    features: ['Appetizing design', 'Built-in fan', 'Food-themed', 'Fun and casual'],
    isAvailable: true,
    slug: 'inflatable-pizza-slice'
  },
  // Character Costumes
  {
    id: '7',
    name: 'Spider-Man Costume',
    description: 'Authentic Spider-Man costume with detailed web pattern and mask. Perfect for superhero themed events.',
    categoryId: '2',
    images: ['/images/costumes/spiderman-1.jpg', '/images/costumes/spiderman-2.jpg'],
    pricePerDay: 2750,
    pricePer12Hours: 1540,
    pricePerWeek: 12100,
    size: 'M',
    difficulty: 'Medium',
    setupTime: 10,
    features: ['Authentic design', 'Detailed web pattern', 'Includes mask', 'High quality material'],
    isAvailable: true,
    slug: 'spiderman-costume'
  },
  {
    id: '8',
    name: 'Batman Costume',
    description: 'Dark Knight Batman costume with cape and utility belt. Includes mask and gloves for the complete look.',
    categoryId: '2',
    images: ['/images/costumes/batman-1.jpg', '/images/costumes/batman-2.jpg'],
    pricePerDay: 3000,
    pricePer12Hours: 1650,
    pricePerWeek: 13200,
    size: 'L',
    difficulty: 'Medium',
    setupTime: 15,
    features: ['Complete set', 'Cape included', 'Utility belt', 'Professional quality'],
    isAvailable: true,
    slug: 'batman-costume'
  },
  // Animal Costumes
  {
    id: '9',
    name: 'Lion Costume',
    description: 'Majestic lion costume with realistic mane and tail. Perfect for safari themed parties and children events.',
    categoryId: '3',
    images: ['/images/costumes/lion-1.jpg', '/images/costumes/lion-2.jpg'],
    pricePerDay: 2300,
    pricePer12Hours: 1320,
    pricePerWeek: 10450,
    size: 'L',
    difficulty: 'Easy',
    setupTime: 8,
    features: ['Realistic mane', 'Comfortable fit', 'Durable material', 'Safari themed'],
    isAvailable: true,
    slug: 'lion-costume'
  },
  {
    id: '10',
    name: 'Panda Costume',
    description: 'Adorable panda costume with black and white fur design. Great for zoo themed events and children parties.',
    categoryId: '3',
    images: ['/images/costumes/panda-1.jpg', '/images/costumes/panda-2.jpg'],
    pricePerDay: 2100,
    pricePer12Hours: 1210,
    pricePerWeek: 9350,
    size: 'M',
    difficulty: 'Easy',
    setupTime: 8,
    features: ['Soft material', 'Adorable design', 'Comfortable', 'Child-friendly'],
    isAvailable: true,
    slug: 'panda-costume'
  }
];

export const bookings: Booking[] = [
  {
    id: '1',
    costumeId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-16'),
    totalPrice: 2500,
    status: 'confirmed',
    specialRequests: 'Need help with setup',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    costumeId: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+1234567891',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-22'),
    totalPrice: 4400,
    status: 'confirmed',
    createdAt: new Date('2024-01-12')
  }
];

export const pricingTiers = [
  { duration: '12h', label: '12 Hours', multiplier: 0.6 },
  { duration: '1d', label: '1 Day', multiplier: 1 },
  { duration: '3d', label: '3 Days', multiplier: 2.5 },
  { duration: '1w', label: '1 Week', multiplier: 4.5 }
];
