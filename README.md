
# Sistema Guardian VoIP v3.0 & Nexus AI

Plataforma Unificada Hiperinteligente, Autônoma, Escalável, Auto-Corretiva e 100% Pronta para Produção.

## Descrição do Projeto

Sistema completo de gerenciamento VoIP integrado com Inteligência Artificial avançada, incluindo:

- **Guardian VoIP v3.0**: Plataforma principal de gerenciamento de dispositivos VoIP
- **Nexus AI**: Agente de IA central com orquestração multi-IA
- **Auto-correção e Auto-atualização**: Sistema autônomo de manutenção

## Funcionalidades Principais

### Guardian VoIP
- Dashboard global com mapa interativo
- Monitoramento integrado com Zabbix  
- Análise de logs SIP por IA
- Provisionamento automático de dispositivos
- Gerenciamento de blocos de IP
- Gerenciamento de números de telefonia
- Backup automático de dispositivos
- Análise preditiva de falhas
- Detecção de fraude por IA

### Nexus AI
- Orquestração de múltiplas IAs (Gemini, GPT, Claude, Qwen, Grok)
- Consenso e validação ética
- Modo desenvolvimento de aplicações
- Auto-correção e auto-atualização
- Interface de consulta em linguagem natural

## Instalação Rápida

### Pré-requisitos
- Servidor Ubuntu/Debian 20.04+
- Acesso root/sudo
- Conexão com internet

### Instalação Automatizada

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/guardian-voip-v3.git
cd guardian-voip-v3

# Execute o script de instalação
sudo chmod +x install.sh
sudo ./install.sh
```

### Primeiro Acesso

Após a instalação, acesse o sistema:

**URL**: `http://SEU_SERVIDOR` ou `https://SEU_DOMINIO`

**Super Usuário Padrão**:
- Email: `rafael.ziviani@live.com`
- Senha: `19782211Robert@`

## Estrutura do Projeto

```
guardian-voip-v3/
├── src/                    # Frontend React/TypeScript
├── backend/               # Backend Python (Flask/FastAPI)
├── mobile/               # Apps Mobile Flutter
├── desktop/              # App Desktop Python
├── scripts/              # Scripts de instalação e manutenção
├── docker/               # Configurações Docker
├── nginx/                # Configurações Nginx
└── docs/                 # Documentação
```

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, FastAPI, Supabase
- **Mobile**: Flutter
- **Desktop**: Python (Tkinter/PyQT5)
- **Infraestrutura**: Docker, Nginx, PostgreSQL
- **IA**: Google Gemini, OpenAI GPT, Anthropic Claude, Alibaba Qwen, xAI Grok

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/guardian_db

# APIs de IA
GOOGLE_GEMINI_API_KEY=sua_chave_aqui
OPENAI_API_KEY=sua_chave_aqui
ANTHROPIC_API_KEY=sua_chave_aqui
ALIBABA_QWEN_API_KEY=sua_chave_aqui
XAI_GROK_API_KEY=sua_chave_aqui

# Zabbix
ZABBIX_SERVER_1_URL=https://zabbix1.exemplo.com
ZABBIX_SERVER_1_USER=admin
ZABBIX_SERVER_1_PASS=senha

# GitHub para auto-atualização
GITHUB_TOKEN=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
GITHUB_REPO=https://github.com/SEU_USUARIO/guardian-voip-v3.git

# Sistema
SECRET_KEY=sua_chave_secreta_aqui
FLASK_ENV=production
DEBUG=False
```

## Atualização do Sistema

O sistema possui atualização automática via painel web:

1. Faça login como super usuário
2. Acesse "Configurações do Sistema"
3. Clique em "Atualizar Sistema"
4. O sistema irá clonar automaticamente as atualizações do GitHub

## Suporte

Para suporte técnico, entre em contato através do sistema de chat integrado ou via WhatsApp configurado no painel.

## Licença

Este projeto é proprietário. Todos os direitos reservados.
