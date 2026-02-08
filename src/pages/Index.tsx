import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { VelasCard } from '@/components/VelasCard';
import { EntryCard } from '@/components/EntryCard';
import { GameIframe } from '@/components/GameIframe';
import { Footer } from '@/components/Footer';
import { WhatsAppModal } from '@/components/modals/WhatsAppModal';
import { BotPremiumModal } from '@/components/modals/BotPremiumModal';
import { AvisoModal } from '@/components/modals/AvisoModal';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { ConnectionSuccessModal } from '@/components/modals/ConnectionSuccessModal';
import { useFirebaseVelas } from '@/hooks/useFirebaseVelas';
import { useSignalLogic } from '@/hooks/useSignalLogic';
import { useModalSequence } from '@/hooks/useModalSequence';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

const Index = () => {
  const { 
    closeModal, 
    showNotificationModal, 
    showWhatsAppModal, 
    showPremiumModal, 
    showAvisoModal,
    showConnectionModal,
    initialSequenceComplete,
    triggerConnectionModal
  } = useModalSequence();
  
  // Só conectar ao servidor DEPOIS que a sequência inicial de modais terminar
  const { 
    velas, 
    isConnected, 
    lastTimestamp, 
    connectionStatus,
    showConnectionSuccess,
    closeConnectionSuccess
  } = useFirebaseVelas(initialSequenceComplete);
  
  const signal = useSignalLogic(velas, lastTimestamp || undefined, isConnected);
  const { requestPermission } = usePushNotifications();
  const { trackAction } = useVisitorTracking();

  // Quando conectar com sucesso, mostrar modal de conexão
  useEffect(() => {
    if (showConnectionSuccess && !showConnectionModal) {
      triggerConnectionModal();
    }
  }, [showConnectionSuccess, showConnectionModal, triggerConnectionModal]);

  // Bloquear menu de contexto e atalhos de desenvolvedor
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
        (e.ctrlKey && e.keyCode === 85) ||
        (e.ctrlKey && e.keyCode === 83) ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 67)
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handler para fechar modal de conexão
  const handleCloseConnectionModal = () => {
    closeConnectionSuccess();
    closeModal();
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header isConnected={isConnected} />
      
      <main className="p-4 flex flex-col gap-4 max-w-[900px] mx-auto">
        <VelasCard 
          velas={velas} 
          isConnected={isConnected && signal.isServerActive} 
          connectionStatus={connectionStatus}
        />
        
        <EntryCard 
          aposde={signal.aposde}
          cashout={signal.cashout}
          tentativas={signal.tentativas}
          status={signal.status}
          velaFinal={signal.velaFinal}
        />
        
        <GameIframe />
        
        <Footer />
      </main>

      {/* Modais - ordem: Notificação → Aviso → Conexão → Premium → WhatsApp */}
      <NotificationModal 
        open={showNotificationModal} 
        onClose={closeModal}
        onAllow={requestPermission}
      />
      <AvisoModal 
        open={showAvisoModal} 
        onClose={closeModal}
        onTrackAction={trackAction}
      />
      
      {/* Modal de sucesso na conexão */}
      <ConnectionSuccessModal 
        open={showConnectionModal} 
        onClose={handleCloseConnectionModal} 
      />

      <WhatsAppModal 
        open={showWhatsAppModal} 
        onClose={closeModal}
        onTrackAction={trackAction}
      />
      <BotPremiumModal 
        open={showPremiumModal} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default Index;
