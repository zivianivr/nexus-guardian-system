
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_principal import Principal, Permission, RoleNeed, identity_loaded, UserNeed
from werkzeug.security import generate_password_hash, check_password_hash
from flask_socketio import SocketIO, emit
import os
import subprocess
import git
from datetime import datetime
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///guardian.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensões
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Por favor, faça login para acessar esta página.'
login_manager.login_message_category = 'info'

principal = Principal(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Permissões
admin_permission = Permission(RoleNeed('admin'))
super_admin_permission = Permission(RoleNeed('super_admin'))

# Modelos
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(50), default='user')
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime)
    approved_by = db.Column(db.Integer, db.ForeignKey('user.id'))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class SystemConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(15), nullable=False)
    mac_address = db.Column(db.String(17))
    device_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class IPBlock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    network = db.Column(db.String(18), nullable=False)  # CIDR
    gateway = db.Column(db.String(15))
    client_name = db.Column(db.String(100))
    allocated_network = db.Column(db.String(18))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class PhoneNumber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    number = db.Column(db.String(20), nullable=False, unique=True)
    portability_status = db.Column(db.String(20), default='jbm_line')
    provider = db.Column(db.String(50), default='tsinfo')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@identity_loaded.connect_via(app)
def on_identity_loaded(sender, identity):
    identity.user = current_user
    if hasattr(current_user, 'id'):
        identity.provides.add(UserNeed(current_user.id))
    if hasattr(current_user, 'role'):
        identity.provides.add(RoleNeed(current_user.role))

# Rotas principais
@app.route('/')
def index():
    if current_user.is_authenticated:
        if current_user.status != 'approved':
            return render_template('pending_approval.html')
        return render_template('dashboard.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            if user.status == 'approved':
                login_user(user, remember=True)
                return redirect(url_for('index'))
            else:
                flash('Sua conta está pendente de aprovação.', 'warning')
        else:
            flash('Email ou senha inválidos.', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        if User.query.filter_by(email=email).first():
            flash('Email já cadastrado.', 'error')
            return render_template('register.html')
        
        user = User(email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Conta criada! Aguarde aprovação do administrador.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/admin/users')
@login_required
def admin_users():
    if current_user.role not in ['admin', 'super_admin']:
        flash('Acesso negado.', 'error')
        return redirect(url_for('index'))
    
    users = User.query.all()
    return render_template('admin_users.html', users=users)

@app.route('/admin/approve_user/<int:user_id>')
@login_required
def approve_user(user_id):
    if current_user.role not in ['admin', 'super_admin']:
        return jsonify({'error': 'Acesso negado'}), 403
    
    user = User.query.get_or_404(user_id)
    user.status = 'approved'
    user.approved_at = datetime.utcnow()
    user.approved_by = current_user.id
    db.session.commit()
    
    flash(f'Usuário {user.email} aprovado com sucesso!', 'success')
    return redirect(url_for('admin_users'))

@app.route('/config')
@login_required
def config():
    if current_user.role != 'super_admin':
        flash('Acesso negado.', 'error')
        return redirect(url_for('index'))
    
    configs = {}
    config_items = SystemConfig.query.all()
    for item in config_items:
        configs[item.key] = item.value
    
    return render_template('config.html', configs=configs)

@app.route('/api/update_system', methods=['POST'])
@login_required
def update_system():
    if current_user.role != 'super_admin':
        return jsonify({'error': 'Acesso negado'}), 403
    
    try:
        # Executar script de atualização
        result = subprocess.run(['/opt/guardian-voip-v3/update.sh'], 
                              capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            return jsonify({
                'success': True, 
                'message': 'Sistema atualizado com sucesso!',
                'output': result.stdout
            })
        else:
            return jsonify({
                'success': False, 
                'message': 'Erro na atualização',
                'error': result.stderr
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False, 
            'message': 'Timeout na atualização'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Erro: {str(e)}'
        }), 500

@app.route('/api/config', methods=['POST'])
@login_required
def save_config():
    if current_user.role != 'super_admin':
        return jsonify({'error': 'Acesso negado'}), 403
    
    data = request.get_json()
    
    for key, value in data.items():
        config = SystemConfig.query.filter_by(key=key).first()
        if config:
            config.value = value
            config.updated_at = datetime.utcnow()
        else:
            config = SystemConfig(key=key, value=value)
            db.session.add(config)
    
    db.session.commit()
    return jsonify({'success': True, 'message': 'Configurações salvas!'})

# APIs para Guardian VoIP
@app.route('/api/devices')
@login_required
def get_devices():
    if current_user.status != 'approved':
        return jsonify({'error': 'Acesso negado'}), 403
    
    devices = Device.query.all()
    return jsonify([{
        'id': d.id,
        'name': d.name,
        'ip_address': d.ip_address,
        'mac_address': d.mac_address,
        'device_type': d.device_type,
        'status': d.status,
        'created_at': d.created_at.isoformat()
    } for d in devices])

@app.route('/api/ip_blocks')
@login_required
def get_ip_blocks():
    if current_user.status != 'approved':
        return jsonify({'error': 'Acesso negado'}), 403
    
    blocks = IPBlock.query.all()
    return jsonify([{
        'id': b.id,
        'name': b.name,
        'network': b.network,
        'gateway': b.gateway,
        'client_name': b.client_name,
        'allocated_network': b.allocated_network,
        'created_at': b.created_at.isoformat()
    } for b in blocks])

@app.route('/api/phone_numbers')
@login_required
def get_phone_numbers():
    if current_user.status != 'approved':
        return jsonify({'error': 'Acesso negado'}), 403
    
    numbers = PhoneNumber.query.all()
    return jsonify([{
        'id': n.id,
        'client_name': n.client_name,
        'number': n.number,
        'portability_status': n.portability_status,
        'provider': n.provider,
        'created_at': n.created_at.isoformat()
    } for n in numbers])

# WebSocket para chat
@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated and current_user.status == 'approved':
        emit('status', {'msg': f'{current_user.email} conectou!'})
    else:
        return False

@socketio.on('message')
def handle_message(data):
    if current_user.is_authenticated and current_user.status == 'approved':
        emit('message', {
            'user': current_user.email,
            'message': data['message'],
            'timestamp': datetime.utcnow().isoformat()
        }, broadcast=True)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=False, host='0.0.0.0', port=5000)
