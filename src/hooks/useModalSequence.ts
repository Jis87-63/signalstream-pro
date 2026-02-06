import { useState, useEffect, useCallback, useRef } from 'react';

type ModalType = 'notification' | 'aviso' | 'whatsapp' | 'premium' | null;

const MODAL_STORAGE_KEY = 'sscashout_modals_shown';
const PREMIUM_DELAY = 5 * 60 * 1000; // 5 minutos

export const useModalSequence = () => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const sessionStartRef = useRef(Date.now());
  const premiumTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar se os modais já foram mostrados nesta sessão
  useEffect(() => {
    if (hasInitialized) return;

    const modalsShown = sessionStorage.getItem(MODAL_STORAGE_KEY);
    
    if (!modalsShown) {
      // Primeira visita na sessão - mostrar modal de notificação após 2s
      const notificationPermission = Notification.permission;
      
      if (notificationPermission === 'default') {
        setTimeout(() => {
          setCurrentModal('notification');
        }, 2000);
      } else {
        // Notificações já configuradas, mostrar aviso
        setTimeout(() => {
          setCurrentModal('aviso');
        }, 2000);
      }
      
      sessionStorage.setItem(MODAL_STORAGE_KEY, 'true');
    }

    // Configurar timer para modal premium após 5 minutos
    premiumTimerRef.current = setTimeout(() => {
      if (currentModal === null) {
        setCurrentModal('premium');
      }
    }, PREMIUM_DELAY);

    setHasInitialized(true);

    return () => {
      if (premiumTimerRef.current) {
        clearTimeout(premiumTimerRef.current);
      }
    };
  }, [hasInitialized, currentModal]);

  const closeModal = useCallback(() => {
    const current = currentModal;
    setCurrentModal(null);
    
    // Sequência de modais
    if (current === 'notification') {
      // Após notificação, mostrar aviso (criar conta)
      setTimeout(() => setCurrentModal('aviso'), 500);
    } else if (current === 'aviso') {
      // Após aviso, mostrar whatsapp após 30s
      setTimeout(() => setCurrentModal('whatsapp'), 30000);
    } else if (current === 'whatsapp') {
      // Nada após whatsapp
    } else if (current === 'premium') {
      // Mostrar premium novamente após 3 minutos se ainda no site
      setTimeout(() => {
        const timeOnSite = Date.now() - sessionStartRef.current;
        if (timeOnSite > PREMIUM_DELAY) {
          setCurrentModal('premium');
        }
      }, 180000);
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
