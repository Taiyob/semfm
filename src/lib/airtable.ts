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
  location: string;
  region: string;
  price: number;
  yield: number;
  type: string;
  image: string;
  sqm: number;
  bedrooms: number;
  status: 'Available' | 'Sold' | 'Under Offer';
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
          location: 'Lisbon, Portugal',
          region: 'Beato',
          price: 320000,
          yield: 5.8,
          type: 'Apartment',
          image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop',
          sqm: 85,
          bedrooms: 2,
          status: 'Available'
        },
        {
          id: '2',
          title: 'Riverside Studio',
          location: 'Porto, Portugal',
          region: 'Ribeira',
          price: 210000,
          yield: 6.2,
          type: 'Studio',
          image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2070&auto=format&fit=crop',
          sqm: 45,
          bedrooms: 1,
          status: 'Available'
        }
      ],
      spain: [
        {
          id: 's1',
          title: 'Penthouse Salamanca',
          location: 'Madrid, Spain',
          region: 'Salamanca',
          price: 1250000,
          yield: 4.2,
          type: 'Penthouse',
          image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
          sqm: 140,
          bedrooms: 3,
          status: 'Available'
        },
        {
          id: 's2',
          title: 'Marbella Luxury Villa',
          location: 'Marbella, Spain',
          region: 'Puerto Banus',
          price: 2450000,
          yield: 5.5,
          type: 'Villa',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
          sqm: 350,
          bedrooms: 5,
          status: 'Available'
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
      location: record.fields.Location,
      region: record.fields.Region,
      price: record.fields.Price,
      yield: record.fields.Yield,
      type: record.fields.Type,
      image: record.fields.Image?.[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop',
      sqm: record.fields.Sqm,
      bedrooms: record.fields.Bedrooms || 0,
      status: record.fields.Status
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
