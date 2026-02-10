import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, query, limitToLast } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA3uAHrQyJCSyIQzP8X3Uq7ukJ2lWy0tg8",
  authDomain: "bot-ia-20e75.firebaseapp.com",
  databaseURL: "https://bot-ia-20e75-default-rtdb.firebaseio.com",
  projectId: "bot-ia-20e75"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

interface VelaData {
  timestamp: number;
  ultimaVela: string;
  maiorVela: string;
  totalVelas: number;
  velas: string[];
}

export type ConnectionStatus = 'idle' | 'checking' | 'server1' | 'offline';

export const useFirebaseVelas = (shouldConnect: boolean = false) => {
  const [velas, setVelas] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false);
  
  const hasShownSuccessRef = useRef(false);

  useEffect(() => {
    if (!shouldConnect) return;

    setConnectionStatus('checking');

    const dbRef = ref(database, 'historico-velas');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const dados = snapshot.val();
      
      if (!dados) {
        setIsConnected(false);
        setConnectionStatus('offline');
        setError('Sem dados disponíveis');
        return;
      }

      const entries = Object.values(dados) as VelaData[];
      const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
      const latest = sorted[0];

      if (latest && latest.velas) {
        // Pegar apenas as 4 velas mais recentes
        const velasRecentes = latest.velas.slice(0, 4).map(v => {
          const num = parseFloat(v);
          return isNaN(num) ? v : `${num.toFixed(2)}x`;
        });

        console.log('[Firebase RT] Velas recebidas:', velasRecentes);
        
        setVelas(velasRecentes);
        setLastTimestamp(latest.timestamp);
        setIsConnected(true);
        setError(null);
        setConnectionStatus('server1');

        if (!hasShownSuccessRef.current) {
          hasShownSuccessRef.current = true;
          setShowConnectionSuccess(true);
        }
      }
    }, (err) => {
      console.error('[Firebase RT] Erro:', err);
      setIsConnected(false);
      setConnectionStatus('offline');
      setError(err.message);
    });

    return () => unsubscribe();
  }, [shouldConnect]);

  const closeConnectionSuccess = useCallback(() => {
    setShowConnectionSuccess(false);
  }, []);

  return { 
    velas, 
    isConnected, 
    lastTimestamp, 
    error,
    connectionStatus,
    showConnectionSuccess,
    closeConnectionSuccess
  };
};
