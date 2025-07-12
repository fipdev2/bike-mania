# backend/app/models.py

from . import db  # <-- A MÁGICA ACONTECE AQUI! Importamos o 'db' do __init__.py
from sqlalchemy import Enum
from werkzeug.security import generate_password_hash, check_password_hash
import enum
from datetime import datetime

# O resto do arquivo permanece o mesmo, mas agora ele usa o 'db' importado.

class StatusBike(enum.Enum):
    DISPONIVEL = 'Disponivel'
    ALUGADA = 'Alugada'
    VENDIDA = 'Vendida'

class BaseUser(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Administrador(BaseUser):
    __tablename__ = 'administrador'

class Funcionario(BaseUser):
    __tablename__ = 'funcionario'
    alugueis_feitos = db.relationship('Aluguel', backref='funcionario', lazy='dynamic')

class Usuario(BaseUser):
    __tablename__ = 'usuario'
    telefone = db.Column(db.String(20))
    enderecos = db.relationship('Endereco', backref='usuario', lazy='dynamic')
    alugueis = db.relationship('Aluguel', backref='usuario', lazy='dynamic')
    vendas = db.relationship('Venda', backref='usuario', lazy='dynamic')

class Bike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cor = db.Column(db.String(50), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    numero = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(Enum(StatusBike), default=StatusBike.DISPONIVEL, nullable=False)

class Endereco(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cep = db.Column(db.String(10), nullable=False)
    numero = db.Column(db.String(10), nullable=False)
    complemento = db.Column(db.String(100))
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

class Aluguel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_inicio = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    duracao_segundos = db.Column(db.Integer, nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    bike_id = db.Column(db.Integer, db.ForeignKey('bike.id'), nullable=False)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionario.id'), nullable=False)
    
    bike = db.relationship('Bike')

class Venda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    valor = db.Column(db.Float, nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    bike_id = db.Column(db.Integer, db.ForeignKey('bike.id'), nullable=False)
    
    bike = db.relationship('Bike')