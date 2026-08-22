import { prisma } from '@/lib/prisma';

export class ShortTermService {
    
    /**
     * Calculates the estimated occupancy rate based on Short-Term rules.
     */
    async calculateOccupancy(city: string, zone: string, condition: string, guestCapacity: number) {
        // Default base occupancies from client document
        const baseOccupancies: Record<string, number> = {
            'Lisbon': 70,
            'Porto': 65,
            'Faro': 60,
            'Braga': 55,
            'Valencia': 70,
            'Alicante': 65,
            'Málaga': 70,
            'Las Palmas (Gran Canaria)': 65
        };

        let occupancy = baseOccupancies[city] || 60; // default to 60% if unknown

        // Apply Zone penalty
        if (zone === 'Outside Centre') {
            occupancy = occupancy * 0.85; // -15% relative
        } else if (zone === 'Semi-Centre') {
            occupancy = occupancy * 0.95; // Custom small penalty, though client doc didn't specify, let's assume 1.0 or 0.95
        }

        // Apply Condition penalty
        if (condition === 'Standard') {
            occupancy = occupancy * 0.90; // -10% relative
        } else if (condition === 'Basic' || condition === 'Outdated' || condition === 'In need of renovation') {
            occupancy = occupancy * 0.80; // -20% relative
        }

        return Math.min(100, Math.round(occupancy));
    }

    /**
     * Calculates the estimated nightly rate based on Short-Term Settings in DB.
     */
    async calculateNightlyRate(
        city: string, 
        bedrooms: number, 
        bathrooms: number, 
        listingType: string, 
        guestCapacity: number,
        zone: string,
        condition: string
    ) {
        const settingsRecord = await prisma.systemSetting.findFirst();
        if (!settingsRecord || !settingsRecord.shortTermSettings) {
            throw new Error("Short-Term settings not configured in database.");
        }

        const st = settingsRecord.shortTermSettings as any;
        
        const baseRate = st.baseRates?.[city] || 100;
        const listingMult = st.listingTypeMultipliers?.[listingType] || 1.0;
        
        const bedKey = Math.min(bedrooms, 5).toString();
        const bedMult = st.bedroomMultipliers?.[bedKey] || 1.0;

        const bathKey = Math.min(bathrooms, 5).toString();
        const bathMult = st.bathroomMultipliers?.[bathKey] || 1.0;

        const guestKey = Math.min(guestCapacity, 6).toString();
        const guestMult = st.guestCapacityMultipliers?.[guestKey] || 1.0;

        const zoneMult = st.zoneFactors?.[zone] || 1.0;
        const condMult = st.conditionFactors?.[condition] || 1.0;

        const nightlyRate = baseRate * listingMult * bedMult * bathMult * guestMult * zoneMult * condMult;

        return Math.round(nightlyRate);
    }
}
