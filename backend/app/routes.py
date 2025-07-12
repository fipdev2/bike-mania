from flask import Blueprint, request, jsonify
from .models import db, Usuario, Bike, Aluguel, StatusBike, Administrador, Funcionario
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request must be JSON"}), 400
        
    username = data.get('username')
    password = data.get('password')

    user = Administrador.query.filter_by(username=username).first()
    role = 'ADMIN'
    if not user:
        user = Funcionario.query.filter_by(username=username).first()
        role = 'FUNCIONARIO'
    if not user:
        user = Usuario.query.filter_by(username=username).first()
        role = 'USUARIO'
    
    if user and user.check_password(password):
        return jsonify({'message': 'Login successful', 'user': {'id': user.id, 'nome': user.nome, 'role': role}}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Rota para pegar os aluguéis de um usuário
@api.route('/users/<int:user_id>/rentals', methods=['GET'])
def get_user_rentals(user_id):
    alugueis = Aluguel.query.filter_by(usuario_id=user_id).all()
    results = [{'bike_numero': a.bike.numero, 'bike_tipo': a.bike.tipo, 'data_inicio': a.data_inicio.isoformat(), 'duracao_segundos': a.duracao_segundos, 'funcionario_nome': a.funcionario.nome} for a in alugueis]
    return jsonify(results), 200

@api.route('/bikes', methods=['GET'])
def get_bikes():
    bikes = Bike.query.order_by(Bike.id).all()
    return jsonify([{'id': b.id, 'cor': b.cor, 'tipo': b.tipo, 'numero': b.numero, 'status': b.status.value} for b in bikes])

@api.route('/bikes', methods=['POST'])
def register_bike():
    data = request.get_json()
    if Bike.query.filter_by(numero=data['numero']).first():
        return jsonify({'error': 'Número já existe'}), 409
    
    new_bike = Bike(cor=data['cor'], tipo=data['tipo'], numero=data['numero'])
    db.session.add(new_bike)
    db.session.commit()
    return jsonify({'id': new_bike.id, 'message': 'Bicicleta registrada com sucesso'}), 201

@api.route('/bikes/<int:bike_id>', methods=['DELETE'])
def delete_bike(bike_id):
    bike = Bike.query.get(bike_id)
    if not bike:
        return jsonify({'error': 'Bike not found'}), 404
    # Adicionar verificação se a bike não está alugada antes de deletar
    db.session.delete(bike)
    db.session.commit()
    return jsonify({'message': 'Bike removida com sucesso'}), 200

# Rotas para criar aluguéis
@api.route('/rentals', methods=['POST'])
def create_rental():
    data = request.get_json()
    bike_id = data.get('bike_id')
    usuario_id = data.get('usuario_id')
    funcionario_id = data.get('funcionario_id')
    duracao_segundos = data.get('duracao_segundos')

    if not all([bike_id, usuario_id, funcionario_id, duracao_segundos]):
        return jsonify({'message': 'Dados incompletos'}), 400

    bike = Bike.query.get(bike_id)
    if not bike or bike.status != StatusBike.DISPONIVEL:
        return jsonify({'message': 'Bike indisponível'}), 400

    new_rental = Aluguel(
        usuario_id=usuario_id,
        bike_id=bike_id,
        funcionario_id=funcionario_id,
        duracao_segundos=duracao_segundos
    )
    bike.status = StatusBike.ALUGADA
    db.session.add(new_rental)
    db.session.commit()
    return jsonify({'message': 'Aluguel criado com sucesso'}), 201

@api.route('/bikes/<int:bike_id>/return', methods=['POST'])
def return_bike(bike_id):
    bike = Bike.query.get(bike_id)
    if not bike:
        return jsonify({'message': 'Bike não encontrada'}), 404
    
    aluguel = Aluguel.query.filter_by(bike_id=bike_id).first()
    if aluguel:
        db.session.delete(aluguel)

    bike.status = StatusBike.DISPONIVEL
    db.session.commit()
    return jsonify({'message': f'Bike {bike_id} devolvida com sucesso'}), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = Usuario.query.all()
    return jsonify([{'id': u.id, 'nome': u.nome, 'username': u.username} for u in users])

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    # Adicionar validação de dados aqui seria uma boa prática
    new_user = Usuario(
        nome=data.get('nome'),
        username=data.get('username'),
        telefone=data.get('telefone')
    )
    new_user.set_password(data.get('password'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuário criado com sucesso'}), 201

@api.route('/funcionarios', methods=['GET'])
def get_funcionarios():
    funcionarios = Funcionario.query.all()
    return jsonify([{'id': f.id, 'nome': f.nome, 'username': f.username} for f in funcionarios])

@api.route('/funcionarios', methods=['POST'])
def create_funcionario():
    data = request.get_json()
    new_func = Funcionario(
        nome=data.get('nome'),
        username=data.get('username')
    )
    new_func.set_password(data.get('password'))
    db.session.add(new_func)
    db.session.commit()
    return jsonify({'message': 'Funcionário criado com sucesso'}), 201