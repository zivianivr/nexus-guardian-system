
#!/usr/bin/env python3
from app import app, db
from dotenv import load_dotenv

load_dotenv()

with app.app_context():
    print("Criando tabelas do banco de dados...")
    db.create_all()
    print("Tabelas criadas com sucesso!")
