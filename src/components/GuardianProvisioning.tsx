
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, User, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Extension {
  id: string;
  number: string;
  name: string;
  status: string;
  type: string;
}

export default function GuardianProvisioning() {
  const { toast } = useToast();
  const [extensions, setExtensions] = useState<Extension[]>([
    { id: "1", number: "1001", name: "João Silva", status: "active", type: "SIP" },
    { id: "2", number: "1002", name: "Maria Santos", status: "inactive", type: "SIP" },
    { id: "3", number: "1003", name: "Pedro Costa", status: "active", type: "IAX" },
  ]);

  const [newExtension, setNewExtension] = useState({
    number: "",
    name: "",
    type: "SIP"
  });

  const [isCreating, setIsCreating] = useState(false);

  const createExtension = async () => {
    if (!newExtension.number || !newExtension.name) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    // Simular criação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const extension: Extension = {
      id: Date.now().toString(),
      number: newExtension.number,
      name: newExtension.name,
      status: "active",
      type: newExtension.type
    };

    setExtensions(prev => [...prev, extension]);
    setNewExtension({ number: "", name: "", type: "SIP" });
    setIsCreating(false);

    toast({
      title: "Sucesso",
      description: `Ramal ${extension.number} criado com sucesso`,
    });
  };

  const deleteExtension = (id: string) => {
    setExtensions(prev => prev.filter(ext => ext.id !== id));
    toast({
      title: "Sucesso",
      description: "Ramal removido com sucesso",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Provisionamento</h1>
          <p className="text-muted-foreground">Gerenciamento de ramais e dispositivos</p>
        </div>
      </div>

      {/* Criar Novo Ramal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Criar Novo Ramal
          </CardTitle>
          <CardDescription>Configure um novo ramal no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="number">Número do Ramal</Label>
              <Input
                id="number"
                value={newExtension.number}
                onChange={(e) => setNewExtension(prev => ({ ...prev, number: e.target.value }))}
                placeholder="Ex: 1004"
              />
            </div>
            <div>
              <Label htmlFor="name">Nome do Usuário</Label>
              <Input
                id="name"
                value={newExtension.name}
                onChange={(e) => setNewExtension(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={newExtension.type}
                onValueChange={(value) => setNewExtension(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIP">SIP</SelectItem>
                  <SelectItem value="IAX">IAX</SelectItem>
                  <SelectItem value="PJSIP">PJSIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={createExtension} disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Ramal"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Ramais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            Ramais Configurados
          </CardTitle>
          <CardDescription>Lista de todos os ramais do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {extensions.map((extension) => (
              <div key={extension.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{extension.number} - {extension.name}</p>
                    <p className="text-sm text-muted-foreground">Tipo: {extension.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={extension.status === 'active' ? 'default' : 'secondary'}>
                    {extension.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteExtension(extension.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
