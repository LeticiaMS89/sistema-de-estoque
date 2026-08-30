/**
 * ==========================================
 * SISTEMA DE GESTÃO DE ESTOQUE
 * Arquivo Principal de Lógica (JavaScript)
 * ==========================================
 * 
 * Este arquivo controla toda a lógica de negócio da aplicação:
 * - Armazenamento de dados no navegador (LocalStorage)
 * - Manipulação da interface com o usuário (DOM)
 * - Validação de entradas e movimentações
 * - Cálculos de saldo e estatísticas
 */

// ==========================================
// 1. CARREGAR DADOS SALVOS DO NAVEGADOR (LOCALSTORAGE)
// ==========================================
/**
 * LocalStorage é um espaço de armazenamento no navegador que persiste dados
 * mesmo após fechar a aba. Funciona como um "banco de dados simples"
 * Se não houver dados salvos, cria arrays vazios ([])
 */
let estoque = JSON.parse(localStorage.getItem('estoqueApp')) || [];
let historico = JSON.parse(localStorage.getItem('historicoApp')) || [];

/**
 * Estrutura do objeto 'estoque':
 * [
 *   { sku: 'PROD-5234', nome: 'Caixa Papelão P', saldo: 150 },
 *   { sku: 'PROD-8901', nome: 'Fita Adesiva', saldo: 45 }
 * ]
 * 
 * Estrutura do 'histórico':
 * [
 *   { data: '30/08/2026 10:45:23', acao: 'ENTRADA', sku: 'PROD-5234', produto: 'Caixa Papelão P', qtd: 50 }
 * ]
 */

// ==========================================
// 2. SELEÇÃO E REFERÊNCIA DOS ELEMENTOS HTML
// ==========================================
/**
 * Aqui estamos "pegando" os elementos HTML para manipulá-los com JavaScript
 * É como apontar no dedo: "Este é o formulário", "Este é o corpo da tabela", etc.
 */

// Seleciona o formulário de registrar movimentações
const formulario = document.querySelector('form');

// Seleciona o <tbody> (corpo da tabela) onde os produtos serão listados
const corpoTabela = document.querySelector('tbody');

// Seleciona o campo de texto para buscar produtos por nome ou SKU
const inputBusca = document.getElementById('busca');

// Seleciona o botão para exportar os dados em formato CSV
const btnExportar = document.getElementById('btnExportar');

/**
 * Seleciona os 3 cards que mostram estatísticas:
 * Card 0 = Total em Estoque
 * Card 1 = Entradas de Hoje
 * Card 2 = Saídas de Hoje
 */
const cardTotalItens = document.querySelectorAll('.card p')[0];
const cardEntradasHoje = document.querySelectorAll('.card p')[1];
const cardSaidasHoje = document.querySelectorAll('.card p')[2];

// ==========================================
// 2A. FUNÇÃO AUXILIAR: SALVAR DADOS NO NAVEGADOR
// ==========================================
/**
 * Salva os dados no LocalStorage para que persistam mesmo após fechar o navegador
 * JSON.stringify() converte objetos JavaScript em texto para armazenar
 */
function salvarDados() {
    localStorage.setItem('estoqueApp', JSON.stringify(estoque));
    localStorage.setItem('historicoApp', JSON.stringify(historico));
}
// ==========================================
// 3. FUNÇÃO: ATUALIZAR DASHBOARD (Resumo de Estatísticas)
// ==========================================
/**
 * Esta função calcula e exibe no "dashboard" (topo da página):
 * 1. Total de itens em estoque (soma de todos os saldos)
 * 2. Quantos itens entraram hoje
 * 3. Quantos itens saíram hoje
 * 
 * É chamada sempre que há uma mudança, para manter as informações atualizadas em tempo real
 */
