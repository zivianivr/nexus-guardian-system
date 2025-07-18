
#!/bin/bash

# Script para atualizar o endereço do repositório no install.sh
# Usage: ./update_repository.sh https://github.com/seu-usuario/guardian-voip-v3.git

if [ -z "$1" ]; then
    echo "Usage: $0 <github_repository_url>"
    echo "Exemplo: $0 https://github.com/rafael/guardian-voip-v3.git"
    exit 1
fi

REPO_URL="$1"
GITHUB_USER=$(echo $REPO_URL | sed 's|https://github.com/||' | sed 's|/.*||')
REPO_NAME=$(echo $REPO_URL | sed 's|.*/||' | sed 's|\.git||')

echo "Atualizando repositório para: $REPO_URL"
echo "Usuário GitHub: $GITHUB_USER"
echo "Nome do repositório: $REPO_NAME"

# Atualizar install.sh
sed -i "s|REPO_URL=\"https://github.com/.*\"|REPO_URL=\"$REPO_URL\"|g" install.sh

# Atualizar README.md se existir
if [ -f "README.md" ]; then
    sed -i "s|https://github.com/SEU_USUARIO/guardian-voip-v3.git|$REPO_URL|g" README.md
    sed -i "s|SEU_USUARIO|$GITHUB_USER|g" README.md
fi

# Atualizar .env.example
if [ -f ".env.example" ]; then
    sed -i "s|https://github.com/SEU_USUARIO/guardian-voip-v3.git|$REPO_URL|g" .env.example
    sed -i "s|SEU_USUARIO|$GITHUB_USER|g" .env.example
fi

echo "✅ Arquivos atualizados com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "1. Commit e push dos arquivos para o repositório"
echo "2. No servidor, execute:"
echo "   wget https://raw.githubusercontent.com/$GITHUB_USER/$REPO_NAME/main/install.sh"
echo "   chmod +x install.sh"
echo "   sudo ./install.sh"
echo "3. Acesse o sistema via: http://SEU_IP_SERVIDOR"
echo "4. Login: rafael.ziviani@live.com | Senha: 19782211Robert@"
