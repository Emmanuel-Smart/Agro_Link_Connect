import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, imageUrl, cropKey, location, agricultural_domain } = body;

    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: authHeader || ''
                }
            }
        }
    );

    if (!productId || !cropKey || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch live meteorological data
    let temp = 25; // Default baseline
    let humidity = 60; // Default baseline
    
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        const weatherRes = await fetch(weatherUrl);
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          temp = weatherData.main.temp;
          humidity = weatherData.main.humidity;
        } else {
            console.warn("Weather API failed, using baseline.");
        }
      } catch (err) {
        console.warn("Weather API error, using baseline.", err);
      }
    } else {
        console.warn("No OPENWEATHER_API_KEY found, using baseline weather.");
    }

    // 2. Categorize Climate
    let climateCategory = "Standard Baseline Zone";
    if (temp < 20 && humidity > 75) {
      climateCategory = "Cold/High-Altitude Zone";
    } else if (temp >= 24) {
      climateCategory = "Warm/Low-Altitude Zone";
    }

    // 3 & 4. Vision Analysis with Gemini
    let visionScore = 85;
    let diagnosticText = `Evaluated under ${climateCategory} (${temp}°C, ${humidity}% humidity).`;
    
    // Domain Strategy Mapping
    let visionFocus = "";
    const domainStr = agricultural_domain?.toLowerCase() || 'horticulture';
    if (domainStr === 'horticulture') {
      visionFocus = "Focus on chromatic maturity index (color shifting), surface blemish density (blight/spots), morphological integrity (crushing/bruising), and skin turgidity (wilting/hydration).";
    } else if (domainStr === 'husbandry') {
      visionFocus = "Focus on Anatomical Body Condition Score (mass-to-frame ratio tracking), posture/stance structural vigor (alertness vs lethargy), and coat/plumage surface cleanliness and health (patchiness, lesions, missing feathers).";
    } else if (domainStr === 'aquaculture') {
      visionFocus = "Focus on operculum/gill coloring assessment, corneal lucidity (eye clarity profiles), and skin specularity/mucus coating continuity (freshness metrics).";
    } else if (domainStr === 'processing') {
      visionFocus = "Focus on packaging structural seal integrity, moisture separation layers, text-line extraction for visible production/expiry dates, and granular consistency.";
    } else {
      visionFocus = "Focus on general quality, intactness, freshness, and absence of visual defects.";
    }
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are an expert Agronomic Systems Engineer.
          Analyze this image of ${cropKey} located in a ${climateCategory} (Temp: ${temp}°C, Humidity: ${humidity}%).
          This item belongs to the ${domainStr} domain.
          ${visionFocus}
          Provide a strict visual quality score from 0 to 100.
          Also provide a 1-sentence diagnostic explanation of why this score was given considering the climate and specific vision focus criteria.
          Respond strictly in JSON format: {"score": 85, "diagnostic": "Explanation here..."}
        `;

        // Note: For a real image upload to Gemini, we need to fetch the image and pass it as base64.
        // If there's no image provided, we just prompt text.
        let result;
        if (imageUrl) {
            const imageResp = await fetch(imageUrl);
            const arrayBuffer = await imageResp.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString("base64");

            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: "image/jpeg" // Guessing jpeg, but ideally extracted from headers
                    }
                }
            ]);
        } else {
            result = await model.generateContent(prompt);
        }

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            visionScore = parsed.score || 85;
            diagnosticText = parsed.diagnostic || diagnosticText;
        }
      } catch (err) {
        console.warn("Gemini API error, using default vision score.", err);
      }
    } else {
        console.warn("No GEMINI_API_KEY found, using default vision score.");
        diagnosticText = `Default evaluation under ${climateCategory}. Environmental data within regional baseline bounds.`;
    }

    // 5. Score Calculation Formula
    // Final Score = (0.60 * Vision Analysis Score) + (0.40 * Dynamic Environmental & Logistics Score)
    
    // Calculate Environmental Score (0-100)
    let envScore = 85; 
    if (climateCategory === "Cold/High-Altitude Zone") envScore = 70; // High turgidity but rot risks
    else if (climateCategory === "Warm/Low-Altitude Zone") envScore = 60; // Rapid maturity, wilting risks
    else envScore = 90; // Optimal baseline

    const finalScore = Math.round((0.60 * visionScore) + (0.40 * envScore));

    let statusBadge = 'Healthy';
    if (finalScore >= 90) statusBadge = 'Premium Grade A';
    else if (finalScore >= 70) statusBadge = 'Healthy';
    else if (finalScore >= 40) statusBadge = 'Degraded';
    else statusBadge = 'Critical';

    // 6. Save payload results directly into the database row attributes using the authenticated client
    const { error: updateError } = await supabaseClient
        .from('products')
        .update({
            calculated_quality_score: finalScore,
            quality_status_badge: statusBadge,
            quality_diagnostic_text: diagnosticText,
            agricultural_domain: domainStr
        })
        .eq('id', productId);

    if (updateError) {
        console.error("Database update failed:", updateError);
        return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        calculated_quality_score: finalScore,
        quality_status_badge: statusBadge,
        quality_diagnostic_text: diagnosticText
    });

  } catch (error) {
    console.error("Universal Evaluation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