function atualizarDashboard() {
    // ===== CÁLCULO 1: Total em Estoque =====
    // reduce() é um método que "acumula" valores em um único resultado
    // Aqui: percorre cada produto no estoque e soma todos os saldos
    // Exemplo: [150, 45, 200] => 150 + 45 + 200 = 395
    const totalEstoque = estoque.reduce((acumulador, item) => acumulador + item.saldo, 0);
    
    // Pega a data de hoje no formato brasileiro (30/08/2026)
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    
    // ===== CÁLCULO 2: Entradas de Hoje =====
    // filter() seleciona apenas os logs que são "ENTRADA" E de hoje
    // reduce() depois soma a quantidade de cada entrada
    const entradasHoje = historico
        .filter(log => log.acao === 'ENTRADA' && log.data.includes(dataHoje))
        .reduce((acumulador, log) => acumulador + log.qtd, 0);

    // ===== CÁLCULO 3: Saídas de Hoje =====
    // Mesmo processo: filtra por "SAIDA" e de hoje, depois soma as quantidades
    const saidasHoje = historico
        .filter(log => log.acao === 'SAIDA' && log.data.includes(dataHoje))
        .reduce((acumulador, log) => acumulador + log.qtd, 0);

    // ===== ATUALIZAR OS CARDS NA TELA =====
    // Verifica se os elementos existem (evita erro se HTML estiver incompleto)
    // Depois atualiza o texto de cada card com os valores calculados
    if (cardTotalItens && cardEntradasHoje && cardSaidasHoje) {
        cardTotalItens.textContent = `${totalEstoque} itens`;
        cardEntradasHoje.textContent = `${entradasHoje} itens`;
        cardSaidasHoje.textContent = `${saidasHoje} itens`;
    }
}
// ==========================================
// 4. FUNÇÃO: DESENHAR A TABELA (renderização visual)
// ==========================================
/**
 * Esta função "pinta" a tabela na tela com os produtos
 * Recebe um array de produtos e os transforma em linhas visíveis
 * 
 * @param {Array} dados - Array com os produtos a serem exibidos
 * 
 * Exemplo: renderizarTabela([
 *   { sku: 'PROD-1', nome: 'Caixa P', saldo: 50 },
 *   { sku: 'PROD-2', nome: 'Fita', saldo: 10 }
 * ])
 */
function renderizarTabela(dados) {
    // Limpa tudo que estava antes na tabela (remove linhas antigas)
    // innerHTML = '' é como apagar o quadro branco antes de desenhar novamente
    corpoTabela.innerHTML = '';
    
    // forEach() é um loop que passa por CADA produto no array
    dados.forEach(item => {
        // Cria uma nova linha (<tr>) que será adicionada à tabela
        const linha = document.createElement('tr');
        
        // ===== LÓGICA DE ALERTA: Se estoque está baixo, muda cor para VERMELHO =====
        // Verifica se o saldo é menor que 20 unidades (estoque crítico)
        const estoqueCritico = item.saldo < 20;
        
        // Se crítico: cor vermelha e negrito | Se normal: sem estilo especial
        const estiloAlerta = estoqueCritico ? 'color: var(--danger); font-weight: bold;' : '';
        
        // Ícone visual: ⚠️ para alerta, ✅ para normal
        const aviso = estoqueCritico ? '⚠️ Baixo' : '✅ Normal';

        // ===== PREENCHIMENTO DA LINHA COM OS DADOS =====
        // Usa template literals (strings com ``) para criar HTML dinamicamente
        // Coluna 1: SKU (código do produto)
        // Coluna 2: Nome do produto
        // Coluna 3: Saldo atual com estilo condicional + ícone de aviso
        linha.innerHTML = `
            <td><strong>${item.sku}</strong></td>
            <td>${item.nome}</td>
            <td style="${estiloAlerta}">${item.saldo} (${aviso})</td>
        `;
        
        // Adiciona a linha criada ao corpo da tabela (appendChild = "acrescentar filho")
        corpoTabela.appendChild(linha);
    });

    // Após desenhar a tabela, atualiza também o dashboard (cards do topo)
    // Mantém tudo sincronizado
    atualizarDashboard();
}

