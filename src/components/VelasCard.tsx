import { CheckCircle2, XCircle, Loader2, Server } from 'lucide-react';
import { ConnectionStatus } from '@/hooks/useFirebaseVelas';

interface VelasCardProps {
  velas: string[];
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
}

const getVelaColor = (value: number) => {
  if (value >= 10) return 'vela-pill-pink';
  if (value >= 2) return 'vela-pill-purple';
  return 'vela-pill-blue';
};

const getConnectionDisplay = (status: ConnectionStatus, isConnected: boolean) => {
  switch (status) {
    case 'checking':
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin text-accent" />,
        text: 'Verificando servidor',
        showDots: true,
      };
    case 'server1':
      return {
        icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
        text: 'Servidor ativo',
        showDots: false,
      };
    case 'offline':
      return {
        icon: <XCircle className="w-4 h-4 text-destructive" />,
        text: 'Servidor offline',
        showDots: false,
      };
    default:
      return {
        icon: <Server className="w-4 h-4 text-muted-foreground" />,
        text: 'Aguardando',
        showDots: true,
      };
  }
};

export const VelasCard = ({ velas, isConnected, connectionStatus }: VelasCardProps) => {
  const displayVelas = velas.slice(0, 4);
  const display = getConnectionDisplay(connectionStatus, isConnected);
  const isAnalyzing = isConnected && connectionStatus === 'server1';

  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2 text-sm">
        {display.icon}
        <span className="text-muted-foreground">{display.text}</span>
        {display.showDots && (
          <span className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold mb-3">
        <span className="flex items-center gap-2 text-accent">
          {isAnalyzing ? (
            <>
              <span className="ping-dot" />
              <span>Analisando velas</span>
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </>
          ) : connectionStatus === 'offline' ? (
            <span className="text-destructive">Sem conexão com servidor</span>
          ) : (
            <span className="text-warning">Aguardando conexão...</span>
          )}
        </span>
      </h3>
      
      <ul className="flex gap-2 flex-wrap">
        {displayVelas.length > 0 ? (
          displayVelas.map((vela, index) => {
            const value = parseFloat(vela);
            const colorClass = getVelaColor(value);
            return (
              <li 
                key={index}
                className={`vela-pill ${colorClass}`}
              >
                {value.toFixed(2)}x
              </li>
            );
          })
        ) : (
          <li className="text-muted-foreground text-sm">
            {connectionStatus === 'offline' 
              ? 'Tentando reconectar...' 
              : 'Aguardando velas do servidor...'}
          </li>
        )}
      </ul>
    </div>
  );
};
