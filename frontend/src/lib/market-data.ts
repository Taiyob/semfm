import { 
  TrendingUp, 
  Globe, 
  Layout, 
  Star 
} from 'lucide-react';

export interface MarketRegion {
  name: string;
  cities: string[];
  yield: string;
  vacancy: string;
  appreciation: string;
  availableProperties: string;
  indicators: string[];
  image: string;
  description: string;
}

export interface MarketState {
  label: string;
  value: string;
}

export interface MarketData {
  slug: string;
  name: string;
  heroQuote: string;
  stats: MarketState[];
  regions: MarketRegion[];
}

export const MARKET_REGISTRY: Record<string, MarketData> = {
  portugal: {
    slug: 'portugal',
    name: 'Portugal',
    heroQuote: 'Access verified regional metrics, tax-inclusive yield maps, and off-market listings',
    stats: [
      { label: 'Avg yield', value: '5.2%' },
      { label: 'Avg appreciation', value: '8.4%' },
      { label: 'Available properties', value: '12.5k+' },
    ],
    regions: [
      {
        name: 'Lisbon',
        cities: ['Chiado', 'Belem', 'Cascais'],
        yield: '4.8%',
        vacancy: '3%',
        appreciation: '6.2%',
        availableProperties: '42',
        indicators: ['Strong Capital Appreciation', 'Prime Rental Demand'],
        image: '/assets/lisbon.png',
        description: 'The political and economic heart of Portugal. Stable yields with exceptional capital growth potential in historic districts.'
      },
      {
        name: 'Porto',
        cities: ['Downtown', 'Foz', 'Gaia'],
        yield: '5.4%',
        vacancy: '3.5%',
        appreciation: '6.2%',
        availableProperties: '42',
        indicators: ['Emerging Tech Hub', 'High Rental Absorption'],
        image: '/assets/porto.png',
        description: 'A growing tech scene and vibrant tourism drive high rental demand in the Douro region.'
      },
      {
        name: 'Braga',
        cities: ['Historic Center', 'University District', 'Lamaçães'],
        yield: '5.6%',
        vacancy: '3%',
        appreciation: '5.1%',
        availableProperties: '42',
        indicators: ['High long-term rental demand', 'Strong price-to-yield ratio'],
        image: '/assets/braga.png',
        description: 'Portugal’s fastest-growing northern city. Strong rental demand driven by universities, tech expansion, and a young population.'
      },
      {
        name: 'Faro',
        cities: ['Historic Center', 'Montenegro', 'Gambelas'],
        yield: '5.2%',
        vacancy: '3.4%',
        appreciation: '4.6%',
        availableProperties: '42',
        indicators: ['High Holiday Yield', 'Luxury Resilience'],
        image: '/assets/faro.png',
        description: 'The Algarve’s year-round anchor city. A stable, service-driven economy where rental demand comes from locals, students, and professionals — not tourism cycles.'
      }
    ]
  },
  spain: {
    slug: 'spain',
    name: 'Spain',
    heroQuote: 'Access verified regional metrics, tax-inclusive yield maps, and off-market listings',
    stats: [
      { label: 'Avg yield', value: '5.9%' },
      { label: 'Avg appreciation', value: '5.4%' },
      { label: 'Available properties', value: '45.0k+' },
    ],
    regions: [
      {
        name: 'Valencia',
        cities: ['Ciutat Vella', 'Eixample', 'El Cabanyal'],
        yield: '5.6%',
        vacancy: '3.2%',
        appreciation: '5.8%',
        availableProperties: '42',
        indicators: ['Prime long-term rental demand', 'Strong appreciation'],
        image: 'https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?q=80&w=2070&auto=format&fit=crop',
        description: 'A dynamic coastal city combining strong rental demand, sustainable growth, and an increasingly international tenant base.'
      },
      {
        name: 'Alicante',
        cities: ['Centro', 'San Juan', 'Postiguet'],
        yield: '6.1%',
        vacancy: '3.5%',
        appreciation: '4.9%',
        availableProperties: '42',
        indicators: ['High yield potential', 'Consistent occupancy'],
        image: 'https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=2070&auto=format&fit=crop',
        description: 'A high-yield coastal hub where accessible entry prices meet consistent rental demand, driven by expats, remote workers, and year-round lifestyle appeal.'
      },
      {
        name: 'Málaga',
        cities: ['Historic Center', 'El Limonar', 'Soho'],
        yield: '5.4%',
        vacancy: '2.8%',
        appreciation: '6.7%',
        availableProperties: '42',
        indicators: ['Strong economic growth', 'Premium rental demand'],
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
        description: 'One of Spain’s fastest-growing cities — a thriving tech and lifestyle destination with premium rental demand and strong long-term fundamentals.'
      },
      {
        name: 'Las Palmas (Gran Canaria)',
        cities: ['Las Canteras', 'Vegueta', 'Triana'],
        yield: '6.5%',
        vacancy: '2.1%',
        appreciation: '4.2%',
        availableProperties: '42',
        indicators: ['Very low vacancy', 'Strong long-term rental market'],
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop',
        description: 'A year-round rental market with exceptionally low vacancy, driven by remote workers, digital nomads, and a stable local economy.'
      }
    ]
  }
};
