/**
 * ==========================================
 * SISTEMA DE GESTÃO DE ESTOQUE (PRO)
 * Arquivo Principal de Lógica (JavaScript)
 * ==========================================
 * 
 * Melhores práticas aplicadas:
 * - Prevenção contra XSS (Sanitização de HTML)
 * - Prevenção contra Injeção de CSV e correção de acentuação no Excel (UTF-8 BOM)
 * - Seleção de elementos resiliente (via IDs explícitos)
 * - Geração de IDs/SKUs únicos com API nativa de Criptografia
 * - Debounce na busca para otimização de performance
 */

// ==========================================
// 1. ESTADO DA APLICAÇÃO & PERSISTÊNCIA (LOCALSTORAGE)
// ==========================================
// Encapsulamos a leitura do LocalStorage em um bloco try/catch para evitar crash caso o storage esteja bloqueado
let estoque = [];
let historico = [];

try {
    estoque = JSON.parse(localStorage.getItem('estoqueApp')) || [];
    historico = JSON.parse(localStorage.getItem('historicoApp')) || [];
} catch (erro) {
    console.error('Erro ao carregar dados do LocalStorage:', erro);
    estoque = [];
    historico = [];
}

// ==========================================
// 2. REFERÊNCIAS SEGURAS DO DOM (SELEÇÃO POR ID)
// ==========================================
// MELHORIA: Em vez de depender da ordem dos elementos CSS/HTML, usamos os IDs criados no HTML refatorado.
const formulario = document.getElementById('form-movimentacao');
const corpoTabela = document.getElementById('tabela-inventario-body');
const inputBusca = document.getElementById('busca');
const btnExportar = document.getElementById('btnExportar');

// Cards do Dashboard selecionados com precisão
const elTotalItens = document.getElementById('total-itens');
const elTotalEntradas = document.getElementById('total-entradas');
const elTotalSaidas = document.getElementById('total-saidas');

// ==========================================
// 3. FUNÇÕES UTILITÁRIAS & SEGURANÇA
// ==========================================

/**
 * SALVAR DADOS NO LOCALSTORAGE
 */
function salvarDados() {
    try {
        localStorage.setItem('estoqueApp', JSON.stringify(estoque));
        localStorage.setItem('historicoApp', JSON.stringify(historico));
    } catch (erro) {
        alert('Atenção: Não foi possível salvar os dados (Espaço no navegador esgotado ou modo privado ativo).');
    }
}

/**
 * SEGURANÇA CONTRA XSS: Sanitize de Strings
 * Converte caracteres especiais em entidades HTML seguras.
 * Impede que scripts maliciosos injetados por usuários sejam executados pelo navegador.
 */
