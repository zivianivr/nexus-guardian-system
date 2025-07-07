#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const config = {
  appName: 'Nexus Guardian System',
  appId: 'app.nexus.guardian.system',
  version: '1.0.0',
  author: 'Guardian VoIP Team',
  description: 'Cliente Desktop para Guardian VoIP - Softphone e Testes'
};

console.log(`🏗️ Criando instalador para ${config.appName}...`);

function createInstallerScript() {
  const platform = os.platform();
  
  if (platform === 'win32') {
    return createWindowsInstaller();
  } else if (platform === 'darwin') {
    return createMacInstaller();
  } else {
    return createLinuxInstaller();
  }
}

function createWindowsInstaller() {
  const installerScript = `
@echo off
echo Instalando ${config.appName}...

REM Criar diretório de instalação
if not exist "%PROGRAMFILES%\\${config.appName}" mkdir "%PROGRAMFILES%\\${config.appName}"

REM Copiar arquivos
xcopy /E /I "dist\\*" "%PROGRAMFILES%\\${config.appName}\\"

REM Criar atalho na área de trabalho
echo Criando atalho na área de trabalho...
powershell -Command "\\$WshShell = New-Object -comObject WScript.Shell; \\$Shortcut = \\$WshShell.CreateShortcut('\\$([Environment]::GetFolderPath('Desktop'))\\${config.appName}.lnk'); \\$Shortcut.TargetPath = '%PROGRAMFILES%\\${config.appName}\\${config.appName}.exe'; \\$Shortcut.Save()"

REM Registrar desinstalador
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.appId}" /v "DisplayName" /t REG_SZ /d "${config.appName}" /f
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${config.appId}" /v "UninstallString" /t REG_SZ /d "%PROGRAMFILES%\\${config.appName}\\uninstall.bat" /f

echo Instalação concluída!
echo Executável disponível em: %PROGRAMFILES%\\${config.appName}\\
pause
`;

  fs.writeFileSync('install-windows.bat', installerScript);
  console.log('✅ Instalador Windows criado: install-windows.bat');
}

function createMacInstaller() {
  const installerScript = `#!/bin/bash
echo "Instalando ${config.appName}..."

# Criar diretório de aplicação
sudo mkdir -p "/Applications/${config.appName}.app/Contents/MacOS"
sudo mkdir -p "/Applications/${config.appName}.app/Contents/Resources"

# Copiar arquivos
sudo cp -R dist/* "/Applications/${config.appName}.app/Contents/MacOS/"

# Criar Info.plist
sudo tee "/Applications/${config.appName}.app/Contents/Info.plist" > /dev/null <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>${config.appName}</string>
    <key>CFBundleIdentifier</key>
    <string>${config.appId}</string>
    <key>CFBundleName</key>
    <string>${config.appName}</string>
    <key>CFBundleVersion</key>
    <string>${config.version}</string>
</dict>
</plist>
EOF

echo "Instalação concluída!"
echo "Aplicativo disponível em: /Applications/${config.appName}.app"
`;

  fs.writeFileSync('install-mac.sh', installerScript);
  fs.chmodSync('install-mac.sh', '755');
  console.log('✅ Instalador macOS criado: install-mac.sh');
}

function createLinuxInstaller() {
  const installerScript = `#!/bin/bash
echo "Instalando ${config.appName}..."

# Criar diretório de instalação
sudo mkdir -p "/opt/${config.appName}"

# Copiar arquivos
sudo cp -R dist/* "/opt/${config.appName}/"

# Criar link simbólico
sudo ln -sf "/opt/${config.appName}/${config.appName}" "/usr/local/bin/nexus-guardian"

# Criar arquivo .desktop
sudo tee "/usr/share/applications/${config.appId}.desktop" > /dev/null <<EOF
[Desktop Entry]
Name=${config.appName}
Comment=${config.description}
Exec=/usr/local/bin/nexus-guardian
Icon=/opt/${config.appName}/icon.png
Terminal=false
Type=Application
Categories=Network;Communication;
EOF

echo "Instalação concluída!"
echo "Execute com: nexus-guardian"
`;

  fs.writeFileSync('install-linux.sh', installerScript);
  fs.chmodSync('install-linux.sh', '755');
  console.log('✅ Instalador Linux criado: install-linux.sh');
}

function createAutoUpdater() {
  const updaterScript = `
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

class AutoUpdater {
  constructor() {
    autoUpdater.checkForUpdatesAndNotify();
    
    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Atualização disponível',
        message: 'Uma nova versão está disponível. Será baixada em segundo plano.',
        buttons: ['OK']
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Atualização pronta',
        message: 'A atualização foi baixada. Reinicie o aplicativo para aplicar.',
        buttons: ['Reiniciar', 'Depois']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
  }

  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }
}

module.exports = AutoUpdater;
`;

  fs.writeFileSync('auto-updater.js', updaterScript);
  console.log('✅ Auto-updater criado: auto-updater.js');
}

// Executar criação dos instaladores
try {
  createInstallerScript();
  createAutoUpdater();
  
  console.log('🎉 Instaladores criados com sucesso!');
  console.log('📋 Próximos passos:');
  console.log('   1. Execute npm run build-desktop para gerar o executável');
  console.log('   2. Execute o instalador apropriado para seu sistema');
  console.log('   3. Configure o token de acesso no cliente desktop');
  
} catch (error) {
  console.error('❌ Erro ao criar instaladores:', error.message);
  process.exit(1);
}