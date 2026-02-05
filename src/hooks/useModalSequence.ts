 import { useState, useEffect, useCallback } from 'react';
 
 type ModalType = 'notification' | 'whatsapp' | 'aviso' | 'premium' | null;
 
 export const useModalSequence = () => {
   const [currentModal, setCurrentModal] = useState<ModalType>(null);
   const [hasSeenNotificationModal, setHasSeenNotificationModal] = useState(false);
 
   // Show notification modal first after 3 seconds
   useEffect(() => {
     if (hasSeenNotificationModal) return;
     
     const notificationPermission = Notification.permission;
     
     // Only show if notifications not already granted or denied
     if (notificationPermission === 'default') {
       const timeout = setTimeout(() => {
         setCurrentModal('notification');
         setHasSeenNotificationModal(true);
       }, 3000);
       return () => clearTimeout(timeout);
     } else {
       setHasSeenNotificationModal(true);
       // Show whatsapp modal after 10 seconds
       const timeout = setTimeout(() => {
         setCurrentModal('whatsapp');
       }, 10000);
       return () => clearTimeout(timeout);
     }
   }, [hasSeenNotificationModal]);
 
   const closeModal = useCallback(() => {
     const current = currentModal;
     setCurrentModal(null);
     
     // Schedule next modal based on current
     switch (current) {
       case 'notification':
         setTimeout(() => setCurrentModal('whatsapp'), 10000);
         break;
       case 'whatsapp':
         setTimeout(() => setCurrentModal('premium'), 40000);
         break;
       case 'premium':
         setTimeout(() => setCurrentModal('aviso'), 60000);
         break;
       case 'aviso':
         setTimeout(() => setCurrentModal('whatsapp'), 180000);
         break;
     }
   }, [currentModal]);
 
   return {
     currentModal,
     closeModal,
     showNotificationModal: currentModal === 'notification',
     showWhatsAppModal: currentModal === 'whatsapp',
     showPremiumModal: currentModal === 'premium',
     showAvisoModal: currentModal === 'aviso',
   };
 };