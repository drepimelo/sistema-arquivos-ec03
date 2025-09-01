document.addEventListener('DOMContentLoaded', () => {

    const editarForm = document.getElementById('editarForm');
    
    // Pega os parâmetros da URL para encontrar o ID do funcionário
    const urlParams = new URLSearchParams(window.location.search);
    const funcionarioId = urlParams.get('id');

    // Se não houver ID na URL, não há o que fazer.
    if (!funcionarioId) {
        alert('ID do funcionário não encontrado!');
        window.location.href = 'index.html';
        return;
    }

    // 1. BUSCAR os dados atuais do funcionário para preencher o formulário
    fetch(`http://127.0.0.1:5000/funcionarios/${funcionarioId}`)
        .then(response => response.json())
        .then(data => {
            // Preenche cada campo do formulário com os dados recebidos
            document.getElementById('nome_completo').value = data.nome_completo;
            document.getElementById('cpf').value = data.cpf;
            document.getElementById('matricula').value = data.matricula || '';
            document.getElementById('cargo').value = data.cargo;
            document.getElementById('tipo_vinculo').value = data.tipo_vinculo;
            document.getElementById('situacao').value = data.situacao;
            document.getElementById('localizacao_fisica').value = data.localizacao_fisica || '';
            document.getElementById('data_admissao').value = data.data_admissao;
        })
        .catch(error => console.error('Erro ao buscar dados do funcionário:', error));


    // 2. ENVIAR os dados atualizados quando o formulário for submetido
    editarForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Monta o objeto com os dados atualizados do formulário
        const funcionarioData = {
            nome_completo: document.getElementById('nome_completo').value,
            // CPF e matrícula geralmente não são editáveis, mas vamos permitir por enquanto
            cpf: document.getElementById('cpf').value,
            matricula: document.getElementById('matricula').value,
            cargo: document.getElementById('cargo').value,
            tipo_vinculo: document.getElementById('tipo_vinculo').value,
            situacao: document.getElementById('situacao').value,
            localizacao_fisica: document.getElementById('localizacao_fisica').value,
            data_admissao: document.getElementById('data_admissao').value,
        };

        // Envia a requisição PUT para atualizar os dados no backend
        fetch(`http://127.0.0.1:5000/funcionarios/${funcionarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(funcionarioData),
        })
        .then(response => {
            if (response.ok) {
                alert('Funcionário atualizado com sucesso!');
                window.location.href = 'index.html'; // Volta para a página de busca
            } else {
                alert('Erro ao atualizar funcionário.');
            }
        })
        .catch(error => console.error('Erro:', error));
    });

});