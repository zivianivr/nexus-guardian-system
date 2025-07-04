
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Network, 
  Phone, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Wifi,
  Server,
  Globe,
  User,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Signal,
  Zap
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  type: string;
  location: string;
  lastSeen: string;
  calls: number;
  uptime: string;
}

interface NetworkBlock {
  id: string;
  name: string;
  cidr: string;
  gateway: string;
  available: number;
  allocated: number;
  clients: string[];
}

const GuardianDashboard = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'SIP-001',
      ip: '192.168.1.10',
      status: 'online',
      type: 'Intelbras TIP 200',
      location: 'Recepção',
      lastSeen: '2 min ago',
      calls: 15,
      uptime: '99.5%'
    },
    {
      id: '2',
      name: 'SIP-002',
      ip: '192.168.1.11',
      status: 'warning',
      type: 'Grandstream GXP1625',
      location: 'Sala 1',
      lastSeen: '5 min ago',
      calls: 8,
      uptime: '87.2%'
    },
    {
      id: '3',
      name: 'SIP-003',
      ip: '192.168.1.12',
      status: 'offline',
      type: 'Intelbras TIP 300',
      location: 'Sala 2',
      lastSeen: '1 hour ago',
      calls: 0,
      uptime: '0%'
    }
  ]);

  const [networkBlocks, setNetworkBlocks] = useState<NetworkBlock[]>([
    {
      id: '1',
      name: 'Rede Principal',
      cidr: '192.168.1.0/24',
      gateway: '192.168.1.1',
      available: 200,
      allocated: 54,
      clients: ['Cliente A', 'Cliente B']
    },
    {
      id: '2',
      name: 'Rede VoIP',
      cidr: '10.10.10.0/24',
      gateway: '10.10.10.1',
      available: 150,
      allocated: 32,
      clients: ['Cliente C']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ip.includes(searchTerm) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeviceAnalysis = (device: Device) => {
    console.log(`Analyzing device ${device.name} with Nexus AI...`);
    // Aqui seria a integração com Nexus AI para análise do dispositivo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Guardian VoIP Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Monitoramento e gestão inteligente de dispositivos VoIP</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dispositivo
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Dispositivos Online</p>
                  <p className="text-2xl font-bold text-green-400">
                    {devices.filter(d => d.status === 'online').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Com Alertas</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {devices.filter(d => d.status === 'warning').length}
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
                  <p className="text-slate-400 text-sm">Offline</p>
                  <p className="text-2xl font-bold text-red-400">
                    {devices.filter(d => d.status === 'offline').length}
                  </p>
                </div>
                <Server className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Chamadas Ativas</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {devices.reduce((sum, d) => sum + d.calls, 0)}
                  </p>
                </div>
                <Phone className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="devices" className="data-[state=active]:bg-slate-700">
              Dispositivos
            </TabsTrigger>
            <TabsTrigger value="networks" className="data-[state=active]:bg-slate-700">
              Redes e IPs
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">
              Monitoramento
            </TabsTrigger>
            <TabsTrigger value="provisioning" className="data-[state=active]:bg-slate-700">
              Provisionamento
            </TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar dispositivos por nome, IP ou localização..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Devices Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Network className="w-5 h-5 mr-2" />
                  Dispositivos VoIP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
                        <div>
                          <h3 className="font-semibold text-white">{device.name}</h3>
                          <p className="text-sm text-slate-400">{device.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white">{device.ip}</p>
                          <p className="text-xs text-slate-400">{device.location}</p>
                        </div>
                        <Badge className={getStatusBadge(device.status)}>
                          {device.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">{device.calls}</p>
                          <p className="text-xs text-slate-400">Chamadas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">{device.uptime}</p>
                          <p className="text-xs text-slate-400">Uptime</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600 hover:bg-slate-700"
                            onClick={() => handleDeviceAnalysis(device)}
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            Analisar IA
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Networks Tab */}
          <TabsContent value="networks" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Gerenciamento de Blocos de IP
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Bloco
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkBlocks.map((block) => (
                    <div key={block.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white">{block.name}</h3>
                          <p className="text-sm text-slate-400">{block.cidr}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar Cliente
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-400">Gateway</p>
                          <p className="text-sm text-white">{block.gateway}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">IPs Disponíveis</p>
                          <p className="text-sm text-green-400">{block.available}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">IPs Alocados</p>
                          <p className="text-sm text-blue-400">{block.allocated}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-2">Clientes Alocados</p>
                        <div className="flex flex-wrap gap-2">
                          {block.clients.map((client, index) => (
                            <Badge key={index} className="bg-blue-600 text-white">
                              {client}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Activity className="w-5 h-5 mr-2" />
                  Monitoramento em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Gráficos de monitoramento serão implementados aqui</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Integração com Zabbix • Métricas em tempo real • Alertas inteligentes
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Provisioning Tab */}
          <TabsContent value="provisioning" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Settings className="w-5 h-5 mr-2" />
                  Provisionamento Automático
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Interface de provisionamento será implementada aqui</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Configuração automática • Suporte Intelbras/Grandstream • QR Code
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuardianDashboard;
