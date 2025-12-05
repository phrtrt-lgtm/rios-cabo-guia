import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ItineraryItem {
  placeName: string;
  category: string;
  bairro: string;
  duration: number;
  eta?: number;
  isFallback?: boolean;
}

interface DayItinerary {
  cafe: ItineraryItem[];
  manha: ItineraryItem[];
  almoco: ItineraryItem[];
  tarde: ItineraryItem[];
  fimDeTarde: ItineraryItem[];
  noite: ItineraryItem[];
  jantar: ItineraryItem[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itineraries, origin, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Você é um guia turístico especializado em Cabo Frio e Região dos Lagos. 
Crie um roteiro de viagem atraente e bem formatado em HTML para impressão.

DADOS DO ROTEIRO (cada item tem eta = tempo de deslocamento em minutos até o lugar, e duration = tempo de permanência):
${JSON.stringify(itineraries, null, 2)}

Origem: ${origin || "Não especificada"}
Modo de transporte: ${mode === 'walking' ? 'a pé' : 'de carro'}

INSTRUÇÕES CRÍTICAS:
1. TEMPOS DE DESLOCAMENTO: Para cada lugar, mostre claramente "🚗 X min de deslocamento" ou "🚶 X min caminhando" ANTES do nome do lugar
2. TEMPO DE PERMANÊNCIA: Mostre quanto tempo ficar em cada lugar (campo "duration" em minutos)
3. HORÁRIOS: Calcule horários sugeridos começando às 7h, somando deslocamento + permanência
4. FORMATO VISUAL: Para cada lugar, mostre:
   - Ícone de carro/pessoa + tempo de deslocamento
   - Nome do lugar em destaque
   - Bairro/localização
   - Tempo sugerido de permanência
   - Horário estimado de chegada e saída

DESIGN:
- Paleta terracota (#E67E50) e azul oceano (#1E3A5F) como cores principais
- Cada dia em uma página A4
- Visual moderno, clean e profissional
- Emojis para tornar mais visual
- Timeline vertical conectando os lugares
- Badge com tempo total do dia

IMPORTANTE: 
- Retorne APENAS o HTML, sem explicações
- Use inline CSS (não Tailwind) para garantir compatibilidade de impressão
- Destaque visualmente os tempos de deslocamento entre lugares

Retorne o HTML completo pronto para impressão.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "Você é um especialista em design de roteiros turísticos. Crie HTMLs bonitos, modernos e profissionais usando Tailwind CSS." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos à sua workspace Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erro ao gerar roteiro com IA");
    }

    const data = await response.json();
    const generatedHTML = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ html: generatedHTML }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-itinerary-pdf:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
