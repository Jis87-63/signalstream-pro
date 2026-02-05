 import { initializeApp } from 'firebase/app';
 import { getDatabase, ref, onValue, Database } from 'firebase/database';
 
 const firebaseConfig = {
   apiKey: "AIzaSyA3uAHrQyJCSyIQzP8X3Uq7ukJ2lWy0tg8",
   authDomain: "bot-ia-20e75.firebaseapp.com",
   databaseURL: "https://bot-ia-20e75-default-rtdb.firebaseio.com",
   projectId: "bot-ia-20e75"
 };
 
 let app: ReturnType<typeof initializeApp> | null = null;
 let db: Database | null = null;
 
 export const getFirebaseDb = () => {
   if (!app) {
     app = initializeApp(firebaseConfig);
     db = getDatabase(app);
   }
   return db!;
 };
 
 export interface VelaData {
   timestamp: number;
   ultimaVela: string;
   maiorVela: string;
   totalVelas: number;
   velas: string[];
 }
 
 export const subscribeToVelas = (callback: (velas: string[]) => void) => {
   const db = getFirebaseDb();
   const velasRef = ref(db, 'historico-velas');
   
   return onValue(velasRef, (snapshot) => {
     const dados = snapshot.val();
     if (!dados) {
       callback([]);
       return;
     }
     
     // Get the most recent entry
     const entries = Object.values(dados) as VelaData[];
     const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
     const latest = sorted[0];
     
     if (latest?.velas) {
       callback(latest.velas.slice(0, 15));
     } else {
       callback([]);
     }
   });
 };