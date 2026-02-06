import { useState, useEffect, useCallback, useRef } from 'react';

type ModalType = 'notification' | 'aviso' | 'whatsapp' | 'premium' | null;

const MODAL_STORAGE_KEY = 'sscashout_modals_shown';
const PREMIUM_DELAY = 5 * 60 * 1000; // 5 minutos
const WHATSAPP_DELAY = 3 * 60 * 1000; // 3 minutos após premium

export const useModalSequence = () => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const sessionStartRef = useRef(Date.now());
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  // Sequência inicial ao entrar no site
  useEffect(() => {
    if (hasInitialized) return;

    const modalsShown = sessionStorage.getItem(MODAL_STORAGE_KEY);
    
    if (!modalsShown) {
      // Primeira visita na sessão - mostrar modal de notificação após 2s
      const notificationPermission = Notification.permission;
      
      if (notificationPermission === 'default') {
        const timer = setTimeout(() => {
          setCurrentModal('notification');
        }, 2000);
        timersRef.current.push(timer);
      } else {
        // Notificações já configuradas, mostrar aviso
        const timer = setTimeout(() => {
          setCurrentModal('aviso');
        }, 2000);
        timersRef.current.push(timer);
      }
      
      sessionStorage.setItem(MODAL_STORAGE_KEY, 'true');
    }

    // Configurar timer para modal premium após 5 minutos
    const premiumTimer = setTimeout(() => {
      setCurrentModal('premium');
    }, PREMIUM_DELAY);
    timersRef.current.push(premiumTimer);

    setHasInitialized(true);

    return () => clearAllTimers();
  }, [hasInitialized]);

  const closeModal = useCallback(() => {
    const current = currentModal;
    setCurrentModal(null);
    
    // Sequência de modais
    if (current === 'notification') {
      // Após notificação, mostrar aviso (criar conta) após 500ms
      const timer = setTimeout(() => setCurrentModal('aviso'), 500);
      timersRef.current.push(timer);
    } else if (current === 'aviso') {
      // Nada imediato após aviso - premium virá pelo timer de 5 min
    } else if (current === 'premium') {
      // Após premium, mostrar whatsapp após 3 minutos
      const timer = setTimeout(() => {
        setCurrentModal('whatsapp');
      }, WHATSAPP_DELAY);
      timersRef.current.push(timer);
    } else if (current === 'whatsapp') {
      // Após whatsapp, mostrar premium novamente após 5 minutos
      const timer = setTimeout(() => {
        setCurrentModal('premium');
      }, PREMIUM_DELAY);
      timersRef.current.push(timer);
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
