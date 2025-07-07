-- Atualizar usuário para super_admin
UPDATE profiles 
SET role = 'super_admin', 
    status = 'approved', 
    approved_at = now(),
    updated_at = now()
WHERE email = 'rafael.ziviani@live.com';