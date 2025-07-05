
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Brain, 
  Network, 
  Phone, 
  Server, 
  Activity, 
  Zap,
  Globe,
  Lock,
  Smartphone,
  Bot,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Cpu,
  BarChart3,
  Settings,
  Download,
  Github,
  Play,
  Pause,
  RefreshCw,
  Eye,
  MessageSquare,
  Headphones,
  Wifi,
  HardDrive,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { profile, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState({
    guardian: 'online',
    nexusAI: 'online',
    database: 'online',
    monitoring: 'online'
  });

  const [stats, setStats] = useState({
    activeDevices: 142,
    activeCalls: 28,
    aiQueries: 1847,
    uptime: '99.97%'
  });

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, type: 'info', message: 'Sistema iniciado com sucesso', time: '10:30' },
    { id: 2, type: 'warning', message: 'Dispositivo 192.168.1.100 com alta latência', time: '10:25' },
    { id: 3, type: 'success', message: 'Backup automático concluído', time: '10:20' },
    { id: 4, type: 'info', message: 'Nexus AI processou 150 consultas', time: '10:15' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Guardian VoIP v3.0
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-purple-300">Nexus AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-600 text-white">
                <Activity className="w-3 h-3 mr-1" />
                Sistema Online
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate('/system')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Dispositivos Ativos</p>
                  <p className="text-2xl font-bold text-white">{stats.activeDevices}</p>
                </div>
                <Network className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Chamadas Ativas</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCalls}</p>
                </div>
                <Phone className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Consultas IA</p>
                  <p className="text-2xl font-bold text-white">{stats.aiQueries}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Uptime</p>
                  <p className="text-2xl font-bold text-white">{stats.uptime}</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Status */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Server className="w-5 h-5 mr-2" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-300">Guardian VoIP</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.guardian)}>
                      {systemStatus.guardian}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-300">Nexus AI</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.nexusAI)}>
                      {systemStatus.nexusAI}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">Banco de Dados</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.database)}>
                      {systemStatus.database}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-yellow-400" />
                      <span className="text-slate-300">Monitoramento</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.monitoring)}>
                      {systemStatus.monitoring}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Modules */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="w-5 h-5 mr-2" />
                  Módulos do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="voip" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                    <TabsTrigger value="voip" className="data-[state=active]:bg-slate-600">VoIP</TabsTrigger>
                    <TabsTrigger value="ai" className="data-[state=active]:bg-slate-600">Nexus AI</TabsTrigger>
                    <TabsTrigger value="tools" className="data-[state=active]:bg-slate-600">Ferramentas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="voip" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian/monitoring')}
                      >
                        <Network className="w-6 h-6 mb-2 text-blue-400" />
                        <span className="text-xs">Monitoramento</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian/provisioning')}
                      >
                        <Phone className="w-6 h-6 mb-2 text-green-400" />
                        <span className="text-xs">Provisionamento</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian')}
                      >
                        <Globe className="w-6 h-6 mb-2 text-purple-400" />
                        <span className="text-xs">Blocos IP</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian/telephony')}
                      >
                        <Headphones className="w-6 h-6 mb-2 text-yellow-400" />
                        <span className="text-xs">Telefonia</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian')}
                      >
                        <HardDrive className="w-6 h-6 mb-2 text-orange-400" />
                        <span className="text-xs">Backup</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian')}
                      >
                        <MessageSquare className="w-6 h-6 mb-2 text-pink-400" />
                        <span className="text-xs">Suporte</span>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/nexus')}
                      >
                        <Brain className="w-6 h-6 mb-2 text-purple-400" />
                        <span className="text-xs">Orquestração</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/nexus')}
                      >
                        <Bot className="w-6 h-6 mb-2 text-blue-400" />
                        <span className="text-xs">Chat IA</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/nexus')}
                      >
                        <Cpu className="w-6 h-6 mb-2 text-green-400" />
                        <span className="text-xs">Análise Preditiva</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/nexus')}
                      >
                        <RefreshCw className="w-6 h-6 mb-2 text-yellow-400" />
                        <span className="text-xs">Auto-Correção</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/nexus')}
                      >
                        <Lock className="w-6 h-6 mb-2 text-red-400" />
                        <span className="text-xs">Detecção Fraude</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/nexus')}
                      >
                        <Eye className="w-6 h-6 mb-2 text-indigo-400" />
                        <span className="text-xs">Consenso IA</span>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="tools" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => window.open('https://github.com/zivianivr/guardian_lovable', '_blank')}
                      >
                        <Smartphone className="w-6 h-6 mb-2 text-blue-400" />
                        <span className="text-xs">App Mobile</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => window.open('https://github.com/zivianivr/guardian_lovable/releases', '_blank')}
                      >
                        <Download className="w-6 h-6 mb-2 text-green-400" />
                        <span className="text-xs">Desktop App</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => window.open('https://github.com/zivianivr/guardian_lovable', '_blank')}
                      >
                        <Github className="w-6 h-6 mb-2 text-gray-400" />
                        <span className="text-xs">GitHub</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/system')}
                      >
                        <Settings className="w-6 h-6 mb-2 text-purple-400" />
                        <span className="text-xs">Configurações</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian')}
                      >
                        <BarChart3 className="w-6 h-6 mb-2 text-yellow-400" />
                        <span className="text-xs">Relatórios</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                        onClick={() => navigate('/guardian/users')}
                      >
                        <Users className="w-6 h-6 mb-2 text-pink-400" />
                        <span className="text-xs">Usuários</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Eventos Recentes
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300">{event.message}</p>
                        <p className="text-xs text-slate-500">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="w-5 h-5 mr-2" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/nexus')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Consultar Nexus AI
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-600 hover:bg-slate-700"
                    onClick={() => navigate('/guardian/monitoring')}
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Analisar Dispositivo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-600 hover:bg-slate-700"
                    onClick={() => navigate('/guardian/provisioning')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Provisionar Telefone
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-600 hover:bg-slate-700"
                    onClick={() => navigate('/guardian')}
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    Backup Manual
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Status Banner */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Nexus AI - Sistema Ativo</h3>
                  <p className="text-purple-200">
                    Orquestrando 6 IAs • Consenso Ético Ativo • Auto-Correção Habilitada
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
                <span className="text-green-400 text-sm font-medium">Processando</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
