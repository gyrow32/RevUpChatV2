import type { ParsedResponse, VehicleData, Block } from '@/app/lib/types';

import { debugLog } from '@/app/lib/utils/debug';



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

    

    // DEBUG: Try to parse and log the entire response object

    try {

      let jsonOutput = response.output;

      // Strip ```json fences if present

      const jsonMatch = jsonOutput.match(/```json\s*([\s\S]*?)```/);

      if (jsonMatch && jsonMatch[1]) {

        jsonOutput = jsonMatch[1].trim();

      }

      

      const parsedJson = JSON.parse(jsonOutput);

      debugLog('PARSED JSON STRUCTURE:', parsedJson);

      

      // If it has vehicles, log the first vehicle to see all fields

      if (parsedJson.vehicles && Array.isArray(parsedJson.vehicles) && parsedJson.vehicles.length > 0) {

        const vehicle = parsedJson.vehicles[0];

        debugLog('FIRST VEHICLE FULL DATA:', vehicle);

        

        // Log all property names in the vehicle object

        debugLog('ALL VEHICLE KEYS:', Object.keys(vehicle));

        

        // Find any keys containing "profit" (case insensitive)

        const profitKeys = Object.keys(vehicle).filter(key => 

          key.toLowerCase().includes('profit')

        );

        if (profitKeys.length > 0) {

          debugLog('FOUND PROFIT KEYS:', profitKeys);

          profitKeys.forEach(key => {

            debugLog(`${key} value:`, vehicle[key]);

          });

        }

      }

    } catch (e) {

      // If parsing fails, it's not valid JSON or has other format

      debugLog('Failed to parse raw response as JSON for debugging', e);

    }

    

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

        debugLog('Error parsing mixed content:', mixedError);

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

    debugLog('Failed to parse webhook response:', error);

    throw new Error('Failed to parse AI response');

  }

}



interface RawVehicleData {

  id?: string;

  vin?: string;

  year?: string | number;

  make?: string;

  model?: string;

  trim?: string;

  price?: string | number;

  image?: string;

  stock?: string;

  dealer?: string;

  mileage?: string | number;

  odometer?: string | number;

  bodyStyle?: string;

  fuel?: string;

  fuelType?: string;

  drivetrain?: string;

  unitCost?: string | number;

  jdPowerClean?: string | number;

  "Image URLs"?: string[];

  "Vehicle Link"?: string;

  vdp?: string;

  payment?: string | number;

  downPayment?: string | number;

  loanTermMonths?: string | number;

  ltv?: string | number;

  interestRate?: string | number;

  taxRate?: string | number;

  profit?: string | number;

  ageDays?: string | number;

  Profit?: string | number; // Add capitalized variant

  newProfit?: string | number; // Add newProfit variant

  NewProfit?: string | number; // Add capitalized newProfit variant

  "New Profit"?: string | number; // Add space-separated variant

}



// Normalize vehicle data from different formats

function normalizeVehicleData(vehicle: RawVehicleData): VehicleData {

  // Log the incoming vehicle object to debug profit field

  debugLog('Raw vehicle data:', {

    id: vehicle.id,

    make: vehicle.make,

    model: vehicle.model,

    profit: vehicle.profit,

    Profit: vehicle.Profit,

    newProfit: vehicle.newProfit,

    NewProfit: vehicle.NewProfit,

    "New Profit": vehicle["New Profit"],

    // Log all keys to find the profit property if it exists with a different name

    keys: Object.keys(vehicle),

    // Log all values for keys containing "profit"

    profitValues: Object.entries(vehicle)

      .filter(([key]) => key.toLowerCase().includes('profit'))

      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

  });

  

  // Check for all profit field variants and handle any case variants

  let profitValue;

  

  // Look for standard variants first

  if (vehicle.profit !== undefined) {

    profitValue = vehicle.profit;

    debugLog('Found profit in standard field:', profitValue);

  }

  else if (vehicle.Profit !== undefined) {

    profitValue = vehicle.Profit;

    debugLog('Found profit in capitalized field:', profitValue);

  }

  else if (vehicle.newProfit !== undefined) {

    profitValue = vehicle.newProfit;

    debugLog('Found profit in newProfit field:', profitValue);

  }

  else if (vehicle.NewProfit !== undefined) {

    profitValue = vehicle.NewProfit;

    debugLog('Found profit in NewProfit field:', profitValue);

  }

  else if (vehicle["New Profit"] !== undefined) {

    profitValue = vehicle["New Profit"];

    debugLog('Found profit in "New Profit" field:', profitValue);

  }

  

  // If we still don't have a profit value, search all keys for any containing "profit" (case insensitive)

  if (profitValue === undefined) {

    for (const key of Object.keys(vehicle)) {

      if (key.toLowerCase().includes('profit')) {

        profitValue = (vehicle as Record<string, unknown>)[key];

        debugLog(`Found profit in field: ${key} with value: ${profitValue}`);

        break;

      }

    }

  }

  

  const normalizedVehicle = {

    id: vehicle.id || vehicle.vin || `vehicle-${Date.now()}`,

    year: parseInt(String(vehicle.year)) || 0,

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

    odometer: vehicle.odometer ? String(vehicle.odometer) : undefined,

    bodyStyle: vehicle.bodyStyle || undefined,

    fuel: vehicle.fuel || vehicle.fuelType || undefined,

    drivetrain: vehicle.drivetrain || undefined,

    unitCost: vehicle.unitCost ? String(vehicle.unitCost) : undefined,

    jdPowerClean: vehicle.jdPowerClean ? String(vehicle.jdPowerClean) : undefined,

    "Image URLs": vehicle["Image URLs"] || undefined,

    "Vehicle Link": vehicle["Vehicle Link"] || vehicle.vdp || undefined,

    // Financial data

    payment: vehicle.payment ? parseFloat(String(vehicle.payment).replace(/[$,]/g, '')) : undefined,

    downPayment: vehicle.downPayment ? parseFloat(String(vehicle.downPayment).replace(/[$,]/g, '')) : undefined,

    loanTermMonths: vehicle.loanTermMonths ? parseInt(String(vehicle.loanTermMonths)) : undefined,

    ltv: vehicle.ltv ? parseFloat(String(vehicle.ltv)) : undefined,

    interestRate: vehicle.interestRate ? parseFloat(String(vehicle.interestRate)) : undefined,

    taxRate: vehicle.taxRate ? parseFloat(String(vehicle.taxRate)) : undefined,

    profit: profitValue ? parseFloat(String(profitValue).replace(/[$,]/g, '')) : undefined,

    ageDays: vehicle.ageDays ? parseInt(String(vehicle.ageDays)) : undefined,

  };

  

  // Log the normalized vehicle to verify profit is being properly processed

  debugLog('Normalized vehicle data:', {

    profit: normalizedVehicle.profit,

    year: normalizedVehicle.year,

    make: normalizedVehicle.make,

    model: normalizedVehicle.model

  });

  

  return normalizedVehicle;

}