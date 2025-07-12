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
    if not alugueis:
        return jsonify([]), 200 # Retorna lista vazia se não tiver aluguel
    
    results = [{
        'bike_numero': aluguel.bike.numero,
        'bike_tipo': aluguel.bike.tipo,
        'data_inicio': aluguel.data_inicio.isoformat(),
        'duracao': aluguel.duracao,
        'funcionario_nome': aluguel.funcionario.nome
    } for aluguel in alugueis]
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
    bike = Bike.query.get(data['bike_id'])

    if not bike or bike.status != StatusBike.DISPONIVEL:
        return jsonify({'error': 'Bike indisponível'}), 400

    new_rental = Aluguel(
        usuario_id=data['usuario_id'],
        bike_id=data['bike_id'],
        funcionario_id=data['funcionario_id'], # Assumindo que o front envia o ID do funcionário logado
        data_inicio=datetime.utcnow(),
        duracao=data.get('duracao', 7200) # Duração em segundos, default 2 horas
    )
    bike.status = StatusBike.ALUGADA
    db.session.add(new_rental)
    db.session.commit()
    return jsonify({'message': 'Associação concluída'}), 201