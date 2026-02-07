import { useState, useEffect, useCallback, useRef } from 'react';

type ModalType = 'notification' | 'aviso' | 'whatsapp' | 'premium' | null;

const PREMIUM_DELAY = 5 * 60 * 1000; // 5 minutos
const WHATSAPP_DELAY = 3 * 60 * 1000; // 3 minutos após premium

export const useModalSequence = () => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const _sessionStartRef = useRef(Date.now()); // Mantido para preservar ordem dos hooks
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  // Sequência inicial - SEMPRE ao entrar no site
  useEffect(() => {
    if (hasInitialized) return;
    
    // Marca como inicializado PRIMEIRO para evitar múltiplas execuções
    setHasInitialized(true);

    const timer = setTimeout(() => {
      let permission: NotificationPermission = 'default';

      try {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          permission = window.Notification.permission;
        }
      } catch {
        // Ignora erro silenciosamente
      }

      // Se NÃO permitiu notificações, mostrar o modal de permissão primeiro
      if (permission !== 'granted') {
        setCurrentModal('notification');
      } else {
        setCurrentModal('aviso');
      }
    }, 2000);

    timersRef.current.push(timer);

    // Configurar timer para modal premium após 5 minutos
    const premiumTimer = setTimeout(() => {
      setCurrentModal('premium');
    }, PREMIUM_DELAY);
    timersRef.current.push(premiumTimer);

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
