
#!/bin/bash

# Script executado após a instalação para configurações finais

PROJECT_DIR="/opt/guardian-voip-v3"
SERVICE_USER="guardian"

echo "Executando configurações pós-instalação..."

# Configurar permissões SSH para auto-atualização
echo "Configurando SSH para auto-atualização..."
sudo -u $SERVICE_USER mkdir -p /opt/guardian-voip-v3/.ssh
sudo -u $SERVICE_USER chmod 700 /opt/guardian-voip-v3/.ssh

# Gerar chave SSH se não existir
if [ ! -f "/opt/guardian-voip-v3/.ssh/id_rsa" ]; then
    echo "Gerando chave SSH para auto-atualização..."
    sudo -u $SERVICE_USER ssh-keygen -t rsa -b 4096 -f /opt/guardian-voip-v3/.ssh/id_rsa -N "" -C "guardian-auto-update"
    
    echo ""
    echo "🔑 CHAVE SSH PÚBLICA GERADA:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat /opt/guardian-voip-v3/.ssh/id_rsa.pub
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 ADICIONE ESTA CHAVE AO SEU REPOSITÓRIO GITHUB:"
    echo "1. Vá para https://github.com/SEU_USUARIO/guardian-voip-v3/settings/keys"
    echo "2. Clique em 'Add deploy key'"
    echo "3. Cole a chave acima e marque 'Allow write access'"
    echo "4. Salve a configuração"
    echo ""
fi

# Configurar GitHub conhecidos hosts
echo "Configurando GitHub como host conhecido..."
sudo -u $SERVICE_USER ssh-keyscan github.com >> /opt/guardian-voip-v3/.ssh/known_hosts

# Configurar crontab para verificações automáticas
echo "Configurando tarefas agendadas..."
(sudo -u $SERVICE_USER crontab -l 2>/dev/null; echo "0 2 * * * /opt/guardian-voip-v3/scripts/daily_maintenance.sh") | sudo -u $SERVICE_USER crontab -

# Criar script de manutenção diária
cat > /opt/guardian-voip-v3/scripts/daily_maintenance.sh << 'EOF'
#!/bin/bash

PROJECT_DIR="/opt/guardian-voip-v3"
LOG_FILE="/var/log/guardian-maintenance.log"

echo "[$(date)] Iniciando manutenção diária..." >> $LOG_FILE

# Backup do banco de dados
pg_dump guardian_db | gzip > $PROJECT_DIR/backups/guardian_db_$(date +%Y%m%d_%H%M%S).sql.gz

# Manter apenas os 7 backups mais recentes
find $PROJECT_DIR/backups -name "guardian_db_*.sql.gz" -type f -mtime +7 -delete

# Limpeza de logs antigos
find /var/log -name "guardian-*.log" -type f -mtime +30 -delete
find /var/log -name "nexus-*.log" -type f -mtime +30 -delete

# Verificar atualizações (se auto-update estiver habilitado)
# Esta função será implementada pelo Nexus AI

echo "[$(date)] Manutenção diária concluída." >> $LOG_FILE
EOF

chmod +x /opt/guardian-voip-v3/scripts/daily_maintenance.sh

# Criar diretório de backups
mkdir -p /opt/guardian-voip-v3/backups
chown $SERVICE_USER:$SERVICE_USER /opt/guardian-voip-v3/backups

echo "✅ Configurações pós-instalação concluídas!"
