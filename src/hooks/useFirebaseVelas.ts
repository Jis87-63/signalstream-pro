import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SinaisResponse {
  status: string;
  servidor: string;
  data: string;
  message?: string;
  ultimaVela?: string;
  maiorVela?: string;
  totalVelas?: number;
  velas: string[];
}

export const useFirebaseVelas = () => {
  const [velas, setVelas] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSinais = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sinais-milionario');
      
      if (error) {
        console.error('Erro ao buscar sinais:', error);
        setError(error.message);
        setIsConnected(false);
        return;
      }

      const response = data as SinaisResponse;
      
      if (response.status === 'online' && response.velas) {
        setVelas(response.velas);
        setIsConnected(true);
        setLastTimestamp(new Date(response.data).getTime());
        setError(null);
      } else {
        setIsConnected(false);
        setError(response.message || 'Servidor offline');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro de conexão');
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Buscar sinais inicialmente
    fetchSinais();

    // Atualizar a cada 3 segundos
    const interval = setInterval(fetchSinais, 3000);

    return () => clearInterval(interval);
  }, [fetchSinais]);

  return { velas, isConnected, lastTimestamp, error };
};
