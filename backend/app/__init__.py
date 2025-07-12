# backend/app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# A conexão com o banco (db) é criada AQUI e somente aqui.
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/bikemania'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # A gente registra a conexão com o app
    db.init_app(app)
    migrate.init_app(app, db)

    # A gente importa as rotas DEPOIS pra evitar erro de importação circular
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app