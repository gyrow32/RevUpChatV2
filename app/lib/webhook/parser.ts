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

    priceofit?: string | number; // Add priceofit field

    // Additional dynamic fields that may come from webhooks
    paymentment?: string | number;
    downpaymentment?: string | number;
    "New PMT"?: string | number;
    "Down Payment"?: string | number;
    "stock #"?: string | number;
    series?: string;
    LTV?: string | number;
    age?: string | number;
    websiteVDPURL?: string;
    imageUrls?: string;
    score?: string | number;
    Score?: string | number;

  }



  // Normalize vehicle data from different formats

  export function normalizeVehicleData(vehicle: RawVehicleData): VehicleData {

    // Debug image-related fields
    console.log('DEBUG - Vehicle image fields:', {
      image: vehicle.image,
      imageUrls: vehicle.imageUrls,
      imageURLs: vehicle["Image URLs"]
    });

    console.log('All keys:', Object.keys(vehicle));

    console.log('Profit-related fields:', {

      "New Profit": vehicle["New Profit"],

      profit: vehicle.profit,

      Profit: vehicle.Profit,

      newProfit: vehicle.newProfit,

      NewProfit: vehicle.NewProfit,

      priceofit: vehicle.priceofit

    });

    

    // Extract profit value from various possible fields, prioritizing priceofit since that's what we're getting

    let profitValue = vehicle.priceofit ?? 

                    vehicle["New Profit"] ?? 

                    vehicle.profit ?? 

                    vehicle.Profit ?? 

                    vehicle.newProfit ?? 

                    vehicle.NewProfit;

    

    console.log('Profit value before normalization:', profitValue);

    console.log('Profit value type:', typeof profitValue);

    

    // Normalize profit value if it's a string

    if (typeof profitValue === 'string') {

      profitValue = parseFloat(profitValue.replace(/[^0-9.-]+/g, ''));

    }

    

    // Ensure profit is always a number (or 0 if missing/invalid)

    if (typeof profitValue !== 'number' || isNaN(profitValue)) {

      profitValue = 0;

    }

    

    console.log('Profit value after normalization:', profitValue);

    console.log('Final profit value type:', typeof profitValue);

    

    // Normalize price if it's a string

    let price = vehicle.price;

    if (typeof price === 'string') {

      price = parseFloat(price.replace(/[^0-9.-]+/g, ''));

    }

    

    // Normalize payment if it's a string

    let payment = vehicle.payment ?? vehicle.paymentment ?? vehicle["New PMT"];

    if (typeof payment === 'string') {

      payment = parseFloat(payment.replace(/[^0-9.-]+/g, ''));

    }

    

    // Normalize down payment if it's a string

    let downPayment = vehicle.downPayment ?? vehicle.downpaymentment ?? vehicle["Down Payment"];

    if (typeof downPayment === 'string') {

      downPayment = parseFloat(downPayment.replace(/[^0-9.-]+/g, ''));

    }

    

    // FIXED: Enhanced imageUrls parsing with more robust handling
    let imageUrls: string[] = [];
    
    // Use Image URLs array if available
    if (Array.isArray(vehicle["Image URLs"]) && vehicle["Image URLs"].length > 0) {
      imageUrls = vehicle["Image URLs"].filter(url => url && typeof url === 'string' && url.trim() !== '');
      console.log('DEBUG - Using Image URLs array:', imageUrls);
    } 
    // Or parse from imageUrls string if available
    else if (typeof vehicle.imageUrls === 'string' && vehicle.imageUrls.trim() !== '') {
      imageUrls = vehicle.imageUrls.split(',').map(url => url.trim()).filter(Boolean);
      console.log('DEBUG - Parsed imageUrls from string:', imageUrls);
    }

    // FIXED: Enhanced image field handling with prioritization
    const primaryImage = vehicle.image || (imageUrls.length > 0 ? imageUrls[0] : undefined);
    console.log('DEBUG - Selected primary image:', primaryImage);

    // Extract score value (check both case variants)
    let score;
    if (vehicle.score !== undefined) {
      score = parseFloat(vehicle.score.toString());
    } else if (vehicle.Score !== undefined) {
      score = parseFloat(vehicle.Score.toString());
    }

    // FIXED: Create normalized vehicle with robust image handling
    const normalizedVehicle = {
      id: vehicle.id?.toString() || vehicle.vin?.toString() || '',
      stock: vehicle.stock?.toString() || vehicle["stock #"]?.toString() || '',
      year: parseInt(vehicle.year?.toString() || '0'),
      make: vehicle.make?.toString() || '',
      model: vehicle.model?.toString() || '',
      trim: vehicle.trim?.toString() || vehicle.series?.toString() || '',
      price: price || 0,
      payment: payment || 0,
      downPayment: downPayment || 0,
      profit: profitValue,
      ltv: parseFloat(vehicle.ltv?.toString() || vehicle.LTV?.toString() || '0'),
      mileage: parseInt(vehicle.mileage?.toString() || vehicle.odometer?.toString() || '0'),
      ageDays: parseInt(vehicle.ageDays?.toString() || vehicle.age?.toString() || '0'),
      image: primaryImage || '', // Use the calculated primary image
      "Image URLs": imageUrls,
      "Vehicle Link": vehicle["Vehicle Link"]?.toString() || vehicle.websiteVDPURL?.toString() || '',
      score: score,
    };
    
    console.log('DEBUG - Final normalized image data:', {
      image: normalizedVehicle.image,
      imageUrls: normalizedVehicle["Image URLs"]
    });
    
    return normalizedVehicle;
  }