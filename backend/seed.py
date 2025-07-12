# backend/seed.py

# Importamos o Enum StatusBike aqui
from app import create_app, db
from app.models import Administrador, Funcionario, Usuario, Bike, StatusBike
app = create_app()
with app.app_context():
    print("Limpando e recriando o banco de dados...")
    db.drop_all()
    db.create_all()

    print("Criando usuários...")
    admin = Administrador(nome='Admin Master', username='admin')
    admin.set_password('senha123')

    func = Funcionario(nome='Carlos Func', username='carlos')
    func.set_password('senha123')
    
    user = Usuario(nome='João Cliente', username='joao', telefone='21999998888')
    user.set_password('senha123')
    
    db.session.add(admin)
    db.session.add(func)
    db.session.add(user)

    print("Criando bikes...")
    # A GENTE CORRIGE O STATUS E ADICIONA O NÚMERO QUE FALTAVA
    bike1 = Bike(cor='Azul', tipo='Mountain Bike', numero='001', status=StatusBike.DISPONIVEL)
    bike2 = Bike(cor='Vermelha', tipo='Speed', numero='002', status=StatusBike.DISPONIVEL)
    bike3 = Bike(cor='Preta', tipo='Urbana', numero='003', status=StatusBike.DISPONIVEL)

    db.session.add(bike1)
    db.session.add(bike2)
    db.session.add(bike3)
    
    db.session.commit()
    print("Banco de dados populado com sucesso!")