import type { ParsedResponse, VehicleData, Block } from '@/types';
import { debugLog } from '@/lib/utils';

// Parse markdown gallery format
function parseMarkdownGallery(content: string): VehicleData[] {
  const vehicles: VehicleData[] = [];
  const vehicleBlocks = content.split(/\d+\.\s+\*\*/);

  vehicleBlocks.slice(1).forEach(block => {
    const titleMatch = block.match(/([^*]+)\*\*/);
    if (!titleMatch) return;

    const title = titleMatch[1].trim();
    const [year, make, model] = title.split(' ');
    
    // Extract image URLs
    const imageUrls = block.match(/!\[Image\]\((https?:\/\/[^\s)]+)\)/g)?.map(url => {
      return url.match(/\((https?:\/\/[^\s)]+)\)/)?.[1] || '';
    }) || [];

    if (imageUrls.length > 0) {
      vehicles.push({
        id: `vehicle-${Date.now()}-${vehicles.length}`,
        year: parseInt(year) || 0,
        make: make || '',
        model: model || '',
        image: imageUrls[0],
        "Image URLs": imageUrls,
        price: 0
      });
    }
  });

  return vehicles;
}

export function parseWebhookResponse(response: { output: string }): ParsedResponse {
  try {
    debugLog('Raw webhook response:', response.output);
    
    // Check for markdown gallery format first
    if (response.output.includes('Here is a gallery') || response.output.includes('Here are')) {
      const vehicles = parseMarkdownGallery(response.output);
      if (vehicles.length > 0) {
        return {
          blocks: [{
            type: 'gallery',
            vehicles
          }]
        };
      }
    }
    
    // Handle mixed content (markdown with embedded JSON)
    const jsonMatch = response.output.match(/```json\s*({[\s\S]*?})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonPart = JSON.parse(jsonMatch[1]);
        
        // Handle blocks format in fenced JSON
        if (jsonPart.blocks && Array.isArray(jsonPart.blocks)) {
          return { blocks: jsonPart.blocks };
        }
        
        // Convert to blocks format
        if (jsonPart.type === 'gallery' && Array.isArray(jsonPart.vehicles)) {
          // Process vehicles data (normalize from RevUP format)
          const normalizedVehicles = jsonPart.vehicles.map(normalizeVehicleData);
          
          const blocks: Block[] = [{
            type: 'gallery' as const,
            vehicles: normalizedVehicles
          }];
          
          // Add text content if exists (outside JSON block)
          const textContent = response.output.replace(/```json\s*[\s\S]*?```/, '').trim();
          if (textContent) {
            blocks.push({
              type: 'text' as const,
              content: textContent
            });
          }
          
          return { blocks };
        }
      } catch (mixedError) {
        console.error('Error parsing mixed content:', mixedError);
        // Continue to standard parsing
      }
    }
    
    // Standard JSON parsing
    try {
      // Strip ```json fences so JSON.parse works
      let body = response.output;
      const m = body.match(/```json\s*([\s\S]*?)```/i);
      if (m) body = m[1].trim();
      
      const parsed = JSON.parse(body);
      
      // Handle different response formats
      if (parsed.type === 'gallery' && Array.isArray(parsed.vehicles)) {
        return {
          blocks: [{
            type: 'gallery',
            vehicles: parsed.vehicles.map(normalizeVehicleData)
          }]
        };
      }
      
      if (parsed.type === 'table' && Array.isArray(parsed.columns) && Array.isArray(parsed.rows)) {
        return {
          blocks: [{
            type: 'table',
            columns: parsed.columns,
            rows: parsed.rows
          }]
        };
      }
      
      if (parsed.type === 'text' && parsed.message) {
        return {
          blocks: [{
            type: 'text',
            content: parsed.message
          }]
        };
      }
      
      // Legacy blocks format
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        return { blocks: parsed.blocks };
      }
      
    } catch (jsonError) {
      // Handle direct text responses
      return {
        blocks: [{
          type: 'text',
          content: response.output
        }]
      };
    }
    
    // Fallback for unknown format
    return {
      blocks: [{
        type: 'text',
        content: response.output
      }]
    };
    
  } catch (error) {
    console.error('Failed to parse webhook response:', error);
    throw new Error('Failed to parse AI response');
  }
}

// Normalize vehicle data from different formats
function normalizeVehicleData(vehicle: any): VehicleData {
  return {
    id: vehicle.id || vehicle.vin || `vehicle-${Date.now()}`,
    year: parseInt(vehicle.year) || 0,
    make: vehicle.make || '',
    model: vehicle.model || '',
    trim: vehicle.trim || undefined,
    price: parseFloat(String(vehicle.price).replace(/[$,]/g, '')) || 0,
    image: vehicle.image || vehicle['Image URLs']?.[0] || undefined,
    stock: vehicle.stock?.replace(/^stock\s*#?\s*/i, '').trim() || undefined,
    vin: vehicle.vin || undefined,
    dealer: vehicle.dealer || undefined,
    mileage: vehicle.mileage ? parseFloat(String(vehicle.mileage).replace(/[,]/g, '')) : 
             vehicle.odometer ? parseFloat(String(vehicle.odometer).replace(/[,]/g, '')) : undefined,
    odometer: vehicle.odometer || undefined,
    bodyStyle: vehicle.bodyStyle || undefined,
    fuel: vehicle.fuel || vehicle.fuelType || undefined,
    drivetrain: vehicle.drivetrain || undefined,
    unitCost: vehicle.unitCost || undefined,
    jdPowerClean: vehicle.jdPowerClean || undefined,
    "Image URLs": vehicle["Image URLs"] || undefined,
    "Vehicle Link": vehicle["Vehicle Link"] || vehicle.vdp || undefined,
    // Financial data
    payment: vehicle.payment ? parseFloat(String(vehicle.payment).replace(/[$,]/g, '')) : undefined,
    downPayment: vehicle.downPayment ? parseFloat(String(vehicle.downPayment).replace(/[$,]/g, '')) : undefined,
    loanTermMonths: vehicle.loanTermMonths ? parseInt(vehicle.loanTermMonths) : undefined,
    ltv: vehicle.ltv ? parseFloat(vehicle.ltv) : undefined,
    interestRate: vehicle.interestRate ? parseFloat(vehicle.interestRate) : undefined,
    taxRate: vehicle.taxRate ? parseFloat(vehicle.taxRate) : undefined,
  };
}