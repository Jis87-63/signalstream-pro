import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageCircle, 
  Signal, 
  CheckCircle2,
  XCircle,
  Activity
} from 'lucide-react';

interface Estatisticas {
  data: string;
  total_sinais: number;
  total_greens: number;
  total_loss: number;
  total_registros: number;
  total_visitantes: number;
  total_whatsapp: number;
}

interface VelaRecente {
  id: string;
  valor: number;
  servidor: string;
  created_at: string;
}

interface SinalRecente {
  id: string;
  apos_de: number;
  cashout: number;
  tentativas: number;
  resultado: string;
  vela_final: number | null;
  created_at: string;
}

const Monitor = () => {
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [velas, setVelas] = useState<VelaRecente[]>([]);
  const [sinais, setSinais] = useState<SinalRecente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Buscar estatísticas do dia
      const { data: statsData } = await supabase
        .from('estatisticas_diarias')
        .select('*')
        .eq('data', new Date().toISOString().split('T')[0])
        .single();

      if (statsData) {
        setStats(statsData);
      }

      // Buscar últimas 50 velas
      const { data: velasData } = await supabase
        .from('velas_historico')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (velasData) {
        setVelas(velasData);
      }

      // Buscar últimos 20 sinais
      const { data: sinaisData } = await supabase
        .from('sinais')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (sinaisData) {
        setSinais(sinaisData);
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const winRate = stats && stats.total_sinais > 0 
    ? ((stats.total_greens / stats.total_sinais) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            📊 Monitor SSCASHOUT
          </h1>
          <span className="text-sm text-muted-foreground">
            Atualizado em tempo real
          </span>
        </div>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Signal className="w-4 h-4" />
                Total Sinais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats?.total_sinais || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Greens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                {stats?.total_greens || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                {stats?.total_loss || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {winRate}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Visitantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats?.total_visitantes || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats?.total_whatsapp || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Registros */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Novos Registros Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              {stats?.total_registros || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Cliques em "Criar Conta" ou "Já Tenho Conta"
            </p>
          </CardContent>
        </Card>

        {/* Últimos Sinais */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>📈 Últimos Sinais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground">Horário</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Após</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Cashout</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Tent.</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Resultado</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Vela Final</th>
                  </tr>
                </thead>
                <tbody>
                  {sinais.map((sinal) => (
                    <tr key={sinal.id} className="border-b border-border/50">
                      <td className="py-2 px-3 text-foreground">
                        {new Date(sinal.created_at).toLocaleTimeString('pt-BR')}
                      </td>
                      <td className="py-2 px-3 text-foreground">{sinal.apos_de}x</td>
                      <td className="py-2 px-3 text-foreground">{sinal.cashout}x</td>
                      <td className="py-2 px-3 text-foreground">{sinal.tentativas}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sinal.resultado === 'green' 
                            ? 'bg-green-500/20 text-green-500' 
                            : sinal.resultado === 'loss'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {sinal.resultado?.toUpperCase() || 'AGUARDANDO'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-foreground">
                        {sinal.vela_final ? `${sinal.vela_final}x` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Últimas Velas */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>🕯️ Últimas Velas (Servidor 2)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {velas.map((vela) => (
                <div 
                  key={vela.id}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    vela.valor >= 2 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {vela.valor}x
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Monitor;
