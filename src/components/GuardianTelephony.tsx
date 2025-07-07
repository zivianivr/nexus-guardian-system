
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, PhoneOff, Clock, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Call {
  id: string;
  from: string;
  to: string;
  duration: string;
  status: string;
  timestamp: string;
}

export default function GuardianTelephony() {
  const navigate = useNavigate();
  const [calls, setCalls] = useState<Call[]>([
    { id: "1", from: "1001", to: "1002", duration: "00:02:34", status: "completed", timestamp: "12:30:15" },
    { id: "2", from: "1003", to: "1001", duration: "00:01:45", status: "completed", timestamp: "12:28:42" },
    { id: "3", from: "1002", to: "1004", duration: "00:00:00", status: "missed", timestamp: "12:25:10" },
    { id: "4", from: "1001", to: "1003", duration: "00:05:23", status: "active", timestamp: "12:32:18" },
  ]);

  const [testCall, setTestCall] = useState({
    from: "",
    to: ""
  });

  const [isTestingCall, setIsTestingCall] = useState(false);

  const makeTestCall = async () => {
    if (!testCall.from || !testCall.to) return;

    setIsTestingCall(true);
    
    // Simular chamada de teste
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCall: Call = {
      id: Date.now().toString(),
      from: testCall.from,
      to: testCall.to,
      duration: "00:00:15",
      status: "completed",
      timestamp: new Date().toLocaleTimeString()
    };

    setCalls(prev => [newCall, ...prev]);
    setTestCall({ from: "", to: "" });
    setIsTestingCall(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'missed': return 'bg-red-500';
      case 'failed': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PhoneCall className="h-4 w-4" />;
      case 'completed': return <Phone className="h-4 w-4" />;
      case 'missed': return <PhoneOff className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Telefonia</h1>
            <p className="text-muted-foreground">Gerenciamento de chamadas e testes</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamadas Ativas</CardTitle>
            <PhoneCall className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {calls.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {calls.filter(c => c.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perdidas</CardTitle>
            <PhoneOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {calls.filter(c => c.status === 'missed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calls.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Teste de Chamada */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Chamada</CardTitle>
          <CardDescription>Realize um teste de chamada entre ramais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="from">De (Ramal)</Label>
              <Input
                id="from"
                value={testCall.from}
                onChange={(e) => setTestCall(prev => ({ ...prev, from: e.target.value }))}
                placeholder="Ex: 1001"
              />
            </div>
            <div>
              <Label htmlFor="to">Para (Ramal)</Label>
              <Input
                id="to"
                value={testCall.to}
                onChange={(e) => setTestCall(prev => ({ ...prev, to: e.target.value }))}
                placeholder="Ex: 1002"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={makeTestCall} disabled={isTestingCall} className="w-full">
                {isTestingCall ? "Testando..." : "Fazer Teste"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chamadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Histórico de Chamadas
          </CardTitle>
          <CardDescription>Últimas chamadas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(call.status)}`}>
                    {getStatusIcon(call.status)}
                  </div>
                  <div>
                    <p className="font-medium">{call.from} → {call.to}</p>
                    <p className="text-sm text-muted-foreground">
                      {call.timestamp} • Duração: {call.duration}
                    </p>
                  </div>
                </div>
                <Badge variant={call.status === 'active' ? 'default' : 'secondary'}>
                  {call.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
