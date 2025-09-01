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
    function exibirResultados(funcionarios) {
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

        if (funcionarios.length === 0) {
            resultadosDiv.innerHTML = '<p>Nenhum funcionário encontrado.</p>';
            return;
        }

        funcionarios.forEach(func => {
            const funcionarioCard = document.createElement('div');
            funcionarioCard.className = 'card';
            
            funcionarioCard.innerHTML = `
                <h2>${func.nome_completo}</h2>
                <p><strong>Matrícula:</strong> ${func.matricula || 'N/A'}</p>
                <p><strong>CPF:</strong> ${func.cpf}</p>
                <p class="localizacao"><strong>Localização da Pasta:</strong> ${func.localizacao_fisica || 'Não informada'}</p>
                
                <div class="card-actions">
                    <button class="btn-editar" data-id="${func.id}">Editar</button>
                    <button class="btn-excluir" data-id="${func.id}">Excluir</button>
                </div>
            `;
            
            resultadosDiv.appendChild(funcionarioCard);
        });
    }

    // ADICIONANDO A LÓGICA PARA OS NOVOS BOTÕES
    resultadosDiv.addEventListener('click', (event) => {
        const target = event.target; // O elemento que foi clicado

        // Se o botão clicado for o de excluir...
        if (target.classList.contains('btn-excluir')) {
            const funcionarioId = target.dataset.id; // Pega o 'id' do funcionário
            // Pede confirmação antes de apagar
            if (confirm('Tem certeza que deseja excluir este funcionário?')) {
                excluirFuncionario(funcionarioId);
            }
        }
        
        // Se o botão clicado for o de editar...
        if (target.classList.contains('btn-editar')) {
            const funcionarioId = target.dataset.id;
            // Redireciona para uma futura página de edição
            window.location.href = `editar.html?id=${funcionarioId}`;
        }
    });

    function excluirFuncionario(id) {
        const url = `http://127.0.0.1:5000/funcionarios/${id}`;

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Funcionário excluído com sucesso!');
                buscaBtn.click(); // Simula um novo clique no botão de busca para atualizar a lista
            } else {
                alert('Erro ao excluir funcionário.');
            }
        })
        .catch(error => console.error('Erro:', error));
    }
    // Função que cria o HTML para mostrar os resultados na tela
    function exibirResultados(funcionarios) {
        resultadosDiv.innerHTML = ''; 

        if (funcionarios.length === 0) {
            resultadosDiv.innerHTML = '<p>Nenhum funcionário encontrado.</p>';
            return;
        }

        funcionarios.forEach(func => {
            const funcionarioCard = document.createElement('div');
            funcionarioCard.className = 'card';
            
            // Adicionamos o novo botão "Ver Detalhes"
            funcionarioCard.innerHTML = `
                <h2>${func.nome_completo}</h2>
                <p><strong>Matrícula:</strong> ${func.matricula || 'N/A'}</p>
                <p class="localizacao"><strong>Localização da Pasta:</strong> ${func.localizacao_fisica || 'Não informada'}</p>
                
                <div class="card-actions">
                    <button class="btn-detalhes" data-id="${func.id}">Ver Detalhes</button>
                    <button class="btn-editar" data-id="${func.id}">Editar</button>
                    <button class="btn-excluir" data-id="${func.id}">Excluir</button>
                </div>
            `;
            
            resultadosDiv.appendChild(funcionarioCard);
        });
    }

    // Atualizamos o 'ouvinte' de cliques para incluir a nova ação
    resultadosDiv.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('btn-excluir')) {
            const funcionarioId = target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este funcionário?')) {
                excluirFuncionario(funcionarioId);
            }
        }
        
        if (target.classList.contains('btn-editar')) {
            const funcionarioId = target.dataset.id;
            window.location.href = `editar.html?id=${funcionarioId}`;
        }
        
        // NOVA LÓGICA: Se o botão "Ver Detalhes" for clicado...
        if (target.classList.contains('btn-detalhes')) {
            const funcionarioId = target.dataset.id;
            mostrarDetalhes(funcionarioId); // Chama a nova função
        }
    });

    // ... (função excluirFuncionario continua aqui) ...

    // NOVA FUNÇÃO para buscar dados e mostrar o modal
    async function mostrarDetalhes(id) {
        const url = `http://127.0.0.1:5000/funcionarios/${id}`;
        try {
            const response = await fetch(url);
            const funcionario = await response.json();

            // Pega o elemento do modal no HTML
            const modal = document.getElementById('detalhesModal');
            const modalContent = document.getElementById('modalContent');

            // Preenche o conteúdo do modal com todas as informações
            modalContent.innerHTML = `
                <h2>Detalhes de ${funcionario.nome_completo}</h2>
                <p><strong>CPF:</strong> ${funcionario.cpf}</p>
                <p><strong>Matrícula:</strong> ${funcionario.matricula || 'N/A'}</p>
                <p><strong>Cargo:</strong> ${funcionario.cargo}</p>
                <p><strong>Tipo de Vínculo:</strong> ${funcionario.tipo_vinculo}</p>
                <p><strong>Situação:</strong> ${funcionario.situacao}</p>
                <p><strong>Data de Admissão:</strong> ${new Date(funcionario.data_admissao).toLocaleDateString()}</p>
                <p class="localizacao"><strong>Localização da Pasta Física:</strong> ${funcionario.localizacao_fisica || 'Não informada'}</p>
            `;

            // Mostra o modal
            modal.style.display = 'block';

        } catch (error) {
            console.error('Erro ao buscar detalhes do funcionário:', error);
        }
    }
    // LÓGICA PARA FECHAR O MODAL
    const modal = document.getElementById('detalhesModal');
    const closeBtn = document.querySelector('.close-btn');

    // Fecha ao clicar no 'X'
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Fecha ao clicar fora do conteúdo do modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}); // Fim do addEventListener