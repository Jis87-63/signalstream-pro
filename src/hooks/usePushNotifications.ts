 import { useState, useCallback } from 'react';
 
 export const usePushNotifications = () => {
   const [isEnabled, setIsEnabled] = useState(false);
   const [permission, setPermission] = useState<NotificationPermission>('default');
 
   const requestPermission = useCallback(async () => {
     if (!('Notification' in window)) {
       alert('Este navegador não suporta notificações push.');
       return false;
     }
 
     const result = await Notification.requestPermission();
     setPermission(result);
     
     if (result === 'granted') {
       setIsEnabled(true);
       return true;
     }
     
     return false;
   }, []);
 
   const sendNotification = useCallback((title: string, body: string, icon?: string) => {
     if (permission !== 'granted') return;
     
     if (document.hidden) {
       new Notification(title, {
         body,
         icon: icon || '/logo.png',
         badge: '/favicon.png',
         tag: 'sscashout-signal',
       });
     }
   }, [permission]);
 
   const sendEntryNotification = useCallback((apos: string, cashout: string, tentativas: number) => {
     sendNotification(
       '🎯 NOVA ENTRADA - SSCASHOUT',
       `APOS: ${apos} | CASHOUT: ${cashout} | Tentativas: ${tentativas}`,
     );
   }, [sendNotification]);
 
   const sendGreenNotification = useCallback((velaFinal: string) => {
     sendNotification(
       '✅✅✅ GREEN - SSCASHOUT',
       `GREEN na vela ${velaFinal}! Parabéns!`,
     );
   }, [sendNotification]);
 
   return {
     isEnabled,
     permission,
     requestPermission,
     sendEntryNotification,
     sendGreenNotification,
   };
 };