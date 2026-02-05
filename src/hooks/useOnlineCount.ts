 import { useState, useEffect } from 'react';
 
 export const useOnlineCount = () => {
   const [count, setCount] = useState(0);
 
   useEffect(() => {
     // Generate random count between 100-200+
     const generateCount = () => {
       const base = Math.floor(Math.random() * 101) + 100; // 100-200
       const extra = Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0; // Sometimes add extra
       return base + extra;
     };
 
     setCount(generateCount());
 
     // Update every 30-60 seconds
     const interval = setInterval(() => {
       setCount(prev => {
         const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
         const newCount = prev + change;
         return Math.max(100, Math.min(250, newCount));
       });
     }, Math.random() * 30000 + 30000);
 
     return () => clearInterval(interval);
   }, []);
 
   return count;
 };