// ==========================================
// 5. EVENTO: REGISTRAR NOVA MOVIMENTAÇÃO (Entrada ou Saída)
// ==========================================
/**
 * Este listener "escuta" quando o usuário clica em "Registrar Movimentação"
 * Valida os dados, atualiza o saldo e registra no histórico
 * 
 * Fluxo:
 * 1. Usuário preenche os 3 campos (Produto, Quantidade, Tipo)
 * 2. Usuário clica em "Registrar Movimentação"
 * 3. Validações ocorrem
 * 4. Estoque é atualizado
 * 5. Histórico registra a ação
 * 6. Tela se atualiza automaticamente
 */
formulario.addEventListener('submit', function(evento) {
    // preventDefault() MUITO IMPORTANTE: impede que a página recarregue (F5)
    // Sem isso, o formulário faria um POST padrão e perderia os dados
    evento.preventDefault();

    // ===== COLETA OS VALORES DO FORMULÁRIO =====
    // .value pega o texto digitado no campo
    // .trim() remove espaços em branco (ex: " Produto " vira "Produto")
    // .toUpperCase() converte para MAIÚSCULAS para evitar "Produto" != "PRODUTO"
    const nome = document.getElementById('produto').value.trim().toUpperCase();
    
    // parseInt() converte string para número inteiro
    // Exemplo: "50" (texto) vira 50 (número)
    const quantidade = parseInt(document.getElementById('quantidade').value);
    
    // Tipo é "entrada" ou "saida" (vem do <select>)
    const tipo = document.getElementById('tipo').value;

    // ===== VALIDAÇÃO 1: Quantidade deve ser válida =====
    // Verifica se é um número válido e maior que zero
    // isNaN() retorna true se NÃO é número (isNaN = "is Not a Number")
    if (quantidade <= 0 || isNaN(quantidade)) {
        alert('Erro: A quantidade deve ser maior que zero.');
        return; // return sai da função, não executa mais nada
    }

    // ===== VALIDAÇÃO 2: Buscar se o produto já existe no estoque =====
    // find() procura o primeiro item que atenda a condição
    // Se existir: produtoExistente = { sku: ..., nome: ..., saldo: ... }
    // Se não existir: produtoExistente = undefined
    let produtoExistente = estoque.find(p => p.nome === nome);

    // ===== LÓGICA DE SAÍDA (Remover do estoque) =====
    if (tipo === 'saida') {
        // Validação: produto deve existir para fazer saída
        if (!produtoExistente) {
            alert('Erro: Produto não encontrado para saída.');
            return;
        }
        // Validação: não pode tirar mais do que tem em estoque
        if (produtoExistente.saldo < quantidade) {
            alert(`Erro: Saldo insuficiente. Você tem apenas ${produtoExistente.saldo} unidades.`);
            return;
        }
        // EXECUTA A SAÍDA: reduz o saldo
        // -= significa: produtoExistente.saldo = produtoExistente.saldo - quantidade
        produtoExistente.saldo -= quantidade;
    } 
    // ===== LÓGICA DE ENTRADA (Adicionar ao estoque) =====
    else {
        if (produtoExistente) {
            // Se o produto já existe: soma a quantidade ao saldo existente
            // += significa: produtoExistente.saldo = produtoExistente.saldo + quantidade
            produtoExistente.saldo += quantidade;
        } else {
            // Se é um produto novo: cria um novo objeto com estrutura padrão
            produtoExistente = {
                // Gera um SKU aleatório (ex: PROD-7832)
                // Math.random() gera número entre 0 e 1
                // Math.floor(Math.random() * 10000) gera número entre 0 e 9999
                sku: 'PROD-' + Math.floor(Math.random() * 10000),
                nome: nome,
                saldo: quantidade
            };
            // Adiciona o novo produto ao array de estoque
            estoque.push(produtoExistente);
        }
    }

    // ===== REGISTRA A MOVIMENTAÇÃO NO HISTÓRICO =====
    // Cria um novo objeto de log com: data, ação, SKU, produto, quantidade
    // Este histórico serve para gerar relatórios depois
    historico.push({
        data: new Date().toLocaleString('pt-BR'), // Data e hora completas (30/08/2026 14:32:15)
        acao: tipo.toUpperCase(), // "ENTRADA" ou "SAIDA"
        sku: produtoExistente.sku, // Código do produto
        produto: nome, // Nome do produto
        qtd: quantidade // Quantidade movimentada
    });

    // ===== ATUALIZAR A TELA =====
    salvarDados(); // Salva tudo no LocalStorage do navegador
    formulario.reset(); // Limpa os campos do formulário (fica em branco de novo)
    renderizarTabela(estoque); // Redraw a tabela com novos dados
});

