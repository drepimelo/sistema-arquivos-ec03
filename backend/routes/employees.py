from flask import Blueprint, jsonify

# Criamos um "Blueprint" chamado employees
employees_bp = Blueprint("employees", __name__)

# Rota para listar funcionários
@employees_bp.route("/funcionarios", methods=["GET"])
def get_employees():
    # Lista de teste (no futuro virá do banco de dados)
    employees = [
        {"id": 1, "nome": "Maria Silva", "cargo": "Secretária"},
        {"id": 2, "nome": "João Santos", "cargo": "Coordenador"},
        {"id": 3, "nome": "Ana Oliveira", "cargo": "Diretora"}
    ]
    return jsonify(employees)