 import { useState, useEffect, useCallback } from 'react';
 import { usePushNotifications } from './usePushNotifications';
 
 interface SignalData {
   aposde: string;
   cashout: string;
   tentativas: number;
   status: 'aguardando' | 'green' | 'loss';
   velaFinal?: string;
 }
 
 export const useSignalLogic = (velas: string[]) => {
   const [signal, setSignal] = useState<SignalData>({
     aposde: '--',
     cashout: '--',
     tentativas: 0,
     status: 'aguardando',
   });
   
   const { sendEntryNotification, sendGreenNotification, permission } = usePushNotifications();
 
   // Generate signal based on velas pattern
   const generateSignal = useCallback(() => {
     if (velas.length < 2) return;
 
     const recentVelas = velas.slice(0, 4).map(v => parseFloat(v));
     
     // Simple pattern analysis
     const lowCount = recentVelas.filter(v => v < 2).length;
     const hasHighRecent = recentVelas[0] >= 5;
     
     // Generate entry based on pattern
     if (lowCount >= 2 && !hasHighRecent) {
       const aposValue = (Math.random() * 1.5 + 1.2).toFixed(2);
       const cashoutValue = (Math.random() * 1.5 + 1.8).toFixed(2);
       const tentativas = Math.floor(Math.random() * 2) + 1;
       
       setSignal({
         aposde: `${aposValue}x`,
         cashout: `${cashoutValue}x`,
         tentativas,
         status: 'aguardando',
       });
 
       // Send notification if permission granted
       if (permission === 'granted') {
         sendEntryNotification(`${aposValue}x`, `${cashoutValue}x`, tentativas);
       }
     }
   }, [velas, permission, sendEntryNotification]);
 
   // Check for green result
   const checkResult = useCallback(() => {
     if (signal.status !== 'aguardando' || velas.length === 0) return;
     
     const latestVela = parseFloat(velas[0]);
     const cashoutTarget = parseFloat(signal.cashout.replace('x', ''));
     
     if (!isNaN(latestVela) && !isNaN(cashoutTarget)) {
       if (latestVela >= cashoutTarget) {
         const velaFinal = `${latestVela.toFixed(2)}x`;
         setSignal(prev => ({
           ...prev,
           status: 'green',
           velaFinal,
         }));
 
         if (permission === 'granted') {
           sendGreenNotification(velaFinal);
         }
 
         // Reset after 10 seconds
         setTimeout(() => {
           setSignal({
             aposde: '--',
             cashout: '--',
             tentativas: 0,
             status: 'aguardando',
           });
         }, 10000);
       }
     }
   }, [signal, velas, permission, sendGreenNotification]);
 
   // Trigger signal generation periodically
   useEffect(() => {
     if (velas.length < 2) return;
     
     // Initial signal after a delay
     const timeout = setTimeout(() => {
       if (signal.aposde === '--') {
         generateSignal();
       }
     }, 5000);
 
     return () => clearTimeout(timeout);
   }, [velas, generateSignal, signal.aposde]);
 
   // Check results when velas change
   useEffect(() => {
     checkResult();
   }, [velas, checkResult]);
 
   // Generate new signals periodically
   useEffect(() => {
     const interval = setInterval(() => {
       if (signal.status !== 'aguardando') return;
       
       // Random chance to generate new signal
       if (Math.random() > 0.7 && velas.length >= 2) {
         generateSignal();
       }
     }, 30000);
 
     return () => clearInterval(interval);
   }, [generateSignal, signal.status, velas.length]);
 
   return signal;
 };