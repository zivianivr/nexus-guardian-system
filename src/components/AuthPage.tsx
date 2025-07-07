import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Brain, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Erro no Login",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Guardian VoIP v3.0",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erro no Login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signupData.fullName,
          }
        }
      });

      if (error) {
        toast({
          title: "Erro no Cadastro",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: signupData.email,
              full_name: signupData.fullName,
              role: 'user',
              status: 'pending',
              requested_at: new Date().toISOString(),
            }
          ]);

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta. Aguarde aprovação do administrador.",
        });

        // Limpar formulário
        setSignupData({ email: '', password: '', confirmPassword: '', fullName: '' });
      }
    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Guardian VoIP
            </h1>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300">v3.0 & Nexus AI</span>
          </div>
          <p className="text-slate-400 text-sm">Plataforma Hiperinteligente de Gerenciamento VoIP</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-white">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="login" className="data-[state=active]:bg-slate-600">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-slate-600">
                  Cadastro
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        placeholder="Sua senha"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-300">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        placeholder="Senha (mínimo 6 caracteres)"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-slate-300">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        placeholder="Confirme sua senha"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">Aguarde Aprovação</span>
                  </div>
                  <p className="text-xs text-yellow-300 mt-1">
                    Novos usuários precisam ser aprovados pelo administrador antes de acessar o sistema.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-xs">
            Sistema Guardian VoIP v3.0 & Nexus AI
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Plataforma Unificada Hiperinteligente & Autônoma
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;