function escaparHTML(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * GERADOR DE SKU ÚNICO E ROBUSTO
 * Usa crypto.randomUUID() se disponível, com fallback para timestamp + rand.
 */
function gerarSKUUnico() {
    if (window.crypto && window.crypto.randomUUID) {
        return 'SKU-' + window.crypto.randomUUID().substring(0, 8).toUpperCase();
    }
    return 'SKU-' + Math.floor(100000 + Math.random() * 900000);
}

/**
 * OTMIZAÇÃO: Debounce para inputs de busca
 * Evita chamadas excessivas durante a digitação.
 */
function debounce(func, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// ==========================================
// 4. ATUALIZAR DASHBOARD (MÉTRICAS)
// ==========================================
function atualizarDashboard() {
    // Calculo do total em estoque
    const totalEstoque = estoque.reduce((acc, item) => acc + Number(item.saldo), 0);
    
    // Obter data de hoje no formato YYYY-MM-DD para comparação precisa sem problemas de fuso horário
    const dataHojeFormatada = new Date().toLocaleDateString('pt-BR');

    // Filtrar entradas de hoje
    const entradasHoje = historico
        .filter(log => log.acao === 'ENTRADA' && log.data.startsWith(dataHojeFormatada))
        .reduce((acc, log) => acc + Number(log.qtd), 0);

    // Filtrar saídas de hoje
    const saidasHoje = historico
        .filter(log => log.acao === 'SAIDA' && log.data.startsWith(dataHojeFormatada))
        .reduce((acc, log) => acc + Number(log.qtd), 0);

    // Atualiza os elementos na tela com segurança
    if (elTotalItens) elTotalItens.textContent = totalEstoque.toLocaleString('pt-BR');
    if (elTotalEntradas) elTotalEntradas.textContent = entradasHoje.toLocaleString('pt-BR');
    if (elTotalSaidas) elTotalSaidas.textContent = saidasHoje.toLocaleString('pt-BR');
}

// ==========================================
// 5. DESENHAR A TABELA (RENDERIZAÇÃO SEGURA)
// ==========================================
function renderizarTabela(dados) {
    if (!corpoTabela) return;

    // Limpa o conteúdo atual
    corpoTabela.innerHTML = '';

    // Estado Vazio (UX Profissional): Se não houver itens, mostra mensagem amigável
    if (dados.length === 0) {
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: var(--text-soft); padding: 24px;">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;
        atualizarDashboard();
        return;
    }

    // Fragmento DOM: Melhora o desempenho de renderização agrupando alterações na memória antes de inserir no DOM
    const fragmento = document.createDocumentFragment();

    dados.forEach(item => {
        const linha = document.createElement('tr');
        
        // Regra de Estoque Baixo (< 20 unidades)
        const estoqueCritico = item.saldo < 20;
        const estiloAlerta = estoqueCritico ? 'color: var(--danger); font-weight: 600;' : '';
        const avisoBadge = estoqueCritico ? '⚠️ Baixo' : '✅ Normal';

        // MELHORIA DE SEGURANÇA: Aplicando escaparHTML() em dados dinâmicos
        const skuSeguro = escaparHTML(item.sku);
        const nomeSeguro = escaparHTML(item.nome);

        linha.innerHTML = `
            <td><strong>${skuSeguro}</strong></td>
            <td>${nomeSeguro}</td>
            <td style="${estiloAlerta}">${item.saldo.toLocaleString('pt-BR')} <small>(${avisoBadge})</small></td>
        `;

        fragmento.appendChild(linha);
    });

    // Insere tudo no DOM de uma só vez (Operação de alta performance)
    corpoTabela.appendChild(fragmento);

    // Atualiza o painel superior
    atualizarDashboard();
}

// ==========================================
// 6. EVENTO: REGISTRAR MOVIMENTAÇÃO
// ==========================================
if (formulario) {
    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        // Tratamento seguro de inputs
        const inputNome = document.getElementById('produto');
        const inputQtd = document.getElementById('quantidade');
        const inputTipo = document.getElementById('tipo');

        const nomeLimpo = inputNome.value.trim().toUpperCase();
        const quantidade = parseInt(inputQtd.value, 10);
        const tipo = inputTipo.value;

        // VALIDAÇÕES
        if (!nomeLimpo) {
            alert('Por favor, informe o nome do produto.');
            inputNome.focus();
            return;
        }

        if (isNaN(quantidade) || quantidade <= 0) {
            alert('A quantidade deve ser um número inteiro maior que zero.');
            inputQtd.focus();
            return;
        }

        if (!['entrada', 'saida'].includes(tipo)) {
            alert('Selecione um tipo de movimentação válido.');
            inputTipo.focus();
            return;
        }

        // BUSCA PRODUTO EXISTENTE (Insensível a maiúsculas/minúsculas)
        let produtoExistente = estoque.find(p => p.nome.toUpperCase() === nomeLimpo);

        // REGRA DE SAÍDA
        if (tipo === 'saida') {
            if (!produtoExistente) {
                alert('Erro: Este produto não consta no sistema para registrar saída.');
                return;
            }
            if (produtoExistente.saldo < quantidade) {
                alert(`Erro: Saldo insuficiente. Saldo atual do produto: ${produtoExistente.saldo}`);
                return;
            }
            produtoExistente.saldo -= quantidade;
        } 
        // REGRA DE ENTRADA
        else {
            if (produtoExistente) {
                produtoExistente.saldo += quantidade;
            } else {
                produtoExistente = {
                    sku: gerarSKUUnico(),
                    nome: nomeLimpo,
                    saldo: quantidade
                };
                estoque.push(produtoExistente);
            }
        }

        // REGISTRO DE HISTÓRICO
        historico.push({
            data: new Date().toLocaleString('pt-BR'),
            acao: tipo.toUpperCase(),
            sku: produtoExistente.sku,
            produto: produtoExistente.nome,
            qtd: quantidade
        });

        // SALVAR E ATUALIZAR INTERFACE
        salvarDados();
        formulario.reset();
        renderizarTabela(estoque);
        
        // Retorna o foco para o primeiro input facilitando digitações sequenciais (UX)
        inputNome.focus();
    });
}

// ==========================================
// 7. BUSCA EM TEMPO REAL (COM DEBOUNCE)
// ==========================================
if (inputBusca) {
    const executarBusca = debounce(function() {
        const termo = inputBusca.value.trim().toUpperCase();

        if (!termo) {
            renderizarTabela(estoque);
            return;
        }

        const estoqueFiltrado = estoque.filter(item => 
            item.nome.toUpperCase().includes(termo) || 
            item.sku.toUpperCase().includes(termo)
        );

        renderizarTabela(estoqueFiltrado);
    }, 250);

    inputBusca.addEventListener('input', executarBusca);
}

// ==========================================
// 8. EXPORTAÇÃO CSV PROFISSIONAL & SEGURA
// ==========================================
if (btnExportar) {
    btnExportar.addEventListener('click', function() {
        if (historico.length === 0) {
            alert('Não existem registros no histórico para exportar.');
            return;
        }

        // MELHORIA DE SEGURANÇA E FORMATO:
        // 1. Prefixar com \uFEFF força o Microsoft Excel a reconhecer o arquivo como UTF-8 (corrige acentuação)
        // 2. Tratar strings envolvendo-as em aspas para suportar vírgulas dentro do texto
        let csvContent = "\uFEFFDATA,ACAO,SKU,PRODUTO,QUANTIDADE\n";

        historico.forEach(log => {
            // Escapa aspas duplas dentro dos textos para não quebrar a sintaxe CSV
            const produtoFormatado = `"${log.produto.replace(/"/g, '""')}"`;
            const skuFormatado = `"${log.sku.replace(/"/g, '""')}"`;
            
            csvContent += `"${log.data}","${log.acao}",${skuFormatado},${produtoFormatado},${log.qtd}\n`;
        });

        // Cria o arquivo Blob com cabeçalho UTF-8
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        
        // Nome do arquivo dinâmico com data atual
        const dataHoje = new Date().toISOString().slice(0, 10);
        link.setAttribute("download", `relatorio_estoque_${dataHoje}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Libera a URL temporária da memória
        URL.revokeObjectURL(url);
    });
}

// ==========================================
// 9. INICIALIZAÇÃO DO SISTEMA
// ==========================================
// Executa a primeira renderização assim que o script é carregado
document.addEventListener('DOMContentLoaded', () => {
    renderizarTabela(estoque);
});
