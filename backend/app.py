from flask import Flask
from routes.employees import employees_bp  # importa a rota
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

@app.route("/")
def home():
    return "Sistema de Arquivos EC03 funcionando 🚀"

# Registrar as rotas
app.register_blueprint(employees_bp)

if __name__ == "__main__":
    app.run(debug=True)

# Configuração do banco SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco
db = SQLAlchemy(app)

# Modelo de funcionário
class Funcionario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cargo = db.Column(db.String(100), nullable=False)
    situacao = db.Column(db.String(50), nullable=False)  # ativo, desligado, etc.

    def __repr__(self):
        return f"<Funcionario {self.nome}>"

@app.route("/")
def index():
    return "Sistema rodando com banco configurado!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # cria as tabelas no banco
    app.run(debug=True)