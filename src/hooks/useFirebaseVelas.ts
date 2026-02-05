 import { useState, useEffect } from 'react';
 import { subscribeToVelas } from '@/lib/firebase';
 
 export const useFirebaseVelas = () => {
   const [velas, setVelas] = useState<string[]>([]);
   const [isConnected, setIsConnected] = useState(false);
   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
 
   useEffect(() => {
     const unsubscribe = subscribeToVelas((newVelas) => {
       setVelas(newVelas);
       setIsConnected(true);
       setLastUpdate(new Date());
     });
 
     return () => {
       if (unsubscribe) {
         unsubscribe();
       }
     };
   }, []);
 
   return { velas, isConnected, lastUpdate };
 };