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

DADOS DO ROTEIRO:
${JSON.stringify(itineraries, null, 2)}

Origem: ${origin || "Não especificada"}
Modo de transporte: ${mode === 'walking' ? 'a pé' : 'carro'}

INSTRUÇÕES:
- Crie um HTML estiloso e bem formatado para cada dia
- Use cores vibrantes e elementos visuais atraentes
- Inclua emojis e ícones para tornar mais visual
- Adicione dicas úteis e descrições envolventes para cada local
- Organize o conteúdo de forma clara com horários sugeridos
- Use a paleta de cores terracota (#E67E50) como destaque
- Cada dia deve caber em uma página A4 quando impresso
- Inclua cabeçalho com logo e título atraente
- Adicione um rodapé com informações de contato
- Use tipografia hierárquica e espaçamento adequado
- Retorne APENAS o HTML, sem explicações adicionais
- Use classes Tailwind CSS para estilização
- Torne o design moderno, clean e profissional

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
