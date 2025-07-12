#!/bin/bash

# Garante que o script pare se algum comando falhar
set -e

# --- PASSO 1: Subir os containers em background ---
echo "🚀 Subindo os containers com 'docker-compose up -d'..."
docker-compose up -d --build

# --- PASSO 2: Executar todos os comandos de setup do banco de uma vez ---
echo "🛠️  Executando setup do banco de dados dentro do container..."
docker-compose exec backend sh -c "rm -rf migrations && flask db init && flask db migrate -m 'initial setup' && flask db upgrade && python seed.py"

# --- PASSO 3: Mostrar os logs do backend pra confirmar ---
echo "✅ Setup concluído! Mostrando os últimos logs do backend:"
docker-compose logs --tail=20 backend