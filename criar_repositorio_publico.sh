#!/bin/bash

# Script para criar repositório público e atualizar configurações
# Usage: ./criar_repositorio_publico.sh https://github.com/seu-usuario/guardian-voip-public.git

if [ -z "$1" ]; then
    echo "❌ Erro: URL do repositório não fornecida!"
    echo ""
    echo "📝 Usage: $0 <github_repository_url>"
    echo "📝 Exemplo: $0 https://github.com/rafael/guardian-voip-public.git"
    echo ""
    echo "🔧 Passos para criar repositório público no GitHub:"
    echo "1. Acesse: https://github.com/new"
    echo "2. Nome: guardian-voip-public"
    echo "3. Marque: Public"
    echo "4. Marque: Add README file"
    echo "5. Clique: Create repository"
    echo "6. Copie a URL: https://github.com/SEU_USUARIO/guardian-voip-public.git"
    echo "7. Execute: ./criar_repositorio_publico.sh https://github.com/SEU_USUARIO/guardian-voip-public.git"
    exit 1
fi

REPO_URL="$1"
GITHUB_USER=$(echo $REPO_URL | sed 's|https://github.com/||' | sed 's|/.*||')
REPO_NAME=$(echo $REPO_URL | sed 's|.*/||' | sed 's|\.git||')

echo "🚀 Configurando repositório público..."
echo "📍 Repositório: $REPO_URL"
echo "👤 Usuário GitHub: $GITHUB_USER"
echo "📁 Nome do repositório: $REPO_NAME"
echo ""

# Atualizar install.sh
echo "📝 Atualizando install.sh..."
sed -i "s|REPO_URL=\"https://github.com/.*\"|REPO_URL=\"$REPO_URL\"|g" install.sh

# Atualizar update_repository.sh
echo "📝 Atualizando update_repository.sh..."
sed -i "s|https://github.com/.*\"|$REPO_URL\"|g" update_repository.sh
sed -i "s|SEU_USUARIO|$GITHUB_USER|g" update_repository.sh

# Atualizar README.md
echo "📝 Atualizando README.md..."
sed -i "s|https://github.com/zivianivr/guardian_lovable|$REPO_URL|g" README.md
sed -i "s|zivianivr|$GITHUB_USER|g" README.md

# Atualizar .env.example
echo "📝 Atualizando .env.example..."
sed -i "s|https://github.com/zivianivr/guardian_lovable.git|$REPO_URL|g" .env.example

# Atualizar páginas do sistema
echo "📝 Atualizando links no sistema..."
find src/ -name "*.tsx" -exec sed -i "s|https://github.com/zivianivr/guardian_lovable|$REPO_URL|g" {} \;

echo ""
echo "✅ Configuração concluída com sucesso!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  CRIAR REPOSITÓRIO NO GITHUB:"
echo "    • Acesse: https://github.com/new"
echo "    • Nome: guardian-voip-public"  
echo "    • Tipo: Public"
echo "    • Marque: Add README file"
echo "    • Clique: Create repository"
echo ""
echo "2️⃣  FAZER UPLOAD DO CÓDIGO:"
echo "    git init"
echo "    git add ."
echo "    git commit -m 'Sistema Guardian VoIP v3.0 & Nexus AI'"
echo "    git branch -M main"
echo "    git remote add origin $REPO_URL"
echo "    git push -u origin main"
echo ""
echo "3️⃣  INSTALAR NO SERVIDOR:"
echo "    wget https://raw.githubusercontent.com/$GITHUB_USER/$REPO_NAME/main/install.sh"
echo "    chmod +x install.sh"
echo "    sudo ./install.sh"
echo ""
echo "4️⃣  ACESSAR O SISTEMA:"
echo "    🌐 URL: http://SEU_IP_SERVIDOR"
echo "    👤 Login: rafael.ziviani@live.com"
echo "    🔐 Senha: 19782211Robert@"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🆘 Se tiver problemas de login, verifique se o usuário foi criado:"
echo "    • Acesse Supabase Dashboard > Authentication > Users"
echo "    • Procure por: rafael.ziviani@live.com"
echo "    • Se não existir, cadastre-se no sistema pela primeira vez"
echo ""