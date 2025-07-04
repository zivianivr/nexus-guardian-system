
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Server, Users, Phone, AlertTriangle, CheckCircle } from "lucide-react";

interface MonitoringData {
  servers: { name: string; status: string; load: number }[];
  calls: { active: number; total: number; failed: number };
  users: { online: number; total: number };
  alerts: { type: string; message: string; time: string }[];
}

export default function GuardianMonitoring() {
  const [data, setData] = useState<MonitoringData>({
    servers: [
      { name: "SIP Server 1", status: "online", load: 45 },
      { name: "SIP Server 2", status: "online", load: 62 },
      { name: "Media Server", status: "warning", load: 78 },
      { name: "Database", status: "online", load: 32 }
    ],
    calls: { active: 145, total: 1250, failed: 8 },
    users: { online: 234, total: 456 },
    alerts: [
      { type: "warning", message: "High CPU usage on Media Server", time: "2 min ago" },
      { type: "info", message: "System backup completed", time: "1 hour ago" },
      { type: "error", message: "Failed call attempt detected", time: "3 min ago" }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(prev => ({
      ...prev,
      calls: {
        ...prev.calls,
        active: Math.floor(Math.random() * 200) + 100
      }
    }));
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento</h1>
          <p className="text-muted-foreground">Status em tempo real do sistema Guardian VoIP</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading}>
          <Activity className="mr-2 h-4 w-4" />
          {isLoading ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamadas Ativas</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.calls.active}</div>
            <p className="text-xs text-muted-foreground">
              {data.calls.total} total hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.users.online}</div>
            <p className="text-xs text-muted-foreground">
              de {data.users.total} usuários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamadas Falhadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.calls.failed}</div>
            <p className="text-xs text-muted-foreground">
              nas últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              Todos os serviços
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Servidores */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Servidores</CardTitle>
          <CardDescription>Monitoramento em tempo real dos servidores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.servers.map((server, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Server className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{server.name}</p>
                    <p className="text-sm text-muted-foreground">Load: {server.load}%</p>
                  </div>
                </div>
                <Badge variant={server.status === 'online' ? 'default' : 'destructive'}>
                  {server.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Recentes</CardTitle>
          <CardDescription>Últimas notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  alert.type === 'error' ? 'bg-red-500' : 
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
