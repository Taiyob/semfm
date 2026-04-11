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
    heroQuote: 'Access verified regional metrics, tax-inclusive yield maps, and off-market institutional listings.',
    stats: [
      { label: 'Avg. Yield', value: '5.2%' },
      { label: 'Market Growth', value: '+8.4%' },
      { label: 'Active Listings', value: '12.5k+' },
    ],
    regions: [
      {
        name: 'Lisbon Region',
        cities: ['Chiado', 'Belem', 'Cascais'],
        yield: '4.8%',
        vacancy: '2.1%',
        indicators: ['Strong Capital Appreciation', 'Prime Rental Demand'],
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop',
        description: 'The political and economic heart of Portugal. Stable yields with exceptional capital growth potential in historic districts.'
      },
      {
        name: 'Porto & North',
        cities: ['Downtown', 'Foz', 'Gaia'],
        yield: '5.4%',
        vacancy: '3.5%',
        indicators: ['Emerging Tech Hub', 'Standard Entry Price'],
        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2070&auto=format&fit=crop',
        description: 'A growing tech scene and vibrant tourism drive high rental demand in the Douro region.'
      },
      {
        name: 'Algarve South',
        cities: ['Lagos', 'Vilamoura', 'Quinta do Lago'],
        yield: '6.2%',
        vacancy: '8% (Seasonal)',
        indicators: ['High Holiday Yield', 'Luxury Resilience'],
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop',
        description: 'The premier holiday destination. High yields during peak seasons with established luxury resale markets.'
      }
    ]
  },
  spain: {
    slug: 'spain',
    name: 'Spain',
    heroQuote: 'Beta Intelligence: institutional data integration for Madrid, Barcelona, and the Costa del Sol.',
    stats: [
      { label: 'Avg. Yield', value: '4.8%' },
      { label: 'Market Growth', value: '+7.2%' },
      { label: 'Active Listings', value: '45.0k+' },
    ],
    regions: [
      {
        name: 'Madrid Central',
        cities: ['Salamanca', 'Chamberi', 'Retiro'],
        yield: '4.1%',
        vacancy: '1.8%',
        indicators: ['Stable Euro ROI', 'Global Tech Capital'],
        image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
        description: 'The financial engine of Spain. Low yields but massive capital preservation and liquidity.'
      },
      {
        name: 'Costa del Sol',
        cities: ['Marbella', 'Malaga', 'Estepona'],
        yield: '5.9%',
        vacancy: '5.5%',
        indicators: ['Tourism Dominance', 'High Network Migration'],
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
        description: 'Europes lifestyle destination with strong short-term rental permits and year-round demand.'
      }
    ]
  }
};