// ==========================================
// 6. BUSCA INSTANTÂNEA (Filtrar produtos em tempo real)
// ==========================================
/**
 * Este listener "escuta" a cada letra digitada no campo de busca
 * Filtra a tabela para mostrar apenas produtos que correspondem ao termo
 * 
 * Funciona assim:
 * - Usuário digita "CAIXA"
 * - A tabela mostra apenas produtos com "CAIXA" no nome ou SKU
 * - Muito útil para estoques com 1000+ produtos!
 */
inputBusca.addEventListener('input', function() {
    // Pega o texto digitado e converte para MAIÚSCULAS (padronização)
    const termo = inputBusca.value.toUpperCase();
    
    // filter() cria um novo array com apenas produtos que passam na condição
    // A condição: nome OU sku contenham o termo de busca
    // includes() retorna true se encontrou a substring dentro da string
    const estoqueFiltrado = estoque.filter(item => 
        item.nome.includes(termo) || item.sku.includes(termo)
    );
    
    // Redesenha a tabela com apenas os produtos filtrados
    renderizarTabela(estoqueFiltrado);
});

// ==========================================
// 7. EXPORTAR RELATÓRIO EM FORMATO CSV
// ==========================================
/**
 * CSV = Comma Separated Values (Valores Separados por Vírgula)
 * É um formato que qualquer programa consegue abrir (Excel, Google Sheets, etc)
 * 
 * Fluxo:
 * 1. Coleta o histórico de movimentações
 * 2. Transforma em texto no padrão CSV
 * 3. Gera um arquivo .csv
 * 4. Faz o download automático
 * 
 * Exemplo do arquivo gerado:
 * DATA,ACAO,SKU,PRODUTO,QUANTIDADE
 * 30/08/2026 14:32:15,ENTRADA,PROD-5234,CAIXA PAPELÃO P,50
 * 30/08/2026 15:10:45,SAIDA,PROD-5234,CAIXA PAPELÃO P,10
 */
btnExportar.addEventListener('click', function() {
    // Validação: não pode exportar se não há histórico
    if (historico.length === 0) {
        alert('Não há movimentações para exportar.');
        return;
    }

    // ===== CONSTRUÇÃO DO ARQUIVO CSV =====
    // Começa com o cabeçalho (coluna/header names)
    let csvContent = "DATA,ACAO,SKU,PRODUTO,QUANTIDADE\n";
    
    // Para CADA movimento no histórico, adiciona uma linha
    // \n significa quebra de linha
    historico.forEach(log => {
        csvContent += `${log.data},${log.acao},${log.sku},${log.produto},${log.qtd}\n`;
    });

    // ===== GERAR O DOWNLOAD =====
    // Blob é um "objeto de dados binários" - permite criar arquivos
    // type: 'text/csv;charset=utf-8;' diz ao navegador que é um arquivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Cria um URL temporário para o arquivo na memória do navegador
    const link = document.createElement("a"); // Cria um link invisível
    const url = URL.createObjectURL(blob); // Transforma o blob em um link
    
    // Configura o link para fazer download
    link.setAttribute("href", url); // "Este link aponta para o arquivo"
    link.setAttribute("download", "relatorio_logistica.csv"); // Nome do arquivo que será baixado
    link.style.visibility = 'hidden'; // Torna o link invisível (não queremos mostrar na tela)
    
    // Adiciona o link ao documento HTML (temporariamente)
    document.body.appendChild(link);
    
    // Simula um clique no link (gatilha o download)
    link.click();
    
    // Remove o link do documento (limpeza)
    document.body.removeChild(link);
    
    // RESULTADO: Um arquivo "relatorio_logistica.csv" é baixado para a pasta Downloads do usuário
});

