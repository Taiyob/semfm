/**
 * InvesTerra Airtable Integration Utility
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
  status: 'Available' | 'Sold' | 'Under Offer';
}

const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

export async function fetchProperties(countrySlug: string = 'portugal'): Promise<Property[]> {
  // 1. If API keys are missing, return fallback mock data (Institutional Prototype Mode)
  if (!API_KEY || !BASE_ID) {
    console.warn('Airtable API keys missing. Running in Prototype Mode with Mock Data.');
    return [
        {
          id: '1',
          title: 'Modern Duplex in Beato',
          location: 'Lisbon, Portugal',
          region: 'Beato',
          price: 320000,
          yield: 5.8,
          type: 'Apartment',
          image: '/assets/lisbon_apartment_thumbnail_1775342926518.png',
          sqm: 85,
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
          image: '/assets/lisbon_apartment_thumbnail_1775342926518.png',
          sqm: 45,
          status: 'Available'
        }
    ];
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
      image: record.fields.Image?.[0]?.url || '/assets/lisbon_apartment_thumbnail_1775342926518.png',
      sqm: record.fields.Sqm,
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
