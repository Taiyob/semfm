import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import { AppLogger } from '@/core/logging/logger';
import { PropertyStatus } from '@/generated/prisma/client';

export class PropertySyncService {
  private isSyncing = false;

  /**
   * Initializes the cron job to run daily at midnight
   */
  public initializeCron() {
    AppLogger.info('Initializing PropertySyncService Cron Job (Schedule: 0 0 * * *)');
    // Run at midnight every day
    cron.schedule('0 0 * * *', () => {
      this.syncPropertiesStatus();
    });
  }

  /**
   * Run the sync process for all available properties with external links
   */
  public async syncPropertiesStatus() {
    if (this.isSyncing) {
      AppLogger.warn('Property sync is already running. Skipping this iteration.');
      return;
    }

    this.isSyncing = true;
    AppLogger.info('Starting automated property status sync...');
    
    try {
      const properties = await prisma.property.findMany({
        where: {
          status: PropertyStatus.AVAILABLE,
          externalListingUrl: { not: null, notIn: [''] }
        }
      });

      AppLogger.info(`Found ${properties.length} available properties with external URLs to check.`);

      let updatedCount = 0;

      for (const property of properties) {
        if (!property.externalListingUrl) continue;
        
        try {
          const isSold = await this.checkIfSold(property.externalListingUrl);
          
          if (isSold) {
            AppLogger.info(`Property ${property.id} (${property.title}) is marked as SOLD on external site. Updating database...`);
            
            await prisma.property.update({
              where: { id: property.id },
              data: { status: PropertyStatus.SOLD }
            });
            
            updatedCount++;
          }
        } catch (error: any) {
           AppLogger.error(`Failed to check status for property ${property.id} (${property.externalListingUrl}):`, error?.message);
           
           // If it's a 404, it might mean the listing was removed/sold.
           // Depending on business logic, we might mark as SOLD or just log it.
           // For now, let's mark it as SOLD if it's completely gone from the original site.
           if (error?.response?.status === 404) {
             AppLogger.info(`Property ${property.id} returned 404 Not Found. Marking as SOLD.`);
             await prisma.property.update({
                where: { id: property.id },
                data: { status: PropertyStatus.SOLD }
             });
             updatedCount++;
           }
        }
        
        // Polite delay of 3 seconds between requests to avoid IP bans
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      AppLogger.info(`Property status sync completed. Updated ${updatedCount} properties.`);
    } catch (error) {
      AppLogger.error('Critical error during property sync process:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Fetch the URL and analyze HTML to determine if sold
   */
  private async checkIfSold(url: string): Promise<boolean> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const bodyText = $('body').text().toLowerCase();

    // Check Remax specific indicators
    if (url.includes('remax.pt') || url.includes('remax')) {
      // Examples: "imóvel vendido", "vendido", "reservado"
      if (bodyText.includes('imóvel vendido') || bodyText.includes('vendido') || $('.label-sold').length > 0) {
        return true;
      }
    }
    // Check Engel Voelkers specific indicators
    else if (url.includes('engelvoelkers.com')) {
      if (bodyText.includes('sold') || bodyText.includes('vendido') || bodyText.includes('verkauft')) {
        return true;
      }
    }
    // Generic fallback checks (can be expanded based on client needs)
    else {
      // We look for common sold tags, but this can lead to false positives if not careful.
      // So we keep it strict to specific labels if possible, or common phrases.
      if (bodyText.includes('no longer available') || bodyText.includes('listing removed')) {
         return true; 
      }
    }

    return false;
  }
}
