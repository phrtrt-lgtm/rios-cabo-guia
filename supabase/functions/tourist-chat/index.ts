import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é o Guia Rios, um assistente turístico especializado em Cabo Frio e região (incluindo Arraial do Cabo e Búzios), no litoral do Rio de Janeiro, Brasil.

CONHECIMENTO LOCAL:
- Praias de Cabo Frio: Praia do Forte (a mais famosa, águas calmas), Ilha do Japonês (águas cristalinas, acessível na maré baixa), Praia do Peró (ondas para surf), Praia das Conchas (trilhas e piscinas naturais), Reserva do Peró (selvagem e preservada)
- Pontos turísticos: Forte São Mateus (século XVII, vista panorâmica), Morro da Guia (mirante 360°), Bairro Passagem (casas coloridas, restaurantes à beira d'água)
- Arraial do Cabo: Praia do Forno (acesso por trilha ou barco), Praia do Farol (uma das mais bonitas do Brasil, acesso controlado), Prainhas do Pontal do Atalaia, Gruta Azul
- Búzios: Geribá (surf), Ferradurinha (SUP e caiaque), João Fernandes (snorkel), Azeda/Azedinha (escadaria), Rua das Pedras (compras e gastronomia), Orla Bardot

DICAS PRÁTICAS:
- Melhor época: Abril a novembro (menos chuva)
- Ilha do Japonês: Verificar tábua de marés antes de ir
- Praia do Farol: Apenas por barco autorizado, permanência limitada
- Passeios de barco em Arraial: Saem da Praia dos Anjos
- Pôr do sol: Porto da Barra (Búzios) e Forte São Mateus são ótimos

GASTRONOMIA LOCAL:
- Frutos do mar frescos, especialmente na Passagem
- Restaurantes de praia com estrutura em Geribá e João Fernandes
- Rua das Pedras para opções variadas

INSTRUÇÕES:
1. Responda sempre em português brasileiro, de forma amigável e entusiasmada
2. Dê dicas práticas e específicas
3. Sugira alternativas quando apropriado
4. Mencione horários, preços aproximados e dicas de acesso quando souber
5. Seja conciso mas informativo
6. Se não souber algo específico, seja honesto e sugira onde encontrar a informação`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos à sua conta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao conectar com a IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
