from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date
import datetime
from flask_cors import CORS

# 1. Inicialização do Flask e configuração do banco de dados
app = Flask(__name__)
CORS(app) # 2. Habilite o CORS para toda a sua aplicação
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 2. Inicialização do SQLAlchemy
db = SQLAlchemy(app)

# 3. Definição do Modelo (tabela) de Funcionário
class Funcionario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(200), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False) 
    matricula = db.Column(db.String(20), unique=True, nullable=True) 
    cargo = db.Column(db.String(100), nullable=False)
    tipo_vinculo = db.Column(db.String(50), nullable=False) 
    situacao = db.Column(db.String(50), nullable=False)
    # NOVO CAMPO - O mais importante para o objetivo principal!
    localizacao_fisica = db.Column(db.String(300), nullable=True) # Campo de texto para descrever a localização 
    pcd = db.Column(db.Boolean, default=False)
    readaptado = db.Column(db.Boolean, default=False)
    data_admissao = db.Column(db.Date, nullable=False)
    data_desligamento = db.Column(db.Date, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nome_completo': self.nome_completo,
            'cpf': self.cpf,
            'matricula': self.matricula,
            'cargo': self.cargo,
            'tipo_vinculo': self.tipo_vinculo,
            'situacao': self.situacao,
            'localizacao_fisica': self.localizacao_fisica, # NOVO CAMPO
            'pcd': self.pcd,
            'readaptado': self.readaptado,
            'data_admissao': self.data_admissao.isoformat() if self.data_admissao else None,
            'data_desligamento': self.data_desligamento.isoformat() if self.data_desligamento else None
        }

    def __repr__(self):
        return f"<Funcionario {self.nome_completo}>"

# 4. Definição das Rotas da API (CRUD)

@app.route("/")
def home():
    return "Sistema de Arquivos EC03 funcionando 🚀"

# ... (as rotas POST, GET, PUT, DELETE que já fizemos continuam aqui)
@app.route("/funcionarios", methods=['POST'])
def criar_funcionario():
    dados = request.json
    data_admissao_obj = datetime.datetime.strptime(dados['data_admissao'], '%Y-%m-%d').date()
    novo_funcionario = Funcionario(
        nome_completo=dados['nome_completo'],
        cpf=dados['cpf'],
        matricula=dados.get('matricula'),
        cargo=dados['cargo'],
        tipo_vinculo=dados['tipo_vinculo'],
        situacao=dados['situacao'],
        localizacao_fisica=dados.get('localizacao_fisica'), # NOVO CAMPO
        pcd=dados.get('pcd', False),
        readaptado=dados.get('readaptado', False),
        data_admissao=data_admissao_obj
    )
    db.session.add(novo_funcionario)
    db.session.commit()
    return jsonify(novo_funcionario.to_dict()), 201

@app.route("/funcionarios", methods=['GET'])
def listar_funcionarios():
    todos_funcionarios = Funcionario.query.all()
    return jsonify([funcionario.to_dict() for funcionario in todos_funcionarios])

@app.route("/funcionarios/<int:id_funcionario>", methods=['GET'])
def buscar_funcionario_por_id(id_funcionario):
    funcionario = Funcionario.query.get_or_404(id_funcionario)
    return jsonify(funcionario.to_dict())

@app.route("/funcionarios/<int:id_funcionario>", methods=['PUT'])
def atualizar_funcionario(id_funcionario):
    funcionario = Funcionario.query.get_or_404(id_funcionario)
    dados = request.json
    funcionario.nome_completo = dados.get('nome_completo', funcionario.nome_completo)
    funcionario.cargo = dados.get('cargo', funcionario.cargo)
    funcionario.situacao = dados.get('situacao', funcionario.situacao)
    funcionario.localizacao_fisica = dados.get('localizacao_fisica', funcionario.localizacao_fisica) # NOVO CAMPO
    db.session.commit()
    return jsonify(funcionario.to_dict())

@app.route("/funcionarios/<int:id_funcionario>", methods=['DELETE'])
def deletar_funcionario(id_funcionario):
    funcionario = Funcionario.query.get_or_404(id_funcionario)
    db.session.delete(funcionario)
    db.session.commit()
    return jsonify({'mensagem': 'Funcionário deletado com sucesso!'})

# --- ROTA NOVA E MELHORADA PARA BUSCA ---
@app.route("/funcionarios/buscar", methods=['GET'])
def buscar_funcionarios():
    # Pegamos os argumentos da URL, ex: ?nome=Maria
    nome = request.args.get('nome')
    cpf = request.args.get('cpf')
    matricula = request.args.get('matricula')

    # Começamos com uma consulta que pega todos os funcionários
    query = Funcionario.query

    # E agora aplicamos os filtros, se eles foram fornecidos
    if nome:
        # .ilike() faz uma busca que não diferencia maiúsculas/minúsculas
        # os '%' são coringas, significam "qualquer coisa antes ou depois"
        query = query.filter(Funcionario.nome_completo.ilike(f"%{nome}%"))
    
    if cpf:
        query = query.filter_by(cpf=cpf)
    
    if matricula:
        query = query.filter_by(matricula=matricula)
    
    # Executamos a consulta final e retornamos os resultados
    resultados = query.all()
    return jsonify([funcionario.to_dict() for funcionario in resultados])


# 5. Execução da aplicação
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)