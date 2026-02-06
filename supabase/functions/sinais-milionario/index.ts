import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Domínios permitidos
const ALLOWED_ORIGINS = [
  "https://sscashout.onrender.com",
  "https://sscashout.vercel.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

const firebaseConfig = {
  databaseURL: "https://bot-ia-20e75-default-rtdb.firebaseio.com",
};

interface VelaData {
  timestamp: number;
  ultimaVela: string;
  maiorVela: string;
  totalVelas: number;
  velas: string[];
}

const getCorsHeaders = (origin: string | null) => {
  // Verificar se a origem é permitida
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) || 
    origin.includes("lovable.app") || 
    origin.includes("lovableproject.com")
  );
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
};

const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  // Verificar se a origem é permitida
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) || 
    origin.includes("lovable.app") || 
    origin.includes("lovableproject.com")
  );

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Bloquear requisições de origens não permitidas
  if (!isAllowed && origin) {
    const clientIP = getClientIP(req);
    return new Response(
      JSON.stringify({
        permissao: "block",
        visualizar_chaves: "block",
        ip_bloqueado: clientIP,
        mensagem: "Acesso não autorizado",
      }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await fetch(
      `${firebaseConfig.databaseURL}/historico-velas.json`
    );

    if (!response.ok) {
      throw new Error(`Firebase fetch failed: ${response.status}`);
    }

    const dados = await response.json();

    if (!dados) {
      return new Response(
        JSON.stringify({
          status: "offline",
          message: "Sem dados disponíveis",
          velas: [],
          servidor: "desconectado",
          data: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const entries = Object.values(dados) as VelaData[];
    const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
    const latest = sorted[0];

    const result = {
      status: "online",
      servidor: "conectado",
      data: new Date(latest.timestamp).toISOString(),
      ultimaVela: latest.ultimaVela,
      maiorVela: latest.maiorVela,
      totalVelas: latest.totalVelas,
      velas: latest.velas?.slice(0, 15) || [],
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching signals:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        servidor: "erro",
        data: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