// ==========================================
// 8. INICIALIZAÇÃO DO SISTEMA (Quando a página carrega)
// ==========================================
/**
 * Esta linha é executada assim que o arquivo .js é carregado pelo navegador
 * Ela faz:
 * 1. Carrega os dados salvos do LocalStorage (feito no início do arquivo)
 * 2. Desenha a tabela com os produtos
 * 3. Atualiza o dashboard com os números
 * 
 * Se for a primeira vez usando o site: estoque estará vazio [], 
 * então a tabela fica vazia também (que é o normal)
 */
renderizarTabela(estoque);

// ==========================================
// 📊 RESUMO DO FLUXO COMPLETO DO SISTEMA
// ==========================================
/**
 * SEQUÊNCIA DE OPERAÇÕES:
 * 
 * 1️⃣ USUÁRIO ABRE O SITE
 *    └─→ Navegador carrega os 3 arquivos: HTML, CSS, JavaScript
 * 
 * 2️⃣ JAVASCRIPT CARREGA DADOS DO LOCALSTORAGE
 *    └─→ Se for primeira vez: arrays vazios []
 *    └─→ Se tiver usado antes: dados antigos são recuperados
 * 
 * 3️⃣ TABELA É DESENHADA COM PRODUTOS ANTERIORES
 *    └─→ Função renderizarTabela() cria as linhas da tabela
 * 
 * 4️⃣ DASHBOARD MOSTRA ESTATÍSTICAS
 *    └─→ Cards mostram: Total em Estoque, Entradas de Hoje, Saídas de Hoje
 * 
 * 5️⃣ USUÁRIO PREENCHE FORMULÁRIO
 *    └─→ Produto: "Caixa Papelão P"
 *    └─→ Quantidade: 50
 *    └─→ Tipo: Entrada
 * 
 * 6️⃣ USUÁRIO CLICA "REGISTRAR MOVIMENTAÇÃO"
 *    └─→ O formulário dispara o evento 'submit'
 * 
 * 7️⃣ SISTEMA VALIDA DADOS
 *    └─→ Verifica se quantidade > 0
 *    └─→ Para saída: verifica se produto existe e tem saldo suficiente
 * 
 * 8️⃣ ATUALIZA SALDO DO PRODUTO
 *    └─→ Entrada: adiciona quantidade ao saldo
 *    └─→ Saída: reduz quantidade do saldo
 *    └─→ Novo produto: cria novo registro com SKU aleatório
 * 
 * 9️⃣ REGISTRA NO HISTÓRICO
 *    └─→ Salva data, ação, SKU, produto e quantidade
 *    └─→ Usado depois para gerar relatórios
 * 
 * 🔟 SALVA NO LOCALSTORAGE
 *    └─→ Dados persistem mesmo fechando a aba
 * 
 * 1️⃣1️⃣ REDESENHA A TABELA E DASHBOARD
 *    └─→ Usuário vê as alterações em tempo real
 * 
 * ⚡ RECURSOS ADICIONAIS:
 * • Busca instantânea: filtra produtos conforme digita
 * • Alerta de estoque: produtos com < 20 unidades ficam vermelhos
 * • Exportar CSV: gera relatório para Excel/Google Sheets
 * • Persistência: dados salvos no navegador (LocalStorage)
 */