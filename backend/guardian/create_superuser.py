
#!/usr/bin/env python3
from app import app, db, User
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

with app.app_context():
    # Verificar se super usuário já existe
    super_user = User.query.filter_by(email='rafael.ziviani@live.com').first()
    
    if not super_user:
        print("Criando super usuário...")
        super_user = User(
            email='rafael.ziviani@live.com',
            role='super_admin',
            status='approved',
            approved_at=datetime.utcnow()
        )
        super_user.set_password('19782211Robert@')
        
        db.session.add(super_user)
        db.session.commit()
        print("Super usuário criado com sucesso!")
        print("Email: rafael.ziviani@live.com")
        print("Senha: 19782211Robert@")
    else:
        print("Super usuário já existe!")
        # Garantir que está como super_admin e aprovado
        super_user.role = 'super_admin'
        super_user.status = 'approved'
        super_user.approved_at = datetime.utcnow()
        db.session.commit()
        print("Super usuário atualizado!")
