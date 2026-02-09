-- Adicionar policy para permitir insert anônimo na tabela visitantes
CREATE POLICY "Permitir insert anônimo em visitantes"
ON public.visitantes
FOR INSERT
WITH CHECK (true);

-- Adicionar policy para permitir select anônimo
CREATE POLICY "Permitir select anônimo em visitantes"
ON public.visitantes
FOR SELECT
USING (true);