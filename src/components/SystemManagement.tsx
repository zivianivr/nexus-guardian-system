
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Key, 
  Database, 
  Users, 
  Shield, 
  RefreshCw,
  Download,
  Upload,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Calendar,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  LogOut,
  Github
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  approvedAt?: string;
}

const SystemManagement = () => {
  const { toast } = useToast();
  const { profile, isSuperAdmin, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'rafael.ziviani@live.com',
      role: 'super_admin',
      status: 'approved',
      createdAt: '2024-01-01',
      approvedAt: '2024-01-01'
    },
    {
      id: '2',
      email: 'user@example.com',
      role: 'user',
      status: 'pending',
      createdAt: '2024-01-15'
    }
  ]);

  const [configs, setConfigs] = useState({
    geminiApiKey: '',
    openaiApiKey: '',
    claudeApiKey: '',
    grokApiKey: '',
    qwenApiKey: '',
    sunoApiKey: '',
    zabbixServer1Url: '',
    zabbixServer1User: '',
    zabbixServer1Pass: '',
    zabbixServer2Url: '',
    zabbixServer2User: '',
    zabbixServer2Pass: '',
    whatsappNumber: '',
    githubToken: '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',
    githubRepo: 'https://github.com/SEU_USUARIO/guardian-voip-v3.git'
  });

  const handleUpdateSystem = async () => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Apenas Super Administradores podem atualizar o sistema.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Chamar API para atualizar o sistema via GitHub
      const response = await fetch('/api/update-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Sistema Atualizado",
          description: "O sistema foi atualizado com sucesso do repositório GitHub!",
        });
      } else {
        throw new Error('Falha na atualização');
      }
    } catch (error) {
      toast({
        title: "Erro na Atualização",
        description: "Ocorreu um erro ao atualizar o sistema. Verifique os logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // Simular salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações Salvas",
        description: "Todas as configurações foram salvas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'approved', approvedAt: new Date().toISOString().split('T')[0] }
        : user
    ));
    
    toast({
      title: "Usuário Aprovado",
      description: "O usuário foi aprovado com sucesso!",
    });
  };

  const handleRejectUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Usuário Rejeitado",
      description: "O usuário foi rejeitado e removido do sistema.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'user':
        return <Badge className="bg-gray-100 text-gray-800">Usuário</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Gerenciamento do Sistema
              </h1>
              <p className="text-slate-400 mt-2">Configurações, usuários e atualizações do sistema</p>
              <p className="text-slate-500 text-sm mt-1">
                Logado como: <span className="text-blue-400">{profile?.full_name || profile?.email}</span>
                {isSuperAdmin && <span className="text-purple-400 ml-2">(Super Admin)</span>}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isSuperAdmin && (
                <Button 
                  onClick={handleUpdateSystem}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Github className="w-4 h-4 mr-2" />
                  )}
                  Atualizar Sistema
                </Button>
              )}
              <Button 
                onClick={signOut}
                variant="outline" 
                className="border-slate-600 hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Usuários Totais</p>
                  <p className="text-2xl font-bold text-blue-400">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {users.filter(u => u.status === 'pending').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Sistema</p>
                  <p className="text-2xl font-bold text-green-400">Online</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Versão</p>
                  <p className="text-2xl font-bold text-purple-400">v3.0</p>
                </div>
                <Server className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-slate-700">
              Configurações
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Users className="w-5 h-5 mr-2" />
                  Gerenciamento de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <User className="w-8 h-8 text-slate-400" />
                        <div>
                          <h3 className="font-semibold text-white">{user.email}</h3>
                          <p className="text-sm text-slate-400">
                            Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectUser(user.id)}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Key className="w-5 h-5 mr-2" />
                  Configurações de APIs e Integrações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* APIs de IA */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">APIs de Inteligência Artificial</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Google Gemini API Key</label>
                      <Input
                        type="password"
                        value={configs.geminiApiKey}
                        onChange={(e) => setConfigs({...configs, geminiApiKey: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Insira sua API Key do Gemini"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">OpenAI API Key</label>
                      <Input
                        type="password"
                        value={configs.openaiApiKey}
                        onChange={(e) => setConfigs({...configs, openaiApiKey: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Insira sua API Key do OpenAI"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Anthropic Claude API Key</label>
                      <Input
                        type="password"
                        value={configs.claudeApiKey}
                        onChange={(e) => setConfigs({...configs, claudeApiKey: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Insira sua API Key do Claude"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">xAI Grok API Key</label>
                      <Input
                        type="password"
                        value={configs.grokApiKey}
                        onChange={(e) => setConfigs({...configs, grokApiKey: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Insira sua API Key do Grok"
                      />
                    </div>
                  </div>

                  {/* Zabbix e GitHub */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Integrações</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Zabbix Server 1 URL</label>
                      <Input
                        value={configs.zabbixServer1Url}
                        onChange={(e) => setConfigs({...configs, zabbixServer1Url: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="http://zabbix1.example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">GitHub Token</label>
                      <Input
                        type="password"
                        value={configs.githubToken}
                        onChange={(e) => setConfigs({...configs, githubToken: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="ghp_xxxxxxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Repositório GitHub</label>
                      <Input
                        value={configs.githubRepo}
                        onChange={(e) => setConfigs({...configs, githubRepo: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="https://github.com/user/repo.git"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Number</label>
                      <Input
                        value={configs.whatsappNumber}
                        onChange={(e) => setConfigs({...configs, whatsappNumber: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="+5511999999999"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveConfig}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Settings className="w-4 h-4 mr-2" />
                    )}
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Server className="w-5 h-5 mr-2" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Status dos Serviços</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Guardian VoIP Backend</span>
                          <Badge className="bg-green-100 text-green-800">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Nexus AI Backend</span>
                          <Badge className="bg-green-100 text-green-800">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Banco de Dados</span>
                          <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Informações da Versão</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Versão Atual</span>
                          <span className="text-white">v3.0.0</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Última Atualização</span>
                          <span className="text-white">Hoje</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Uptime</span>
                          <span className="text-white">24 dias</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemManagement;
