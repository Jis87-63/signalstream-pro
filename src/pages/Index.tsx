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
import { useFirebaseVelas } from '@/hooks/useFirebaseVelas';
import { useSignalLogic } from '@/hooks/useSignalLogic';
import { useModalSequence } from '@/hooks/useModalSequence';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const Index = () => {
  const { velas, isConnected } = useFirebaseVelas();
  const signal = useSignalLogic(velas);
  const { 
    closeModal, 
    showNotificationModal, 
    showWhatsAppModal, 
    showPremiumModal, 
    showAvisoModal 
  } = useModalSequence();
  const { requestPermission } = usePushNotifications();

  // Block context menu and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+Shift+C
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

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header isConnected={isConnected} />
      
      <main className="p-4 flex flex-col gap-4 max-w-[900px] mx-auto">
        <VelasCard velas={velas} isConnected={isConnected} />
        
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

      {/* Modals */}
      <NotificationModal 
        open={showNotificationModal} 
        onClose={closeModal}
        onAllow={requestPermission}
      />
      <WhatsAppModal 
        open={showWhatsAppModal} 
        onClose={closeModal} 
      />
      <BotPremiumModal 
        open={showPremiumModal} 
        onClose={closeModal} 
      />
      <AvisoModal 
        open={showAvisoModal} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default Index;
