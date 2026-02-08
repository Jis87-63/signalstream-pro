import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Gerar hash simples do IP (usando fingerprint do navegador como fallback)
const generateVisitorHash = (): string => {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export const useVisitorTracking = () => {
  // Registrar visitante único
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const ipHash = generateVisitorHash();
        
        // Tentar inserir - se já existir para hoje, vai ignorar (UNIQUE constraint)
        const { error } = await supabase
          .from('visitantes')
          .insert({ ip_hash: ipHash })
          .select();
        
        // Se inseriu com sucesso (visitante novo), incrementar contador
        if (!error) {
          await supabase.rpc('incrementar_estatistica', { p_campo: 'total_visitantes' });
        }
      } catch (err) {
        // Ignora erros silenciosamente
        console.log('Visitante já registrado hoje');
      }
    };

    trackVisitor();
  }, []);

  // Registrar ação do usuário
  const trackAction = useCallback(async (tipo: 'registro' | 'ja_tenho_conta' | 'whatsapp') => {
    try {
      const ipHash = generateVisitorHash();
      
      await supabase.from('acoes_usuarios').insert({
        tipo,
        ip_hash: ipHash
      });

      // Incrementar contador correspondente
      if (tipo === 'registro' || tipo === 'ja_tenho_conta') {
        await supabase.rpc('incrementar_estatistica', { p_campo: 'total_registros' });
      } else if (tipo === 'whatsapp') {
        await supabase.rpc('incrementar_estatistica', { p_campo: 'total_whatsapp' });
      }
    } catch (err) {
      console.error('Erro ao registrar ação:', err);
    }
  }, []);

  return { trackAction };
};
