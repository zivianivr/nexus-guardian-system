# 🔧 Correção do Problema de Login

## Problema Identificado
O usuário `rafael.ziviani@live.com` pode não estar sendo criado corretamente ou não tem as permissões adequadas.

## Soluções

### ✅ Solução 1: Verificar se o usuário existe
1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/213ef108-adc9-4248-a02d-ccf8ea95759d
2. Vá em **Authentication > Users**
3. Procure por `rafael.ziviani@live.com`
4. Se não existir, clique em **"Add user"** e crie:
   - Email: `rafael.ziviani@live.com`
   - Password: `19782211Robert@`
   - Email Confirm: `true`

### ✅ Solução 2: Atualizar perfil diretamente no banco
1. Acesse **SQL Editor** no Supabase
2. Execute este comando:

```sql
-- Verificar se o usuário existe na tabela profiles
SELECT * FROM profiles WHERE email = 'rafael.ziviani@live.com';

-- Se existir, atualizar para super_admin
UPDATE profiles 
SET 
  role = 'super_admin',
  status = 'approved',
  approved_at = now(),
  approved_by = id
WHERE email = 'rafael.ziviani@live.com';

-- Se não existir, criar o perfil manualmente
INSERT INTO profiles (id, email, full_name, role, status, approved_at, requested_at)
SELECT 
  au.id,
  'rafael.ziviani@live.com',
  'Rafael Ziviani - Super Admin',
  'super_admin',
  'approved',
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'rafael.ziviani@live.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  status = 'approved',
  approved_at = now();
```

### ✅ Solução 3: Cadastro pelo próprio sistema
1. Acesse a página de login do sistema
2. Clique em **"Não tem conta? Cadastre-se"**
3. Cadastre-se com:
   - Email: `rafael.ziviani@live.com`
   - Senha: `19782211Robert@`
4. Após o cadastro, execute no SQL Editor:

```sql
UPDATE profiles 
SET 
  role = 'super_admin',
  status = 'approved',
  approved_at = now()
WHERE email = 'rafael.ziviani@live.com';
```

### ✅ Solução 4: Configurar URL de redirecionamento
No Supabase Dashboard:
1. Vá em **Authentication > URL Configuration**
2. Configure:
   - **Site URL**: `http://SEU_IP_SERVIDOR` ou `https://SEU_DOMINIO`
   - **Redirect URLs**: Adicione as URLs do seu sistema

## 🧪 Teste de Login
Após aplicar uma das soluções:
1. Limpe o cache do navegador
2. Acesse o sistema
3. Tente fazer login com:
   - Email: `rafael.ziviani@live.com`
   - Senha: `19782211Robert@`

## 📞 Suporte
Se o problema persistir, verifique:
- Console do navegador (F12) para erros JavaScript
- Logs do Supabase no Dashboard
- Configuração de CORS no servidor