/**
 * MrMikes Configuration
 *
 * SETUP: Replace Supabase values with your own credentials for cloud storage
 * Get them from: https://supabase.com -> Your Project -> Settings -> API
 */

const CONFIG = {
  // GitHub Configuration (for image uploads)
  // Create a token at: https://github.com/settings/tokens
  // Token needs 'repo' permission (Contents: Read and write)
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN',
  GITHUB_OWNER: 'rob10305',
  GITHUB_REPO: 'MrMikes',
  GITHUB_BRANCH: 'main',

  // Supabase Configuration (Get free account at supabase.com)
  SUPABASE_URL: 'YOUR_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_KEY',

  // Simple Auth (fallback if Supabase not configured)
  USE_SIMPLE_AUTH: true,
  SIMPLE_PASSWORD: 'mrmikes2024',  // CHANGE THIS!

  // Site Settings
  SITE_NAME: 'MrMikes',
  SITE_TAGLINE: 'Premium Car Upholstery Kits',

  // Session timeout (4 hours)
  SESSION_TIMEOUT: 4 * 60 * 60 * 1000,

  isSupabaseConfigured() {
    return this.SUPABASE_URL !== 'YOUR_SUPABASE_URL' && this.SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_KEY';
  },

  isGitHubConfigured() {
    return this.GITHUB_TOKEN !== 'YOUR_GITHUB_TOKEN' && this.GITHUB_TOKEN.length > 0;
  }
};

// Default Content Data with LOCAL image paths
const DEFAULT_DATA = {
  products: {
    fiero: {
      title: 'Fiero',
      description: 'Complete seat upholstery kits for all Fiero models',
      image: 'images/rocky1_star.jpg'
    },
    corvette: {
      title: 'Corvette',
      description: 'Classic Corvette interior restoration kits',
      image: 'images/fieroinvette01.jpg'
    },
    mg: {
      title: 'MG',
      description: 'British classic car upholstery solutions',
      image: 'images/blackwyellowmgandweltsm.jpg'
    },
    triumph: {
      title: 'Triumph - Miata',
      description: 'Miata seats customized for Triumph fitment',
      image: 'images/tr6beforeandafter_sm.jpg'
    },
    kitcar: {
      title: 'Kit-Car & Pantera',
      description: 'Fiero-based kit cars and exotic applications',
      image: 'images/pilasmira.jpg'
    },
    ponycars: {
      title: 'Vintage Mustang & Camaro',
      description: 'Classic American muscle car interiors',
      image: 'images/FieroSeatsIn65Mustang01.jpg'
    },
    retro: {
      title: 'Retro-Mods',
      description: 'Modern seats with vintage styling',
      image: 'images/transam02_sm.jpg'
    },
    trimbright: {
      title: 'TrimBright Welt',
      description: 'Premium trim and welt accessories',
      image: 'images/mustangpink01.jpg'
    }
  },
  gallery: [
    { id: '1', image: 'images/rocky1_star.jpg', caption: 'Fiero GT with custom upholstery', category: 'fiero' },
    { id: '2', image: 'images/fieroinvette01.jpg', caption: 'Fiero seats in Corvette', category: 'corvette' },
    { id: '3', image: 'images/tr6beforeandafter_sm.jpg', caption: 'TR6 before and after', category: 'triumph' },
    { id: '4', image: 'images/blackwyellowmgandweltsm.jpg', caption: 'MG with yellow welt', category: 'mg' },
    { id: '5', image: 'images/FieroSeatsIn65Mustang01.jpg', caption: 'Fiero seats in 65 Mustang', category: 'ponycars' }
  ],
  testimonials: [
    {
      id: '1',
      author: 'Steve',
      location: 'Mentone, Indiana',
      content: 'I received my upholstery kit on Friday and had them finished on Sunday. I was a little reluctant to spend that much on my seats but I have to tell you they were worth every penny. I am a Quality Control Manager and these seats were of the highest quality I could have imagined. They feel great to sit in and look even better. You made it simple with your video guidance. Thanks for a great product.',
      rating: 5
    },
    {
      id: '2',
      author: 'Rick',
      location: 'TR6 Owner',
      content: 'The fit and finish exceeded my expectations. MrMikes made the entire process simple with clear instructions and responsive customer service. My TR6 has never looked better!',
      rating: 5
    }
  ],
  hero: {
    title: 'Show Winning Upholstery Kits',
    subtitle: 'Ready to Install. Do-it-Right. Do-it-Yourself.',
    description: 'We craft premium upholstery kits for Fiero and Miata seats that fit perfectly in a wide variety of sports cars including MG, Corvette, Triumph, and vintage Mustang & Camaro.'
  },
  about: {
    title: 'Why Choose MrMikes?',
    description: 'With over 30 years of experience and 24+ years selling online, we\'ve perfected the art of crafting upholstery kits that transform ordinary seats into show-winning masterpieces.'
  },
  contact: {
    phone: '941-922-5070',
    email: 'mrmike@mrmikes.com',
    hours: 'Mon-Fri 10am-4pm Eastern'
  }
};
