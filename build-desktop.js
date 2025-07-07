#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build do executável desktop...');

try {
  // 1. Build do projeto web
  console.log('📦 Fazendo build do projeto...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Configurar Capacitor se não estiver configurado
  if (!fs.existsSync('capacitor.config.ts')) {
    console.log('⚙️ Inicializando Capacitor...');
    execSync('npx cap init', { stdio: 'inherit' });
  }

  // 3. Adicionar plataforma Electron
  if (!fs.existsSync('electron')) {
    console.log('🖥️ Adicionando plataforma Electron...');
    execSync('npx cap add @capacitor-community/electron', { stdio: 'inherit' });
  }

  // 4. Sincronizar assets
  console.log('🔄 Sincronizando assets...');
  execSync('npx cap sync @capacitor-community/electron', { stdio: 'inherit' });

  // 5. Build do executável
  console.log('🛠️ Gerando executável...');
  execSync('npx cap open @capacitor-community/electron', { stdio: 'inherit' });

  console.log('✅ Build concluído! Executável gerado na pasta electron/dist');
  console.log('💡 Para executar: npm run desktop');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}