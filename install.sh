
#!/bin/bash

# Script de Instalação Automatizada
# Sistema Guardian VoIP v3.0 & Nexus AI
# Compatível com Ubuntu/Debian 20.04+

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
  ____                     _ _               __      __   ___ ____  
 / ___|_   _  __ _ _ __ __| (_) __ _ _ __     \ \    / /__|_ _|  _ \ 
| |  _| | | |/ _` | '__/ _` | |/ _` | '_ \     \ \/\/ / _ \| || |_) |
| |_| | |_| | (_| | | | (_| | | (_| | | | |     \  /\  / (_) | ||  __/ 
 \____|\__,_|\__,_|_|  \__,_|_|\__,_|_| |_|      \/  \/ \___/___|_|   
                                                                      
        v3.0 & Nexus AI - Instalação Automatizada
EOF
echo -e "${NC}"

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root (sudo)"
fi

# Definir variáveis
PROJECT_DIR="/opt/guardian-voip-v3"
SERVICE_USER="guardian"
REPO_URL="https://github.com/zivianivr/nexus-guardian-system.git"

log "Iniciando instalação do Sistema Guardian VoIP v3.0 & Nexus AI..."

# Atualizar sistema
log "Atualizando sistema operacional..."
apt update && apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências básicas..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    supervisor \
    nginx \
    fail2ban \
    ufw \
    htop \
    nano \
    vim

# Instalar Python 3.11
log "Instalando Python 3.11..."
add-apt-repository ppa:deadsnakes/ppa -y
apt update
apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Instalar Node.js e npm
log "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar Docker
log "Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Instalar Docker Compose
log "Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Criar usuário do sistema
log "Criando usuário do sistema..."
if ! id "$SERVICE_USER" &>/dev/null; then
    useradd -r -s /bin/bash -d /opt/guardian-voip-v3 -m $SERVICE_USER
    usermod -aG docker $SERVICE_USER
fi

# Configurar PostgreSQL
log "Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Criar banco de dados
log "Configurando banco de dados..."
sudo -u postgres psql << EOF
CREATE USER guardian WITH PASSWORD 'guardian123!@#';
CREATE DATABASE guardian_db OWNER guardian;
GRANT ALL PRIVILEGES ON DATABASE guardian_db TO guardian;
\q
EOF

# Clonar repositório
log "Clonando repositório do projeto..."
if [ -d "$PROJECT_DIR" ]; then
    rm -rf "$PROJECT_DIR"
fi

git clone $REPO_URL $PROJECT_DIR
chown -R $SERVICE_USER:$SERVICE_USER $PROJECT_DIR

# Configurar ambientes Python
log "Configurando ambientes Python..."
cd $PROJECT_DIR

# Backend Guardian
sudo -u $SERVICE_USER python3.11 -m venv backend/guardian/venv
sudo -u $SERVICE_USER bash -c "source backend/guardian/venv/bin/activate && pip install -r backend/guardian/requirements.txt"

# Backend Nexus AI
sudo -u $SERVICE_USER python3.11 -m venv backend/nexus/venv
sudo -u $SERVICE_USER bash -c "source backend/nexus/venv/bin/activate && pip install -r backend/nexus/requirements.txt"

# Configurar Frontend
log "Configurando frontend..."
cd $PROJECT_DIR
sudo -u $SERVICE_USER npm install
sudo -u $SERVICE_USER npm run build

# Criar arquivo de configuração
log "Criando configuração do sistema..."
cat > $PROJECT_DIR/.env << EOF
# Database
DATABASE_URL=postgresql://guardian:guardian123!@#@localhost/guardian_db

# Sistema
SECRET_KEY=$(openssl rand -hex 32)
FLASK_ENV=production
DEBUG=False

# GitHub para auto-atualização
GITHUB_TOKEN=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
GITHUB_REPO=https://github.com/zivianivr/nexus-guardian-system.git

# Supabase
SUPABASE_URL=https://fvdwvisahnnitepsdova.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZHd2aXNhaG5uaXRlcHNkb3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMDE3NDIsImV4cCI6MjA2Njg3Nzc0Mn0.HR-obXu21iMpDmylBKDFtAp2W9L9xC-u8CoI8I_r6pw

# APIs de IA (configurar depois no painel)
GOOGLE_GEMINI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
ALIBABA_QWEN_API_KEY=
XAI_GROK_API_KEY=
SUNO_AI_API_KEY=

# Zabbix (configurar depois no painel)
ZABBIX_SERVER_1_URL=
ZABBIX_SERVER_1_USER=
ZABBIX_SERVER_1_PASS=
ZABBIX_SERVER_2_URL=
ZABBIX_SERVER_2_USER=
ZABBIX_SERVER_2_PASS=
EOF

chown $SERVICE_USER:$SERVICE_USER $PROJECT_DIR/.env
chmod 600 $PROJECT_DIR/.env

# Configurar Nginx
log "Configurando Nginx..."
cat > /etc/nginx/sites-available/guardian << 'EOF'
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /opt/guardian-voip-v3/dist;
        try_files $uri $uri/ /index.html;
        
        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # API Guardian VoIP
    location /api/guardian/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Nexus AI
    location /api/nexus/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket para chat
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Arquivos estáticos
    location /static/ {
        alias /opt/guardian-voip-v3/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/guardian /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t || error "Erro na configuração do Nginx"

# Configurar Supervisor para Guardian
log "Configurando serviços..."
cat > /etc/supervisor/conf.d/guardian-backend.conf << EOF
[program:guardian-backend]
command=/opt/guardian-voip-v3/backend/guardian/venv/bin/gunicorn --bind 127.0.0.1:5000 --workers 4 --worker-class eventlet -w 1 --worker-connections 1000 app:app
directory=/opt/guardian-voip-v3/backend/guardian
user=guardian
autostart=true
autorestart=true
stderr_logfile=/var/log/guardian-backend.err.log
stdout_logfile=/var/log/guardian-backend.out.log
environment=PATH="/opt/guardian-voip-v3/backend/guardian/venv/bin"
EOF

# Configurar Supervisor para Nexus AI
cat > /etc/supervisor/conf.d/nexus-backend.conf << EOF
[program:nexus-backend]
command=/opt/guardian-voip-v3/backend/nexus/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
directory=/opt/guardian-voip-v3/backend/nexus
user=guardian
autostart=true
autorestart=true
stderr_logfile=/var/log/nexus-backend.err.log
stdout_logfile=/var/log/nexus-backend.out.log
environment=PATH="/opt/guardian-voip-v3/backend/nexus/venv/bin"
EOF

# Configurar firewall
log "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https

# Criar script de atualização
log "Criando script de atualização..."
cat > /opt/guardian-voip-v3/update.sh << 'EOF'
#!/bin/bash

set -e

PROJECT_DIR="/opt/guardian-voip-v3"
SERVICE_USER="guardian"

echo "Iniciando atualização do sistema..."

# Parar serviços
supervisorctl stop guardian-backend nexus-backend

# Fazer backup da configuração
cp $PROJECT_DIR/.env $PROJECT_DIR/.env.backup

# Atualizar código
cd $PROJECT_DIR
sudo -u $SERVICE_USER git pull origin main

# Restaurar configuração
cp $PROJECT_DIR/.env.backup $PROJECT_DIR/.env

# Atualizar dependências Python se necessário
if [ -f "backend/guardian/requirements.txt" ]; then
    sudo -u $SERVICE_USER bash -c "source backend/guardian/venv/bin/activate && pip install -r backend/guardian/requirements.txt"
fi

if [ -f "backend/nexus/requirements.txt" ]; then
    sudo -u $SERVICE_USER bash -c "source backend/nexus/venv/bin/activate && pip install -r backend/nexus/requirements.txt"
fi

# Rebuildar frontend se necessário
if [ -f "package.json" ]; then
    sudo -u $SERVICE_USER npm install
    sudo -u $SERVICE_USER npm run build
fi

# Reiniciar serviços
supervisorctl start guardian-backend nexus-backend
supervisorctl restart nginx

echo "Atualização concluída!"
EOF

chmod +x /opt/guardian-voip-v3/update.sh

# Inicializar banco de dados
log "Inicializando banco de dados..."
cd $PROJECT_DIR/backend/guardian
sudo -u $SERVICE_USER bash -c "source venv/bin/activate && python init_db.py"

# Criar usuário Master no Supabase (já criado via migration)
log "Usuário Master já configurado via Supabase..."
log "Email: rafael.ziviani@live.com"
log "Senha: 19782211Robert@"

# Recarregar e iniciar serviços
log "Iniciando serviços..."
supervisorctl reread
supervisorctl update
supervisorctl start guardian-backend nexus-backend
systemctl restart nginx
systemctl enable supervisor

# Status final
log "Verificando status dos serviços..."
supervisorctl status
systemctl status nginx --no-pager

# Informações finais
echo -e "${GREEN}"
cat << "EOF"

✅ Instalação concluída com sucesso!

📍 INFORMAÇÕES DE ACESSO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 URL de Acesso: http://SEU_IP_SERVIDOR

👤 Super Usuário Padrão:
   📧 Email: rafael.ziviani@live.com
   🔐 Senha: 19782211Robert@

📁 Diretório do Projeto: /opt/guardian-voip-v3
📊 Logs dos Serviços: /var/log/guardian-*.log e /var/log/nexus-*.log

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 COMANDOS ÚTEIS:
   
   # Ver status dos serviços
   sudo supervisorctl status
   
   # Reiniciar serviços
   sudo supervisorctl restart guardian-backend nexus-backend
   
   # Ver logs em tempo real
   sudo tail -f /var/log/guardian-backend.out.log
   sudo tail -f /var/log/nexus-backend.out.log
   
   # Atualizar sistema manualmente
   sudo /opt/guardian-voip-v3/update.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Sistema Guardian VoIP v3.0 & Nexus AI está PRONTO!

EOF
echo -e "${NC}"

log "Instalação finalizada! Acesse o sistema através do navegador."
