
# Guia de Instalação - Sistema Guardian VoIP v3.0 & Nexus AI

## Pré-requisitos

- Servidor Ubuntu/Debian 20.04 ou superior
- Mínimo 4GB RAM, 2 CPU cores, 50GB disco
- Acesso root/sudo
- Conexão estável com a internet

## Instalação Rápida

### Passo 1: Preparar Repositório GitHub

1. Crie um novo repositório no GitHub chamado `guardian-voip-v3`
2. Clone este projeto para seu repositório
3. Execute o script de atualização:

```bash
chmod +x update_repository.sh
./update_repository.sh https://github.com/SEU_USUARIO/guardian-voip-v3.git
```

### Passo 2: Instalar no Servidor

```bash
# Conectar ao servidor
ssh root@SEU_SERVIDOR

# Clonar repositório
git clone https://github.com/SEU_USUARIO/guardian-voip-v3.git
cd guardian-voip-v3

# Executar instalação
chmod +x install.sh
./install.sh
```

### Passo 3: Configurar Deploy Key (Para Auto-Atualização)

Após a instalação, o sistema exibirá uma chave SSH pública. Adicione-a ao GitHub:

1. Vá para `https://github.com/SEU_USUARIO/guardian-voip-v3/settings/keys`
2. Clique em "Add deploy key"
3. Cole a chave SSH exibida
4. Marque "Allow write access"
5. Salve

## Primeiro Acesso

- **URL**: `http://SEU_IP_SERVIDOR`
- **Usuário**: `rafael.ziviani@live.com`
- **Senha**: `19782211Robert@`

## Configuração Inicial

1. Faça login como super usuário
2. Acesse "Configurações do Sistema"
3. Configure as API Keys das IAs:
   - Google Gemini
   - OpenAI GPT
   - Anthropic Claude
   - Alibaba Qwen
   - xAI Grok
4. Configure conexões Zabbix
5. Configure WhatsApp (opcional)

## Estrutura de Arquivos

```
/opt/guardian-voip-v3/
├── backend/
│   ├── guardian/          # Backend Flask
│   └── nexus/            # Backend FastAPI
├── dist/                 # Frontend buildado
├── scripts/              # Scripts de manutenção
├── backups/              # Backups automáticos
├── logs/                 # Logs do sistema
├── .env                  # Configurações
└── update.sh             # Script de atualização
```

## Comandos Úteis

```bash
# Ver status dos serviços
sudo supervisorctl status

# Reiniciar serviços
sudo supervisorctl restart guardian-backend nexus-backend

# Ver logs em tempo real
sudo tail -f /var/log/guardian-backend.out.log
sudo tail -f /var/log/nexus-backend.out.log

# Atualizar sistema manualmente
sudo /opt/guardian-voip-v3/update.sh

# Backup manual
sudo -u guardian pg_dump guardian_db > backup_$(date +%Y%m%d).sql
```

## Solução de Problemas

### Serviço não inicia
```bash
# Verificar logs
sudo supervisorctl tail -f guardian-backend stderr
sudo supervisorctl tail -f nexus-backend stderr

# Reiniciar
sudo supervisorctl restart all
```

### Banco de dados não conecta
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql
sudo systemctl restart postgresql

# Verificar conexão
sudo -u postgres psql -l
```

### Erro de permissão
```bash
# Corrigir permissões
sudo chown -R guardian:guardian /opt/guardian-voip-v3
sudo chmod +x /opt/guardian-voip-v3/update.sh
```

## Atualizações

O sistema possui 3 formas de atualização:

1. **Automática via IA**: Nexus AI detecta e aplica correções
2. **Manual via Painel**: Botão "Atualizar Sistema" para super usuários
3. **Manual via SSH**: Executar `/opt/guardian-voip-v3/update.sh`

## Suporte

- Chat integrado no sistema
- WhatsApp configurado (se disponível)
- Logs detalhados em `/var/log/guardian-*.log`

## Segurança

- Firewall configurado (UFW)
- Rate limiting no Nginx
- Senhas hasheadas
- Headers de segurança
- Isolamento Docker
- Backups automáticos

Para mais informações, consulte a documentação completa no repositório.
