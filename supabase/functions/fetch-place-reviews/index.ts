import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeName, address } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    console.log('Fetching reviews for:', placeName, address);

    // Step 1: Find Place
    const searchQuery = `${placeName} ${address}, Cabo Frio, RJ, Brazil`;
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    
    const findPlaceResponse = await fetch(findPlaceUrl);
    const findPlaceData = await findPlaceResponse.json();

    if (!findPlaceData.candidates || findPlaceData.candidates.length === 0) {
      console.log('No place found for:', placeName);
      return new Response(
        JSON.stringify({ reviews: [], rating: null, totalReviews: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const placeId = findPlaceData.candidates[0].place_id;
    console.log('Found place_id:', placeId);

    // Step 2: Get Place Details with Reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=pt-BR`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      console.error('Place details error:', detailsData.status);
      return new Response(
        JSON.stringify({ reviews: [], rating: null, totalReviews: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reviews = detailsData.result?.reviews || [];
    const rating = detailsData.result?.rating || null;
    const totalReviews = detailsData.result?.user_ratings_total || 0;

    console.log(`Successfully fetched ${reviews.length} reviews for ${placeName}`);

    return new Response(
      JSON.stringify({ 
        reviews: reviews.slice(0, 3), // Return top 3 reviews
        rating,
        totalReviews,
        placeId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage, reviews: [], rating: null, totalReviews: 0 }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
