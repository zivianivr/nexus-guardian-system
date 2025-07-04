
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Database, 
  Shield, 
  Key, 
  Server,
  GitBranch,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Mail,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  HardDrive,
  Cpu,
  Network,
  Activity
} from 'lucide-react';

interface ConfigItem {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'password' | 'boolean' | 'number';
  category: string;
  description: string;
  sensitive?: boolean;
}

const SystemManagement = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [configs, setConfigs] = useState<ConfigItem[]>([
    // API Keys
    {
      id: 'gemini_key',
      name: 'Google Gemini API Key',
      value: 'AIzaSyD***************************',
      type: 'password',
      category: 'apis',
      description: 'Chave de API para Google Gemini',
      sensitive: true
    },
    {
      id: 'openai_key',
      name: 'OpenAI API Key',
      value: 'sk-proj-***************************',
      type: 'password',
      category: 'apis',
      description: 'Chave de API para OpenAI GPT',
      sensitive: true
    },
    {
      id: 'claude_key',
      name: 'Anthropic Claude API Key',
      value: 'sk-ant-***************************',
      type: 'password',
      category: 'apis',
      description: 'Chave de API para Anthropic Claude',
      sensitive: true
    },
    
    // Zabbix
    {
      id: 'zabbix1_url',
      name: 'Zabbix Server 1 URL',
      value: 'https://zabbix1.example.com',
      type: 'text',
      category: 'monitoring',
      description: 'URL do primeiro servidor Zabbix'
    },
    {
      id: 'zabbix1_user',
      name: 'Zabbix Server 1 User',
      value: 'admin',
      type: 'text',
      category: 'monitoring',
      description: 'Usuário do primeiro servidor Zabbix'
    },
    {
      id: 'zabbix1_pass',
      name: 'Zabbix Server 1 Password',
      value: '************',
      type: 'password',
      category: 'monitoring',
      description: 'Senha do primeiro servidor Zabbix',
      sensitive: true
    },

    // Sistema
    {
      id: 'backup_enabled',
      name: 'Backup Automático',
      value: 'true',
      type: 'boolean',
      category: 'system',
      description: 'Habilitar backup automático diário'
    },
    {
      id: 'auto_update',
      name: 'Auto-atualização',
      value: 'true',
      type: 'boolean',
      category: 'system',
      description: 'Habilitar auto-atualização via Git'
    },
    {
      id: 'github_repo',
      name: 'Repositório GitHub',
      value: 'https://github.com/user/guardian-voip-v3',
      type: 'text',
      category: 'system',
      description: 'URL do repositório GitHub para atualizações'
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    uptime: '7 dias, 14 horas',
    lastBackup: '2024-07-04 02:00:00',
    diskUsage: '45%',
    memoryUsage: '68%',
    cpuUsage: '23%',
    activeConnections: 142,
    lastUpdate: '2024-07-03 15:30:00'
  });

  const [logs, setLogs] = useState([
    { id: 1, type: 'info', message: 'Sistema iniciado com sucesso', timestamp: '2024-07-04 10:30:00' },
    { id: 2, type: 'warning', message: 'Alta utilização de CPU detectada', timestamp: '2024-07-04 10:25:00' },
    { id: 3, type: 'success', message: 'Backup automático concluído', timestamp: '2024-07-04 02:00:00' },
    { id: 4, type: 'info', message: 'Nexus AI: Auto-correção executada', timestamp: '2024-07-04 01:45:00' },
    { id: 5, type: 'error', message: 'Falha na conexão com API externa', timestamp: '2024-07-04 01:30:00' }
  ]);

  const handleConfigUpdate = (id: string, value: string) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, value } : config
    ));
  };

  const handleSystemUpdate = () => {
    console.log('Executando atualização do sistema...');
    // Aqui seria implementada a lógica de atualização via Git
  };

  const handleBackup = () => {
    console.log('Executando backup manual...');
    // Aqui seria implementada a lógica de backup
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const renderConfigValue = (config: ConfigItem) => {
    if (config.type === 'boolean') {
      return (
        <Switch 
          checked={config.value === 'true'} 
          onCheckedChange={(checked) => handleConfigUpdate(config.id, checked.toString())}
        />
      );
    }

    if (config.type === 'password' && config.sensitive) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            type={showPasswords ? 'text' : 'password'}
            value={config.value}
            onChange={(e) => handleConfigUpdate(config.id, e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      );
    }

    return (
      <Input
        type={config.type}
        value={config.value}
        onChange={(e) => handleConfigUpdate(config.id, e.target.value)}
        className="bg-slate-700 border-slate-600 text-white"
      />
    );
  };

  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, ConfigItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gerenciamento do Sistema
            </h1>
            <p className="text-slate-400 mt-2">Configurações, monitoramento e manutenção</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleSystemUpdate} className="bg-blue-600 hover:bg-blue-700">
              <GitBranch className="w-4 h-4 mr-2" />
              Atualizar Sistema
            </Button>
            <Button onClick={handleBackup} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <HardDrive className="w-4 h-4 mr-2" />
              Backup Manual
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Uptime</p>
                  <p className="text-lg font-bold text-white">{systemStats.uptime}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">CPU</p>
                  <p className="text-lg font-bold text-white">{systemStats.cpuUsage}</p>
                </div>
                <Cpu className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Memória</p>
                  <p className="text-lg font-bold text-white">{systemStats.memoryUsage}</p>
                </div>
                <Database className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Disco</p>
                  <p className="text-lg font-bold text-white">{systemStats.diskUsage}</p>
                </div>
                <HardDrive className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Configurações do Sistema
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="show-passwords" className="text-sm">Mostrar Senhas</Label>
                    <Switch 
                      id="show-passwords"
                      checked={showPasswords} 
                      onCheckedChange={setShowPasswords}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="apis" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                    <TabsTrigger value="apis" className="data-[state=active]:bg-slate-600">APIs</TabsTrigger>
                    <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-600">Monitoramento</TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-slate-600">Sistema</TabsTrigger>
                    <TabsTrigger value="backup" className="data-[state=active]:bg-slate-600">Backup</TabsTrigger>
                  </TabsList>

                  <TabsContent value="apis" className="mt-6 space-y-4">
                    {groupedConfigs.apis?.map((config) => (
                      <div key={config.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">{config.name}</Label>
                          {config.sensitive && (
                            <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                              <Lock className="w-3 h-3 mr-1" />
                              Sensível
                            </Badge>
                          )}
                        </div>
                        {renderConfigValue(config)}
                        <p className="text-xs text-slate-400">{config.description}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="monitoring" className="mt-6 space-y-4">
                    {groupedConfigs.monitoring?.map((config) => (
                      <div key={config.id} className="space-y-2">
                        <Label className="text-white">{config.name}</Label>
                        {renderConfigValue(config)}
                        <p className="text-xs text-slate-400">{config.description}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="system" className="mt-6 space-y-4">
                    {groupedConfigs.system?.map((config) => (
                      <div key={config.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">{config.name}</Label>
                          {config.type === 'boolean' && renderConfigValue(config)}
                        </div>
                        {config.type !== 'boolean' && renderConfigValue(config)}
                        <p className="text-xs text-slate-400">{config.description}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="backup" className="mt-6 space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">Status do Backup</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Último Backup</span>
                            <span className="text-white">{systemStats.lastBackup}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Backup Automático</span>
                            <Badge className="bg-green-600 text-white">Ativo</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Retenção</span>
                            <span className="text-white">7 dias</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <Button onClick={handleBackup} className="bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Executar Backup
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Upload className="w-4 h-4 mr-2" />
                          Restaurar Backup
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* System Logs */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Logs do Sistema
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                      {getLogIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300">{log.message}</p>
                        <p className="text-xs text-slate-500">{log.timestamp}</p>
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
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Ações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reiniciar Serviços
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Configurações
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Configurações
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Logs Completos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Auto-Correction Status */}
        <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600/20 rounded-full">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Sistema de Auto-Correção Ativo</h3>
                  <p className="text-green-200">
                    Monitoramento contínuo • GitHub integrado • Correção automática por IA
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operacional
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  <GitBranch className="w-3 h-3 mr-1" />
                  Git Sync
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemManagement;
