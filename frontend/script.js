// Aguarda o HTML da página ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega os elementos do HTML com os quais vamos interagir
    const buscaInput = document.getElementById('buscaInput');
    const buscaBtn = document.getElementById('buscaBtn');
    const resultadosDiv = document.getElementById('resultados');

    // Adiciona um "ouvinte" para o evento de clique no botão de busca
    buscaBtn.addEventListener('click', () => {
        const termoBusca = buscaInput.value; // Pega o que o usuário digitou
        
        // Se o campo de busca não estiver vazio, chama a função que busca os dados
        if (termoBusca) {
            buscarFuncionarios(termoBusca);
        }
    });

    // Função que se comunica com o nosso backend (a API)
    function buscarFuncionarios(termo) {
        // A URL da nossa API de busca. Ajustamos para buscar por nome.
        // O ideal é ter uma busca genérica, mas vamos começar com nome.
        const url = `http://127.0.0.1:5000/funcionarios/buscar?nome=${termo}`;

        // O 'fetch' é a ferramenta do JavaScript para fazer requisições HTTP (chamar nossa API)
        fetch(url)
            .then(response => response.json()) // Converte a resposta do backend para JSON
            .then(data => {
                exibirResultados(data); // Chama a função para mostrar os dados na tela
            })
            .catch(error => {
                console.error('Erro ao buscar funcionários:', error);
                resultadosDiv.innerHTML = '<p>Erro ao conectar com o servidor.</p>';
            });
    }

    // Função que cria o HTML para mostrar os resultados na tela
    function exibirResultados(funcionarios) {
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

        if (funcionarios.length === 0) {
            resultadosDiv.innerHTML = '<p>Nenhum funcionário encontrado.</p>';
            return;
        }

        // Para cada funcionário encontrado, cria um "card" com as informações
        funcionarios.forEach(func => {
            const funcionarioCard = document.createElement('div');
            funcionarioCard.className = 'card';
            
            // Note que estamos focando na informação principal!
            funcionarioCard.innerHTML = `
                <h2>${func.nome_completo}</h2>
                <p><strong>Matrícula:</strong> ${func.matricula || 'N/A'}</p>
                <p><strong>CPF:</strong> ${func.cpf}</p>
                <p class="localizacao"><strong>Localização da Pasta:</strong> ${func.localizacao_fisica}</p>
            `;
            
            resultadosDiv.appendChild(funcionarioCard);
        });
    }
});