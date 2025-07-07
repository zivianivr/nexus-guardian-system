
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit, Trash2, Mail, Shield, UserCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function GuardianUsers() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([
    { id: "1", email: "rafael.ziviani@live.com", name: "Rafael Ziviani", role: "super_admin", status: "approved", createdAt: "2024-01-15" },
    { id: "2", email: "admin@empresa.com", name: "Administrador", role: "admin", status: "approved", createdAt: "2024-01-20" },
    { id: "3", email: "user@empresa.com", name: "Usuário Teste", role: "user", status: "pending", createdAt: "2024-01-25" },
  ]);

  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user"
  });

  const [isCreating, setIsCreating] = useState(false);

  const createUser = async () => {
    if (!newUser.email || !newUser.name) {
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
    
    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ email: "", name: "", role: "user" });
    setIsCreating(false);

    toast({
      title: "Sucesso",
      description: `Usuário ${user.name} criado com sucesso`,
    });
  };

  const approveUser = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: "approved" } : user
    ));
    toast({
      title: "Sucesso",
      description: "Usuário aprovado com sucesso",
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: "Sucesso",
      description: "Usuário removido com sucesso",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-500';
      case 'admin': return 'bg-blue-500';
      case 'user': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Shield className="h-4 w-4" />;
      case 'admin': return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
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
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerenciamento de usuários do sistema</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Mail className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Criar Novo Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Criar Novo Usuário
          </CardTitle>
          <CardDescription>Adicione um novo usuário ao sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Ex: usuario@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <Label htmlFor="role">Função</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={createUser} disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Usuário"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Lista de Usuários
          </CardTitle>
          <CardDescription>Todos os usuários cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Criado em: {user.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.status === 'approved' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <Badge variant="outline">
                    {user.role}
                  </Badge>
                  {user.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => approveUser(user.id)}
                    >
                      Aprovar
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.role !== 'super_admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
