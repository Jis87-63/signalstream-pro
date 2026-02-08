import { useState, useEffect, useCallback, useRef } from 'react';
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

interface BackupApiResponse {
  ok: boolean;
  valores?: string[];
}

export type ConnectionStatus = 'checking' | 'server1' | 'server2' | 'connecting_server2' | 'offline';

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutos
const BACKUP_API_URL = 'https://app.sscashout.online/api/velas';

export const useFirebaseVelas = () => {
  const [velas, setVelas] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false);
  
  const hasShownSuccessRef = useRef(false);
  const currentServerRef = useRef<'server1' | 'server2' | null>(null);

  // Buscar do servidor 1 (Firebase via Edge Function)
  const fetchFromServer1 = useCallback(async (): Promise<{ success: boolean; data?: SinaisResponse }> => {
    try {
      const { data, error } = await supabase.functions.invoke('sinais-milionario');
      
      if (error) {
        console.error('Servidor 1 - Erro:', error);
        return { success: false };
      }

      const response = data as SinaisResponse;
      
      if (response.status === 'online' && response.velas) {
        const timestamp = new Date(response.data).getTime();
        const now = Date.now();
        const isStale = (now - timestamp) > STALE_THRESHOLD_MS;
        
        if (isStale) {
          console.log('Servidor 1 - Dados desatualizados (mais de 5 min)');
          return { success: false };
        }
        
        return { success: true, data: response };
      }
      
      return { success: false };
    } catch (err) {
      console.error('Servidor 1 - Exceção:', err);
      return { success: false };
    }
  }, []);

  // Buscar do servidor 2 (Backup API)
  const fetchFromServer2 = useCallback(async (): Promise<{ success: boolean; velas?: string[] }> => {
    try {
      const response = await fetch(BACKUP_API_URL);
      const json = await response.json() as BackupApiResponse;
      
      if (json.ok && json.valores && json.valores.length > 0) {
        return { success: true, velas: json.valores };
      }
      
      return { success: false };
    } catch (err) {
      console.error('Servidor 2 - Exceção:', err);
      return { success: false };
    }
  }, []);

  // Função principal de busca com fallback
  const fetchSinais = useCallback(async () => {
    // Tentar servidor 1 primeiro
    if (connectionStatus === 'checking' || currentServerRef.current === 'server1' || currentServerRef.current === null) {
      const server1Result = await fetchFromServer1();
      
      if (server1Result.success && server1Result.data) {
        setVelas(server1Result.data.velas);
        setIsConnected(true);
        setLastTimestamp(new Date(server1Result.data.data).getTime());
        setError(null);
        
        if (currentServerRef.current !== 'server1') {
          currentServerRef.current = 'server1';
          setConnectionStatus('server1');
          
          if (!hasShownSuccessRef.current) {
            hasShownSuccessRef.current = true;
            setShowConnectionSuccess(true);
          }
        }
        return;
      }
    }
    
    // Se servidor 1 falhou ou está desatualizado, tentar servidor 2
    if (connectionStatus !== 'server2') {
      setConnectionStatus('connecting_server2');
    }
    
    const server2Result = await fetchFromServer2();
    
    if (server2Result.success && server2Result.velas) {
      setVelas(server2Result.velas);
      setIsConnected(true);
      setLastTimestamp(Date.now());
      setError(null);
      
      if (currentServerRef.current !== 'server2') {
        currentServerRef.current = 'server2';
        setConnectionStatus('server2');
        
        if (!hasShownSuccessRef.current) {
          hasShownSuccessRef.current = true;
          setShowConnectionSuccess(true);
        }
      }
      return;
    }
    
    // Ambos servidores falharam
    setIsConnected(false);
    setConnectionStatus('offline');
    setError('Todos os servidores offline');
  }, [connectionStatus, fetchFromServer1, fetchFromServer2]);

  // Verificação inicial e polling
  useEffect(() => {
    // Buscar sinais inicialmente
    fetchSinais();

    // Atualizar a cada 3 segundos
    const interval = setInterval(fetchSinais, 3000);

    return () => clearInterval(interval);
  }, [fetchSinais]);

  const closeConnectionSuccess = useCallback(() => {
    setShowConnectionSuccess(false);
  }, []);

  return { 
    velas, 
    isConnected, 
    lastTimestamp, 
    error,
    connectionStatus,
    currentServer: currentServerRef.current,
    showConnectionSuccess,
    closeConnectionSuccess
  };
};
