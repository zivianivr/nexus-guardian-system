import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simple test endpoint
    const response = {
      status: 'ok',
      message: 'Sistema Guardian VoIP v3.0 funcionando corretamente',
      timestamp: new Date().toISOString(),
      version: '3.0',
      services: {
        guardian: 'online',
        nexusAI: 'online',
        database: 'online',
        monitoring: 'online'
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função de teste:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do sistema',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});