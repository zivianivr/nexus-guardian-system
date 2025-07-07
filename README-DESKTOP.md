# Nexus Guardian System - Cliente Desktop

## 📖 Descrição

O Cliente Desktop do Nexus Guardian é um executável multiplataforma que funciona como:
- **Softphone VoIP** completo
- **Ferramenta de testes** de qualidade VoIP  
- **Cliente de monitoramento** conectado ao servidor Guardian
- **Sistema de atualização automática**

## 🚀 Instalação Rápida

### 1. Build do Executável
```bash
# Instalar dependências
npm install

# Gerar executável desktop
node build-desktop.js
```

### 2. Criar Instaladores
```bash
# Gerar instaladores para todos os sistemas
node desktop-installer.js
```

### 3. Instalar no Sistema

**Windows:**
```cmd
install-windows.bat
```

**macOS:**
```bash
chmod +x install-mac.sh
./install-mac.sh
```

**Linux:**
```bash
chmod +x install-linux.sh  
./install-linux.sh
```

## ⚙️ Configuração Inicial

1. **Abrir o Cliente Desktop**
2. **Aba "Configuração":**
   - URL do Servidor: `https://seu-servidor-guardian.com`
   - Token de Acesso: `seu-token-de-api`
   - Servidor SIP: `sip.seu-servidor.com`
   - Ramal: `1001` (seu número de ramal)

3. **Testar Conexão** clicando em "Testar Conexão"

## 🎯 Funcionalidades

### 🔧 Configuração
- Conexão com servidor Guardian via token
- Configuração de credenciais SIP
- Persistência de configurações
- Teste de conectividade

### 📞 Softphone  
- Interface de discagem completa
- Controle de chamadas (chamar/desligar)
- Histórico de chamadas
- Status de conectividade SIP

### 🧪 Testes VoIP
- Testes automáticos de qualidade
- Métricas de latência, jitter, perda de pacotes
- Histórico de testes executados
- Análise de qualidade da conexão

### 🔄 Sistema de Atualização
- Verificação automática de atualizações
- Atualização com um clique
- Versionamento automático
- Rollback em caso de problemas

## 🖥️ Uso no Cliente

### Primeira Execução
1. Execute o instalador apropriado para seu sistema
2. Abra o aplicativo "Nexus Guardian System"  
3. Configure a conexão na aba "Configuração"
4. Teste a conectividade
5. Comece a usar o softphone e testes

### Configuração do Token
O token de acesso pode ser obtido:
- No painel web do Guardian VoIP
- Através do administrador do sistema
- Via API de autenticação

### Testes VoIP Automáticos
- Clique em "Executar Teste VoIP"
- Aguarde a conclusão (30-60 segundos)
- Visualize os resultados no histórico
- Repita conforme necessário

### Atualizações
- O sistema verifica atualizações automaticamente
- Clique em "Verificar Atualizações" para forçar
- Reinicie quando solicitado
- Configurações são preservadas

## 🔒 Segurança

- **Tokens criptografados** localmente
- **Conexões HTTPS/TLS** obrigatórias  
- **Validação de certificados** SSL
- **Armazenamento seguro** de credenciais

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
src/components/DesktopClient.tsx    # Componente principal
capacitor.config.ts                 # Configuração Capacitor
build-desktop.js                    # Script de build
desktop-installer.js                # Gerador de instaladores
auto-updater.js                     # Sistema de atualização
```

### Scripts Disponíveis
```bash
# Build para desenvolvimento
npm run build

# Build executável desktop  
node build-desktop.js

# Gerar instaladores
node desktop-installer.js

# Executar em modo desenvolvimento
npm run dev
```

### Personalização
- Modifique `src/components/DesktopClient.tsx` para funcionalidades
- Ajuste `capacitor.config.ts` para configurações do app
- Customize `desktop-installer.js` para instaladores específicos

## 📋 Requisitos do Sistema

### Windows
- Windows 10 ou superior
- .NET Framework 4.7.2+
- 100MB espaço em disco

### macOS  
- macOS 10.14 (Mojave) ou superior
- 100MB espaço em disco

### Linux
- Ubuntu 18.04+ / CentOS 7+ / equivalente
- Biblioteca GTK 3.0+
- 100MB espaço em disco

## 🚨 Resolução de Problemas

### Cliente não conecta
1. Verifique URL do servidor
2. Confirme token de acesso válido
3. Teste conectividade de rede
4. Verifique certificados SSL

### Softphone não funciona
1. Confirme configurações SIP
2. Teste conectividade com servidor SIP
3. Verifique firewall/portas
4. Validate credenciais do ramal

### Testes falham
1. Verifique conexão com servidor
2. Confirme ramal configurado
3. Teste conectividade SIP
4. Verifique logs de erro

### Atualizações não funcionam
1. Verifique conexão com internet
2. Confirme permissões de escrita
3. Execute como administrador
4. Limpe cache de atualizações

## 📞 Suporte

Para suporte técnico:
- **Email:** suporte@guardian-voip.com
- **Chat:** Dentro do sistema web Guardian
- **Documentação:** https://docs.guardian-voip.com
- **Issues:** GitHub do projeto

## 📄 Licença

Este software é propriedade da Guardian VoIP Systems.
Uso autorizado apenas para clientes licenciados.

---

**Nexus Guardian System v1.0**  
*Cliente Desktop Multiplataforma*