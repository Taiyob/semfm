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
  appreciation: number;
}

const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

export async function fetchProperties(countrySlug: string = 'portugal'): Promise<Property[]> {
  // 1. If API keys are missing, return fallback mock data (Prototype Mode)
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
          condition: 'Premium',
          appreciation: 5.8
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
          condition: 'High-End',
          appreciation: 6.2
        }
      ],
      spain: [
        {
          id: 's1',
          title: 'Valencia Coastal Apartment',
          description: 'A beautiful modern apartment located in the El Cabanyal district, just minutes from the beach. Features high ceilings and a spacious balcony.',
          location: 'Valencia, Spain',
          region: 'El Cabanyal',
          price: 345000,
          yield: 5.6,
          type: 'Apartment',
          image: 'https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?q=80&w=2070&auto=format&fit=crop',
          sqm: 95,
          bedrooms: 2,
          status: 'Available',
          outdoorSpace: 'Balcony',
          energyLabel: 'B',
          locationType: 'Semi-Centre',
          condition: 'Premium',
          appreciation: 5.8
        },
        {
          id: 's2',
          title: 'Alicante City Hub',
          description: 'A centrally located studio perfect for remote workers and expats. Recently renovated with high-end finishes and excellent connectivity.',
          location: 'Alicante, Spain',
          region: 'Centro',
          price: 185000,
          yield: 6.1,
          type: 'Studio',
          image: 'https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=2070&auto=format&fit=crop',
          sqm: 50,
          bedrooms: 1,
          status: 'Available',
          outdoorSpace: 'None',
          energyLabel: 'B',
          locationType: 'Centre',
          condition: 'High-End',
          appreciation: 4.9
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
      description: record.fields.Description || 'Verified listing.',
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
      condition: record.fields.Condition || 'Standard',
      appreciation: record.fields.Appreciation || 5.0
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
