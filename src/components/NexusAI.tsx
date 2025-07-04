
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Send, 
  Mic, 
  Bot, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Code,
  Music,
  Eye,
  Cpu,
  Network,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Download,
  Copy,
  ExternalLink,
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';

interface AIProvider {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  specialty: string;
  weight: number;
  lastUsed: string;
  queries: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  aiProviders?: string[];
  confidence?: number;
}

const NexusAI = () => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [consensusMode, setConsensusMode] = useState(true);
  const [ethicalFilter, setEthicalFilter] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Nexus AI iniciado com sucesso. Sistema de consenso e alinhamento ético ativado.',
      timestamp: '10:30',
    },
    {
      id: '2',
      type: 'ai',
      content: 'Olá! Sou o Nexus AI, seu assistente de inteligência artificial hiperinteligente. Posso orquestrar múltiplas IAs para fornecer respostas validadas por consenso. Como posso ajudá-lo hoje?',
      timestamp: '10:30',
      aiProviders: ['Gemini', 'GPT-4', 'Claude'],
      confidence: 0.95
    }
  ]);

  const [aiProviders, setAiProviders] = useState<AIProvider[]>([
    {
      id: 'gemini',
      name: 'Google Gemini',
      status: 'active',
      specialty: 'Análise Geral',
      weight: 0.9,
      lastUsed: '2 min ago',
      queries: 1247
    },
    {
      id: 'gpt4',
      name: 'OpenAI GPT-4',
      status: 'active',
      specialty: 'Desenvolvimento',
      weight: 0.85,
      lastUsed: '3 min ago',
      queries: 1156
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      status: 'active',
      specialty: 'Ética e Análise',
      weight: 0.88,
      lastUsed: '1 min ago',
      queries: 892
    },
    {
      id: 'qwen',
      name: 'Alibaba Qwen',
      status: 'active',
      specialty: 'Processamento',
      weight: 0.75,
      lastUsed: '5 min ago',
      queries: 634
    },
    {
      id: 'grok',
      name: 'xAI Grok',
      status: 'active',
      specialty: 'Insights',
      weight: 0.80,
      lastUsed: '4 min ago',
      queries: 523
    },
    {
      id: 'suno',
      name: 'Suno AI',
      status: 'active',
      specialty: 'Geração de Música',
      weight: 0.70,
      lastUsed: '10 min ago',
      queries: 89
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsProcessing(true);

    // Simular processamento da IA
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: devMode 
          ? `Modo Desenvolvimento Ativado: Analisando sua solicitação "${message}" através de múltiplas IAs especializadas em código. Orquestrando Code Llama, AlphaCode e Copilot para fornecer uma solução completa com testes automatizados e análise de qualidade.`
          : `Processando sua consulta "${message}" através do sistema de consenso. Consultando ${consensusMode ? '6' : '3'} IAs simultaneamente para garantir precisão e alinhamento ético. ${ethicalFilter ? 'Filtro ético aplicado.' : ''}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        aiProviders: consensusMode ? ['Gemini', 'GPT-4', 'Claude', 'Qwen', 'Grok'] : ['Gemini', 'GPT-4', 'Claude'],
        confidence: 0.92
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Nexus AI
            </h1>
            <p className="text-slate-400 mt-2">Plataforma de Orquestração e Consenso Multi-IA</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-purple-300">6 IAs Conectadas</span>
            </div>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Sistema Online
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    Interface de Conversação
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Modo Desenvolvimento */}
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Modo Dev</span>
                      <Switch 
                        checked={devMode} 
                        onCheckedChange={setDevMode}
                      />
                    </div>
                    
                    {/* Consenso */}
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Consenso</span>
                      <Switch 
                        checked={consensusMode} 
                        onCheckedChange={setConsensusMode}
                      />
                    </div>
                    
                    {/* Filtro Ético */}
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Ético</span>
                      <Switch 
                        checked={ethicalFilter} 
                        onCheckedChange={setEthicalFilter}
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-6">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : msg.type === 'system'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-purple-600/20 border border-purple-500/30 text-white'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        
                        {msg.aiProviders && (
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {msg.aiProviders.map((provider) => (
                                <Badge key={provider} className="text-xs bg-purple-700 text-purple-100">
                                  {provider}
                                </Badge>
                              ))}
                            </div>
                            {msg.confidence && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-green-400">
                                  {(msg.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-2">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-purple-600/20 border border-purple-500/30 text-white p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                          <span className="text-sm">Nexus AI processando...</span>
                        </div>
                        {devMode && (
                          <p className="text-xs text-purple-300 mt-1">
                            Orquestrando IAs de desenvolvimento...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder={devMode ? "Digite sua solicitação de desenvolvimento..." : "Digite sua pergunta para o Nexus AI..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isProcessing}
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isProcessing || !message.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Providers Panel */}
          <div className="space-y-6">
            {/* AI Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Cpu className="w-5 h-5 mr-2" />
                  Status das IAs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiProviders.slice(0, 5).map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          provider.status === 'active' ? 'bg-green-400' : 
                          provider.status === 'inactive' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-white">{provider.name}</p>
                          <p className="text-xs text-slate-400">{provider.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white">{provider.queries}</p>
                        <p className="text-xs text-slate-400">queries</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Correction Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="w-5 h-5 mr-2" />
                  Auto-Correção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Sistema Ativo</span>
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Último Scan</span>
                      <span className="text-slate-400">2 min ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Correções Hoje</span>
                      <span className="text-green-400">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Status GitHub</span>
                      <Badge className="bg-blue-600 text-white text-xs">
                        Conectado
                      </Badge>
                    </div>
                  </div>

                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Executar Diagnóstico
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Settings className="w-5 h-5 mr-2" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Network className="w-4 h-4 mr-2" />
                    Analisar Sistema
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Code className="w-4 h-4 mr-2" />
                    Modo Desenvolvimento
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Music className="w-4 h-4 mr-2" />
                    Gerar Música
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Information Banner */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Nexus AI v3.0 - Sistema Hiperinteligente</h3>
                  <p className="text-purple-200">
                    Consenso Multi-IA • Alinhamento Ético • Auto-Correção • Desenvolvimento Assistido
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  6 IAs Ativas
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Ético
                </Badge>
                <Badge className="bg-purple-600 text-white">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Auto-Evolutivo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NexusAI;
