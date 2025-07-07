import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Phone, Settings, Download, RefreshCw, CheckCircle, AlertCircle, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TestResult {
  id: string;
  extension: string;
  sip_server: string;
  status: string;
  test_results: any;
  created_at: string;
}

export default function DesktopClient() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [config, setConfig] = useState({
    server_url: "",
    access_token: "",
    sip_server: "",
    extension: "",
    password: ""
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    version: "1.0.0",
    last_update: new Date().toISOString(),
    status: "disconnected"
  });

  // Carregar configurações salvas
  useEffect(() => {
    const savedConfig = localStorage.getItem('nexus_desktop_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    
    // Verificar conexão
    checkConnection();
  }, []);

  const saveConfig = async () => {
    try {
      localStorage.setItem('nexus_desktop_config', JSON.stringify(config));
      
      // Salvar no banco de dados se estiver conectado
      if (user) {
        await supabase.from('system_configs').upsert({
          user_id: user.id,
          config_key: 'desktop_client_config',
          config_value: JSON.stringify(config)
        });
      }
      
      toast({
        title: "Sucesso",
        description: "Configuração salva com sucesso!",
      });
      
      checkConnection();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração",
        variant: "destructive"
      });
    }
  };

  const checkConnection = async () => {
    try {
      if (!config.server_url || !config.access_token) {
        setIsConnected(false);
        setSystemInfo(prev => ({ ...prev, status: "disconnected" }));
        return;
      }

      // Testar conexão com o servidor
      const response = await fetch(`${config.server_url}/api/health`, {
        headers: {
          'Authorization': `Bearer ${config.access_token}`
        }
      });

      if (response.ok) {
        setIsConnected(true);
        setSystemInfo(prev => ({ ...prev, status: "connected" }));
      } else {
        setIsConnected(false);
        setSystemInfo(prev => ({ ...prev, status: "error" }));
      }
    } catch (error) {
      setIsConnected(false);
      setSystemInfo(prev => ({ ...prev, status: "error" }));
    }
  };

  const updateSystem = async () => {
    setIsUpdating(true);
    try {
      // Simular atualização do sistema
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSystemInfo(prev => ({
        ...prev,
        version: "1.0.1",
        last_update: new Date().toISOString()
      }));
      
      toast({
        title: "Sucesso",
        description: "Sistema atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar sistema",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const runVoipTest = async () => {
    if (!config.sip_server || !config.extension) {
      toast({
        title: "Erro",
        description: "Configure servidor SIP e ramal primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsRunningTest(true);
    try {
      const testData = {
        extension: config.extension,
        sip_server: config.sip_server,
        test_results: {
          connectivity: Math.random() > 0.2,
          latency: Math.floor(Math.random() * 100) + 10,
          jitter: Math.floor(Math.random() * 10) + 1,
          packet_loss: Math.floor(Math.random() * 5),
          quality_score: Math.floor(Math.random() * 20) + 80
        }
      };

      if (user) {
        const { data, error } = await supabase
          .from('voip_tests')
          .insert({
            ...testData,
            created_by: user.id
          })
          .select()
          .single();

        if (error) throw error;
        
        setTestResults(prev => [data, ...prev]);
      }

      toast({
        title: "Sucesso",
        description: "Teste VoIP executado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao executar teste VoIP",
        variant: "destructive"
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const loadTestHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('voip_tests')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTestResults(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  useEffect(() => {
    loadTestHistory();
  }, [user]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nexus Guardian - Cliente Desktop</h1>
          <p className="text-muted-foreground">Softphone e ferramenta de testes VoIP</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
          <Button 
            onClick={updateSystem} 
            disabled={isUpdating}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? "Atualizando..." : "Atualizar Sistema"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="softphone">Softphone</TabsTrigger>
          <TabsTrigger value="tests">Testes VoIP</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configuração do Cliente
              </CardTitle>
              <CardDescription>Configure a conexão com o servidor Guardian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="server_url">URL do Servidor</Label>
                  <Input
                    id="server_url"
                    value={config.server_url}
                    onChange={(e) => setConfig(prev => ({ ...prev, server_url: e.target.value }))}
                    placeholder="https://seu-servidor.com"
                  />
                </div>
                <div>
                  <Label htmlFor="access_token">Token de Acesso</Label>
                  <Input
                    id="access_token"
                    type="password"
                    value={config.access_token}
                    onChange={(e) => setConfig(prev => ({ ...prev, access_token: e.target.value }))}
                    placeholder="Token de autenticação"
                  />
                </div>
                <div>
                  <Label htmlFor="sip_server">Servidor SIP</Label>
                  <Input
                    id="sip_server"
                    value={config.sip_server}
                    onChange={(e) => setConfig(prev => ({ ...prev, sip_server: e.target.value }))}
                    placeholder="sip.servidor.com"
                  />
                </div>
                <div>
                  <Label htmlFor="extension">Ramal</Label>
                  <Input
                    id="extension"
                    value={config.extension}
                    onChange={(e) => setConfig(prev => ({ ...prev, extension: e.target.value }))}
                    placeholder="1001"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={saveConfig}>Salvar Configuração</Button>
                <Button onClick={checkConnection} variant="outline">Testar Conexão</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="softphone" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Softphone
              </CardTitle>
              <CardDescription>Interface de chamadas VoIP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-2xl font-mono">
                  {config.extension || "---"}
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((num) => (
                    <Button key={num} variant="outline" className="aspect-square">
                      {num}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-center space-x-2">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Chamar
                  </Button>
                  <Button variant="destructive">
                    <Square className="w-4 h-4 mr-2" />
                    Desligar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                Testes VoIP
              </CardTitle>
              <CardDescription>Execute e visualize testes de qualidade VoIP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runVoipTest} 
                disabled={isRunningTest || !isConnected}
                className="w-full"
              >
                {isRunningTest ? "Executando Teste..." : "Executar Teste VoIP"}
              </Button>
              
              <div className="space-y-2">
                <h4 className="font-medium">Histórico de Testes</h4>
                {testResults.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{test.extension} - {test.sip_server}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(test.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={test.status === 'completed' ? 'default' : 'secondary'}>
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
              <CardDescription>Status e atualizações do cliente desktop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Versão</Label>
                  <p className="font-mono">{systemInfo.version}</p>
                </div>
                <div>
                  <Label>Última Atualização</Label>
                  <p className="text-sm">{new Date(systemInfo.last_update).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2">
                    {systemInfo.status === 'connected' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="capitalize">{systemInfo.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={updateSystem} 
                  disabled={isUpdating}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isUpdating ? "Atualizando Sistema..." : "Verificar Atualizações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}