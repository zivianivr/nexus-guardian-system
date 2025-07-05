-- Fazer email único na tabela profiles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Primeiro, vamos alterar a constraint de role para permitir super_admin
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Criar usuário Master Rafael Ziviani
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  status,
  approved_at,
  approved_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'rafael.ziviani@live.com',
  'Rafael Ziviani',
  'super_admin',
  'approved',
  now(),
  gen_random_uuid(),
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Permitir que usuários se registrem (inserção na tabela profiles)
CREATE POLICY "Users can create profiles during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Criar função para verificar se é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = 'super_admin'
      AND status = 'approved'
  )
$$;