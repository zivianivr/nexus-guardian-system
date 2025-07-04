
-- Script de inicialização do banco de dados
-- Guardian VoIP v3.0 & Nexus AI

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar tabelas principais se não existirem
DO $$
BEGIN
    -- Tabela de configurações do sistema
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_configs') THEN
        CREATE TABLE system_configs (
            id SERIAL PRIMARY KEY,
            key VARCHAR(100) UNIQUE NOT NULL,
            value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TRIGGER update_system_configs_updated_at 
            BEFORE UPDATE ON system_configs 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Inserir configurações padrão
    INSERT INTO system_configs (key, value) VALUES 
        ('system_version', '3.0.0'),
        ('installation_date', CURRENT_TIMESTAMP::text),
        ('auto_update_enabled', 'true'),
        ('github_repo', 'https://github.com/SEU_USUARIO/guardian-voip-v3.git')
    ON CONFLICT (key) DO NOTHING;

END $$;
