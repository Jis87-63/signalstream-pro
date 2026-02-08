import { useState, useEffect, useCallback, useRef } from 'react';

type ModalType = 'notification' | 'aviso' | 'whatsapp' | 'premium' | 'connection' | null;

const PREMIUM_DELAY = 5 * 60 * 1000; // 5 minutos
const WHATSAPP_DELAY = 3 * 60 * 1000; // 3 minutos após premium

export const useModalSequence = () => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [initialSequenceComplete, setInitialSequenceComplete] = useState(false);

  // IMPORTANT: useRef para não disparar cleanup por mudança de estado.
  const hasInitializedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  // Sequência inicial - Notificação primeiro, depois Aviso
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

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

    return () => clearAllTimers();
  }, []);

  const closeModal = useCallback(() => {
    const current = currentModal;
    setCurrentModal(null);

    // Sequência de modais iniciais
    if (current === 'notification') {
      // Após notificação, mostrar aviso (criar conta) após 500ms
      const timer = setTimeout(() => setCurrentModal('aviso'), 500);
      timersRef.current.push(timer);
    } else if (current === 'aviso') {
      // Após aviso, marcar sequência inicial como completa
      // Isso vai disparar a conexão com o servidor
      setInitialSequenceComplete(true);
    } else if (current === 'connection') {
      // Após modal de conexão, configurar timer para premium
      const premiumTimer = setTimeout(() => {
        setCurrentModal('premium');
      }, PREMIUM_DELAY);
      timersRef.current.push(premiumTimer);
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

  // Função para mostrar modal de conexão (chamada pelo hook de velas)
  const showConnectionModal = useCallback(() => {
    setCurrentModal('connection');
  }, []);

  return {
    currentModal,
    closeModal,
    showNotificationModal: currentModal === 'notification',
    showWhatsAppModal: currentModal === 'whatsapp',
    showPremiumModal: currentModal === 'premium',
    showAvisoModal: currentModal === 'aviso',
    showConnectionModal: currentModal === 'connection',
    initialSequenceComplete,
    triggerConnectionModal: showConnectionModal,
  };
};
