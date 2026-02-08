-- Tabela para armazenar velas do servidor 2
CREATE TABLE public.velas_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valor DECIMAL(10,2) NOT NULL,
  servidor TEXT NOT NULL DEFAULT 'server2',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para armazenar sinais gerados
CREATE TABLE public.sinais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apos_de DECIMAL(10,2) NOT NULL,
  cashout DECIMAL(10,2) NOT NULL,
  tentativas INTEGER NOT NULL DEFAULT 1,
  resultado TEXT CHECK (resultado IN ('green', 'loss', 'aguardando')) DEFAULT 'aguardando',
  vela_final DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para estatísticas diárias
CREATE TABLE public.estatisticas_diarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  total_sinais INTEGER NOT NULL DEFAULT 0,
  total_greens INTEGER NOT NULL DEFAULT 0,
  total_loss INTEGER NOT NULL DEFAULT 0,
  total_registros INTEGER NOT NULL DEFAULT 0,
  total_visitantes INTEGER NOT NULL DEFAULT 0,
  total_whatsapp INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para rastrear visitantes únicos por IP
CREATE TABLE public.visitantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip_hash, data)
);

-- Tabela para rastrear cliques em ações
CREATE TABLE public.acoes_usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('registro', 'ja_tenho_conta', 'whatsapp')),
  ip_hash TEXT,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.velas_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sinais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estatisticas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acoes_usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura (o site precisa ler)
CREATE POLICY "Leitura pública de velas" ON public.velas_historico FOR SELECT USING (true);
CREATE POLICY "Leitura pública de sinais" ON public.sinais FOR SELECT USING (true);
CREATE POLICY "Leitura pública de estatísticas" ON public.estatisticas_diarias FOR SELECT USING (true);

-- Políticas para inserção (via edge function com service role)
CREATE POLICY "Inserção de velas via service" ON public.velas_historico FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserção de sinais via service" ON public.sinais FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualização de sinais via service" ON public.sinais FOR UPDATE USING (true);
CREATE POLICY "Inserção de estatísticas via service" ON public.estatisticas_diarias FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualização de estatísticas via service" ON public.estatisticas_diarias FOR UPDATE USING (true);
CREATE POLICY "Inserção de visitantes via service" ON public.visitantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserção de ações via service" ON public.acoes_usuarios FOR INSERT WITH CHECK (true);

-- Função para incrementar estatísticas
CREATE OR REPLACE FUNCTION public.incrementar_estatistica(
  p_campo TEXT,
  p_valor INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO estatisticas_diarias (data, total_sinais, total_greens, total_loss, total_registros, total_visitantes, total_whatsapp)
  VALUES (CURRENT_DATE, 0, 0, 0, 0, 0, 0)
  ON CONFLICT (data) DO NOTHING;
  
  EXECUTE format('UPDATE estatisticas_diarias SET %I = %I + $1, updated_at = now() WHERE data = CURRENT_DATE', p_campo, p_campo)
  USING p_valor;
END;
$$;