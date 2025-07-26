function carregarDados() {
    const dadosSalvos = localStorage.getItem('cadastro');
    return dadosSalvos ? JSON.parse(dadosSalvos) : { pessoas: [], proximoIdPessoa: 1, proximoIdContato: 1 };
}


function salvarDados(dados) {
    localStorage.setItem('cadastro', JSON.stringify(dados));
}

let dados = carregarDados(); 

// Elementos do DOM
const pessoaForm = document.getElementById('pessoaForm');
const nomePessoaInput = document.getElementById('nomePessoa');
const listaPessoasUl = document.getElementById('listaPessoas');
const detalhesPessoaSection = document.getElementById('detalhesPessoa');
const nomePessoaDetalhesH2 = document.getElementById('nomePessoaDetalhes');
const contatoForm = document.getElementById('contatoForm');
const tipoContatoSelect = document.getElementById('tipoContato');
const valorContatoInput = document.getElementById('valorContato');
const idPessoaContatoInput = document.getElementById('idPessoaContato');
const listaContatosUl = document.getElementById('listaContatos');
const voltarPessoasBtn = document.getElementById('voltarPessoas');
const filtroPessoasInput = document.getElementById('filtroPessoas');

let pessoaSelecionadaId = null; 

// --- Funções de Renderização ---

function renderizarPessoas(filtro = '') {
    listaPessoasUl.innerHTML = ''; 
    const pessoasFiltradas = dados.pessoas.filter(pessoa =>
        pessoa.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    pessoasFiltradas.forEach(pessoa => {
        const li = document.createElement('li');
        li.classList.add('pessoa-item');
        li.dataset.id = pessoa.id;
        li.innerHTML = `
            <span>${pessoa.nome}</span>
            <div>
                <button onclick="visualizarPessoa(${pessoa.id})">Ver Contatos</button>
                <button onclick="excluirPessoa(${pessoa.id})">Excluir</button>
            </div>
        `;
        listaPessoasUl.appendChild(li);
    });
}

function renderizarContatos(idPessoa) {
    listaContatosUl.innerHTML = '';
    const pessoa = dados.pessoas.find(p => p.id === idPessoa);
    if (pessoa && pessoa.contatos) {
        pessoa.contatos.forEach(contato => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${contato.tipo}: ${contato.valor}</span>
                <button onclick="excluirContato(${idPessoa}, ${contato.id})">Excluir</button>
            `;
            listaContatosUl.appendChild(li);
        });
    }
}

// --- Funções de Manipulação de Dados ---

pessoaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = nomePessoaInput.value.trim();
    if (nome) {
        const novaPessoa = {
            id: dados.proximoIdPessoa++,
            nome: nome,
            contatos: [] 
        };
        dados.pessoas.push(novaPessoa);
        salvarDados(dados);
        nomePessoaInput.value = ''; 
        renderizarPessoas(); 
    }
});

function excluirPessoa(id) {
    dados.pessoas = dados.pessoas.filter(pessoa => pessoa.id !== id);
    salvarDados(dados);
    renderizarPessoas();
    
    if (pessoaSelecionadaId === id) {
        detalhesPessoaSection.classList.add('hidden');
        pessoaSelecionadaId = null;
    }
}

function visualizarPessoa(id) {
    pessoaSelecionadaId = id;
    const pessoa = dados.pessoas.find(p => p.id === id);
    if (pessoa) {
        nomePessoaDetalhesH2.textContent = `Pessoa: ${pessoa.nome}`;
        idPessoaContatoInput.value = id; 
        renderizarContatos(id);
        detalhesPessoaSection.classList.remove('hidden'); 
    }
}

contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = tipoContatoSelect.value;
    const valor = valorContatoInput.value.trim();
    const idPessoa = parseInt(idPessoaContatoInput.value); 

    if (valor && idPessoa) {
        const pessoa = dados.pessoas.find(p => p.id === idPessoa);
        if (pessoa) {
            const novoContato = {
                id: dados.proximoIdContato++,
                tipo: tipo,
                valor: valor
            };
            pessoa.contatos.push(novoContato);
            salvarDados(dados);
            valorContatoInput.value = ''; 
            renderizarContatos(idPessoa); 
        }
    }
});

function excluirContato(idPessoa, idContato) {
    const pessoa = dados.pessoas.find(p => p.id === idPessoa);
    if (pessoa) {
        pessoa.contatos = pessoa.contatos.filter(contato => contato.id !== idContato);
        salvarDados(dados);
        renderizarContatos(idPessoa);
    }
}

// --- Eventos Adicionais ---
voltarPessoasBtn.addEventListener('click', () => {
    detalhesPessoaSection.classList.add('hidden');
    pessoaSelecionadaId = null;
    
});

// Busca com filtro dinâmico (Recurso a Mais teste)
filtroPessoasInput.addEventListener('input', (e) => {
    renderizarPessoas(e.target.value);
});


// Inicializa a renderização das pessoas ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderizarPessoas();
});