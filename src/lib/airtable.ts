/**
 * Hofman Horizon Airtable Integration Utility
 * 
 * This service handles data fetching from Airtable bases for Property Listings,
 * Yield Data, and Market Insights.
 * 
 * REQUIRED .env.local keys:
 * - NEXT_PUBLIC_AIRTABLE_API_KEY
 * - NEXT_PUBLIC_AIRTABLE_BASE_ID
 */

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  region: string;
  price: number;
  yield: number;
  type: string;
  image: string;
  sqm: number;
  bedrooms: number;
  status: 'Available' | 'Sold' | 'Under Offer';
  outdoorSpace: 'None' | 'Balcony' | 'Garden';
  energyLabel: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  locationType: 'Centre' | 'Semi-Centre' | 'Outside Centre';
  condition: string;
}

const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

export async function fetchProperties(countrySlug: string = 'portugal'): Promise<Property[]> {
  // 1. If API keys are missing, return fallback mock data (Institutional Prototype Mode)
  if (!API_KEY || !BASE_ID) {
    console.warn(`Airtable API keys missing. Running in Prototype Mode with Mock Data for ${countrySlug}.`);
    
    const fallbackData: Record<string, Property[]> = {
      portugal: [
        {
          id: '1',
          title: 'Modern Duplex in Beato',
          description: 'A stunning two-story apartment featuring high ceilings, original stone details, and a private terrace overlooking the Tagus. Perfect for high-yield rental or premium residential living.',
          location: 'Lisbon, Portugal',
          region: 'Beato',
          price: 320000,
          yield: 5.8,
          type: 'Apartment',
          image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop',
          sqm: 85,
          bedrooms: 2,
          status: 'Available',
          outdoorSpace: 'Balcony',
          energyLabel: 'B',
          locationType: 'Semi-Centre',
          condition: 'Premium'
        },
        {
          id: '2',
          title: 'Riverside Studio',
          description: 'Compact and efficient studio located in the heart of Porto\'s historical district. Fully renovated with premium finishes and excellent connectivity to the central hub.',
          location: 'Porto, Portugal',
          region: 'Ribeira',
          price: 210000,
          yield: 6.2,
          type: 'Studio',
          image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2070&auto=format&fit=crop',
          sqm: 45,
          bedrooms: 1,
          status: 'Available',
          outdoorSpace: 'None',
          energyLabel: 'C',
          locationType: 'Centre',
          condition: 'High-End'
        }
      ],
      spain: [
        {
          id: 's1',
          title: 'Penthouse Salamanca',
          description: 'Ultra-exclusive penthouse in Madrid\'s most prestigious neighborhood. Features a large wrap-around balcony and panoramic views of the city skyline.',
          location: 'Madrid, Spain',
          region: 'Salamanca',
          price: 1250000,
          yield: 4.2,
          type: 'Penthouse',
          image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
          sqm: 140,
          bedrooms: 3,
          status: 'Available',
          outdoorSpace: 'Balcony',
          energyLabel: 'A',
          locationType: 'Centre',
          condition: 'Premium'
        },
        {
          id: 's2',
          title: 'Marbella Luxury Villa',
          description: 'A sprawling estate in the hills of Marbella. Offers maximum privacy, a private botanical garden, and state-of-the-art security systems.',
          location: 'Marbella, Spain',
          region: 'Puerto Banus',
          price: 2450000,
          yield: 5.5,
          type: 'Villa',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
          sqm: 350,
          bedrooms: 5,
          status: 'Available',
          outdoorSpace: 'Garden',
          energyLabel: 'A',
          locationType: 'Outside Centre',
          condition: 'High-End'
        }
      ]
    };

    return fallbackData[countrySlug.toLowerCase()] || fallbackData.portugal;
  }


  // 2. Live Fetch Logic (Phase 1 Ready)
  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Properties?filterByFormula={Country}='${countrySlug}'`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
        throw new Error('Failed to fetch from Airtable');
    }

    const data = await response.json();
    return data.records.map((record: any) => ({
      id: record.id,
      title: record.fields.Title,
      description: record.fields.Description || 'Institutional grade listing.',
      location: record.fields.Location,
      region: record.fields.Region,
      price: record.fields.Price,
      yield: record.fields.Yield,
      type: record.fields.Type,
      image: record.fields.Image?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop',
      sqm: record.fields.Sqm,
      bedrooms: record.fields.Bedrooms || 0,
      status: record.fields.Status,
      outdoorSpace: record.fields.OutdoorSpace || 'None',
      energyLabel: record.fields.EnergyLabel || 'B',
      locationType: record.fields.LocationType || 'Centre',
      condition: record.fields.Condition || 'Standard'
    }));
  } catch (error) {
    console.error('Airtable Fetch Error:', error);
    return [];
  }
}

export async function submitNewsletter(email: string) {
    if (!API_KEY || !BASE_ID) return { success: true, mode: 'mock' };
    
    try {
        await fetch(`https://api.airtable.com/v0/${BASE_ID}/Newsletter`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields: { Email: email } })
        });
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}
