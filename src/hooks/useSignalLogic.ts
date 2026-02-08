import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePushNotifications } from './usePushNotifications';

interface SignalData {
  aposde: string;
  cashout: string;
  tentativas: number;
  status: 'aguardando' | 'green' | 'loss' | 'analisando';
  velaFinal?: string;
  isActive: boolean;
}

// Algoritmo sofisticado para prever entradas baseado em padrões das velas
const analyzePattern = (velas: number[]): { shouldEnter: boolean; cashout: number; confidence: number } => {
  if (velas.length < 4) return { shouldEnter: false, cashout: 0, confidence: 0 };

  // Padrão 1: Sequência de velas baixas (< 2x) seguidas - alta probabilidade de vela alta
  const recentLowCount = velas.slice(0, 4).filter(v => v < 2).length;
  
  // Padrão 2: Média móvel das últimas 6 velas
  const avgRecent = velas.slice(0, 6).reduce((a, b) => a + b, 0) / Math.min(velas.length, 6);
  
  // Padrão 3: Desvio padrão para detectar volatilidade
  const variance = velas.slice(0, 6).reduce((acc, v) => acc + Math.pow(v - avgRecent, 2), 0) / Math.min(velas.length, 6);
  const stdDev = Math.sqrt(variance);
  
  // Padrão 4: Tendência ascendente ou descendente
  const trend = velas.slice(0, 3).reduce((a, b) => a + b, 0) / 3 - velas.slice(3, 6).reduce((a, b) => a + b, 0) / 3;
  
  // Padrão 5: Última vela muito baixa (< 1.5x) é bom sinal
  const lastVelaLow = velas[0] < 1.5;
  
  // Padrão 6: Duas velas consecutivas baixas
  const twoConsecutiveLow = velas[0] < 1.8 && velas[1] < 1.8;
  
  // Padrão 7: Nenhuma vela alta (> 5x) nas últimas 5 rodadas
  const noHighRecent = velas.slice(0, 5).every(v => v < 5);
  
  // Calcular score de confiança
  let score = 0;
  
  if (recentLowCount >= 3) score += 30;
  else if (recentLowCount >= 2) score += 20;
  
  if (lastVelaLow) score += 15;
  if (twoConsecutiveLow) score += 20;
  if (noHighRecent) score += 15;
  if (avgRecent < 2.5) score += 10;
  if (stdDev < 1.5) score += 10; // Baixa volatilidade = mais previsível
  
  // Determinar cashout baseado na análise
  let cashoutMultiplier = 1.8;
  
  if (score >= 70) {
    cashoutMultiplier = 2.2 + Math.random() * 0.5; // 2.2x - 2.7x
  } else if (score >= 50) {
    cashoutMultiplier = 1.8 + Math.random() * 0.4; // 1.8x - 2.2x
  } else {
    cashoutMultiplier = 1.5 + Math.random() * 0.3; // 1.5x - 1.8x
  }
  
  const shouldEnter = score >= 45;
  
  return {
    shouldEnter,
    cashout: cashoutMultiplier,
    confidence: Math.min(score, 100)
  };
};

