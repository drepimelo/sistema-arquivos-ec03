document.addEventListener('DOMContentLoaded', () => {

    const cadastroForm = document.getElementById('cadastroForm');

    cadastroForm.addEventListener('submit', (event) => {
        // Impede o comportamento padrão do formulário de recarregar a página
        event.preventDefault();

        // Cria um objeto com todos os dados dos campos do formulário
        const funcionarioData = {
            nome_completo: document.getElementById('nome_completo').value,
            cpf: document.getElementById('cpf').value,
            matricula: document.getElementById('matricula').value,
            cargo: document.getElementById('cargo').value,
            tipo_vinculo: document.getElementById('tipo_vinculo').value,
            situacao: document.getElementById('situacao').value,
            localizacao_fisica: document.getElementById('localizacao_fisica').value,
            data_admissao: document.getElementById('data_admissao').value,
        };

        // A URL da nossa API para CRIAR um funcionário
        const url = 'http://127.0.0.1:5000/funcionarios';

        // O 'fetch' para enviar os dados via POST
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcionarioData), // Converte nosso objeto para uma string JSON
        })
        .then(response => {
            if (response.status === 201) { // 201 = Created (Sucesso!)
                alert('Funcionário cadastrado com sucesso!');
                window.location.href = 'index.html'; // Redireciona de volta para a página de busca
            } else {
                alert('Erro ao cadastrar funcionário.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor.');
        });
    });
});