
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// List of allowed environment variables that can be accessed
const ALLOWED_ENV_KEYS = [
  "FLEXERA_API_KEY",
  "FLEXERA_API_URL",
  "OTHER_API_SECRET"
];

// CORS headers to allow your application to access this endpoint
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { key } = await req.json();
    
    // Check if the requested key is in the allowed list
    if (!key || !ALLOWED_ENV_KEYS.includes(key)) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized environment variable request"
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get the environment variable value
    const value = Deno.env.get(key);
    
    return new Response(
      JSON.stringify({ value }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