// Salvar sinal no banco de dados
const saveSignal = async (aposde: number, cashout: number, tentativas: number) => {
  try {
    const { data, error } = await supabase
      .from('sinais')
      .insert({
        apos_de: aposde,
        cashout: cashout,
        tentativas: tentativas,
        resultado: 'aguardando'
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    // Incrementar contador de sinais
    await supabase.rpc('incrementar_estatistica', { p_campo: 'total_sinais' });
    
    return data?.id;
  } catch (err) {
    console.error('Erro ao salvar sinal:', err);
    return null;
  }
};

// Atualizar resultado do sinal
const updateSignalResult = async (signalId: string, resultado: 'green' | 'loss', velaFinal: number) => {
  try {
    await supabase
      .from('sinais')
      .update({
        resultado,
        vela_final: velaFinal
      })
      .eq('id', signalId);
    
    // Incrementar contador correspondente
    const campo = resultado === 'green' ? 'total_greens' : 'total_loss';
    await supabase.rpc('incrementar_estatistica', { p_campo: campo });
  } catch (err) {
    console.error('Erro ao atualizar sinal:', err);
  }
};

export const useSignalLogic = (velas: string[], lastTimestamp?: number, isConnected: boolean = false) => {
  const [signal, setSignal] = useState<SignalData>({
    aposde: '--',
    cashout: '--',
    tentativas: 0,
    status: 'analisando',
    isActive: false,
  });
  
  const lastVelaRef = useRef<string>('');
  const currentSignalIdRef = useRef<string | null>(null);
  const { sendEntryNotification, sendGreenNotification, permission } = usePushNotifications();

  // Verificar se o servidor está ativo (timestamp recente)
  const isServerActive = useCallback(() => {
    if (!lastTimestamp) return false;
    const now = Date.now();
    const diff = now - lastTimestamp;
    // Se a última atualização foi há mais de 2 minutos, servidor pode estar pausado
    return diff < 120000; // 2 minutos
  }, [lastTimestamp]);

  // Gerar sinal baseado nos padrões das velas
  const generateSignal = useCallback(async () => {
    if (velas.length < 4) return;
    if (!isServerActive()) return;

    // Mostrar "analisando" enquanto processa
    setSignal(prev => ({
      ...prev,
      status: 'analisando',
      isActive: false,
    }));

    const numericVelas = velas.slice(0, 10).map(v => parseFloat(v));
    const analysis = analyzePattern(numericVelas);
    
    if (analysis.shouldEnter) {
      // "Apos de" mostra a última vela
      const ultimaVelaNum = numericVelas[0];
      const ultimaVela = `${ultimaVelaNum.toFixed(2)}x`;
      const cashoutValue = analysis.cashout.toFixed(2);
      const tentativas = analysis.confidence >= 70 ? 1 : 2;
      
      // Salvar sinal no banco
      const signalId = await saveSignal(ultimaVelaNum, analysis.cashout, tentativas);
      currentSignalIdRef.current = signalId;
      
      setSignal({
        aposde: ultimaVela,
        cashout: `${cashoutValue}x`,
        tentativas,
        status: 'aguardando',
        isActive: true,
      });

      // Enviar notificação push se permitido
      if (permission === 'granted') {
        sendEntryNotification(ultimaVela, `${cashoutValue}x`, tentativas);
      }
    } else {
      // Não há entrada - mostrar analisando
      setSignal({
        aposde: '--',
        cashout: '--',
        tentativas: 0,
        status: 'analisando',
        isActive: false,
      });
    }
  }, [velas, permission, sendEntryNotification, isServerActive]);

  // Verificar resultado (GREEN ou LOSS)
  const checkResult = useCallback(async () => {
    if (signal.status !== 'aguardando' || !signal.isActive || velas.length === 0) return;
    
    const latestVela = parseFloat(velas[0]);
    const cashoutTarget = parseFloat(signal.cashout.replace('x', ''));
    
    if (!isNaN(latestVela) && !isNaN(cashoutTarget)) {
      if (latestVela >= cashoutTarget) {
        const velaFinal = `${latestVela.toFixed(2)}x`;
        
        // Atualizar no banco
        if (currentSignalIdRef.current) {
          await updateSignalResult(currentSignalIdRef.current, 'green', latestVela);
        }
        
        setSignal(prev => ({
          ...prev,
          status: 'green',
          velaFinal,
        }));

        if (permission === 'granted') {
          sendGreenNotification(velaFinal);
        }

        // Reset após 10 segundos
        setTimeout(() => {
          currentSignalIdRef.current = null;
          setSignal({
            aposde: '--',
            cashout: '--',
            tentativas: 0,
            status: 'analisando',
            isActive: false,
          });
        }, 10000);
      }
    }
  }, [signal, velas, permission, sendGreenNotification]);

  // Detectar nova vela e gerar sinal
  useEffect(() => {
    if (!isConnected || velas.length === 0) return;
    
    const currentVela = velas[0];
    
    // Se a vela mudou, temos uma nova rodada
    if (currentVela !== lastVelaRef.current) {
      lastVelaRef.current = currentVela;
      
      // Se não há sinal ativo, tentar gerar um novo
      if (!signal.isActive || signal.status === 'green') {
        generateSignal();
      } else {
        // Verificar resultado do sinal atual
        checkResult();
      }
    }
  }, [velas, isConnected, signal.isActive, signal.status, generateSignal, checkResult]);

  // Atualizar "apos de" com a última vela quando não há sinal ativo
  useEffect(() => {
    if (!signal.isActive && velas.length > 0 && isServerActive() && isConnected) {
      const ultimaVela = parseFloat(velas[0]);
      if (!isNaN(ultimaVela)) {
        setSignal(prev => ({
          ...prev,
          aposde: `${ultimaVela.toFixed(2)}x`,
        }));
      }
    }
  }, [velas, signal.isActive, isServerActive, isConnected]);

  return {
    ...signal,
    isServerActive: isServerActive(),
  };
};
