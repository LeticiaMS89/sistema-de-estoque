# 📝 Exemplos Práticos - Como Usar o Sistema

## Cenário 1: Primeira Vez Usando a Aplicação

### 👤 Sua Ação
1. Abra a página no navegador
2. Vê o dashboard com "0 itens" em cada card
3. Vê a tabela com 2 produtos de exemplo (PROD-001 e PROD-002)

### 🤖 O que JavaScript faz nos bastidores
```javascript
// Tenta carregar dados salvos (não há nada)
let estoque = JSON.parse(localStorage.getItem('estoqueApp')) || [];
// Resultado: estoque = []

let historico = JSON.parse(localStorage.getItem('historicoApp')) || [];
// Resultado: historico = []

// Desenha tabela vazia (além do exemplo HTML)
renderizarTabela(estoque);

// Atualiza dashboard
atualizarDashboard();
// Resultado: 0 itens | 0 entradas | 0 saídas
```

### 💾 Dados Salvos no Navegador
```javascript
localStorage.estoqueApp = "[]"
localStorage.historicoApp = "[]"
```

---

## Cenário 2: Registrar Primeira Entrada

### 👤 Você Faz
```
Preenche o formulário:
┌─────────────────────────────┐
│ Produto: Caixa Papelão P    │
│ Quantidade: 500             │
│ Tipo: Entrada ✓             │
│                             │
│  [Registrar Movimentação]   │
└─────────────────────────────┘

Clica em "Registrar Movimentação"
```

### 🤖 JavaScript Processa

#### **Passo 1: Extrai dados do formulário**
```javascript
const nome = "CAIXA PAPELÃO P"        // Trimmed + uppercase
const quantidade = 500                 // Convertido para número
const tipo = "entrada"                 // Vem do select
```

#### **Passo 2: Valida**
```javascript
// Validação 1
if (quantidade <= 0 || isNaN(quantidade)) {
    // 500 > 0? SIM ✅
    // isNaN(500)? NÃO ✅
    // Passa na validação
}

// Validação 2
let produtoExistente = estoque.find(p => p.nome === nome);
// Procura "CAIXA PAPELÃO P" no array
// Não encontra: produtoExistente = undefined
```

#### **Passo 3: Lógica de Entrada**
```javascript
if (tipo === 'saida') {
    // Não executa (tipo é 'entrada')
} else {
    if (produtoExistente) {
        // Não executa (produto não existe)
    } else {
        // EXECUTA AQUI!
        produtoExistente = {
            sku: 'PROD-' + Math.floor(Math.random() * 10000),
            // Exemplo: Math.random() = 0.5234
            // 0.5234 * 10000 = 5234
            // Math.floor(5234) = 5234
            // Resultado: sku = "PROD-5234"
            
            nome: "CAIXA PAPELÃO P",
            saldo: 500
        };
        
        // Adiciona ao array
        estoque.push(produtoExistente);
        // estoque = [{sku: 'PROD-5234', nome: 'CAIXA PAPELÃO P', saldo: 500}]
    }
}
```

#### **Passo 4: Registra no Histórico**
```javascript
historico.push({
    data: "30/08/2026 14:32:15",  // Data/hora completa
    acao: "ENTRADA",              // Maiúscula
    sku: "PROD-5234",             // Do produto
    produto: "CAIXA PAPELÃO P",   // Nome do produto
    qtd: 500                       // Quantidade movimentada
});

// historico = [
//   {data: "30/08/2026 14:32:15", acao: "ENTRADA", ...}
// ]
```

#### **Passo 5: Atualiza a Tela**
```javascript
salvarDados();
// localStorage.estoqueApp = '[{"sku":"PROD-5234",...}]'
// localStorage.historicoApp = '[{...}]'

formulario.reset();
// Limpa os inputs (ficam em branco)

renderizarTabela(estoque);
// Redesenha tabela com novo produto
// Tabela mostra:
// | PROD-5234 | CAIXA PAPELÃO P | 500 (✅ Normal) |

atualizarDashboard();
// Calcula:
// totalEstoque = 500
// entradasHoje = 500
// saidasHoje = 0
// Dashboard mostra:
// [500 itens] | [500 itens] | [0 itens]
```

### 📱 Tela Agora Mostra
```
┌──────────────────────────────────────────┐
│     500 itens      │  500 itens  │ 0 itens
│  Total em Estoque  │ Entradas    │ Saídas
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Produto: [          ]
│ Quantidade: [      ]
│ Tipo: [Entrada ▼]
│ [Registrar Movimentação]
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Inventário Atual
│ [Buscar produto...] [Exportar CSV]
│
│ Código (SKU) | Descrição          | Saldo
│ PROD-5234    | CAIXA PAPELÃO P    | 500 ✅
│ PROD-001     | Caixa de Papelão P | 500
│ PROD-002     | Fita Adesiva       | 120
└──────────────────────────────────────────┘
```

---

## Cenário 3: Segunda Entrada (Mesmo Produto)

### 👤 Você Faz
```
Produto: Caixa Papelão P (MESMO de antes)
Quantidade: 100
Tipo: Entrada
```

### 🤖 JavaScript Processa

#### **Passo 1-2: Validações**
```javascript
const nome = "CAIXA PAPELÃO P"
const quantidade = 100
const tipo = "entrada"
// Passa nas validações
```

#### **Passo 3: Lógica de Entrada**
```javascript
let produtoExistente = estoque.find(p => p.nome === nome);
// DESTA VEZ ENCONTRA!
// produtoExistente = {sku: 'PROD-5234', nome: 'CAIXA PAPELÃO P', saldo: 500}

if (tipo === 'entrada') {
    if (produtoExistente) {
        // EXECUTA AQUI!
        produtoExistente.saldo += quantidade;
        // produtoExistente.saldo = 500 + 100 = 600
        // Nota: o objeto no array é MODIFICADO automaticamente
    }
}
```

#### **Passo 4: Registra no Histórico**
```javascript
historico.push({
    data: "30/08/2026 15:10:45",
    acao: "ENTRADA",
    sku: "PROD-5234",
    produto: "CAIXA PAPELÃO P",
    qtd: 100
});

// historico agora tem 2 entradas:
// [{..., qtd: 500}, {..., qtd: 100}]
```

#### **Passo 5: Dashboard Atualiza**
```javascript
atualizarDashboard();
// totalEstoque = 500 + 100 = 600
// entradasHoje = 500 + 100 = 600 (mesma data)
// saidasHoje = 0
```

### 📊 Dados Agora
```javascript
estoque = [
  {
    sku: 'PROD-5234',
    nome: 'CAIXA PAPELÃO P',
    saldo: 600  // Mudou de 500 para 600
  }
]

historico = [
  {data: "30/08/2026 14:32:15", acao: "ENTRADA", qtd: 500},
  {data: "30/08/2026 15:10:45", acao: "ENTRADA", qtd: 100}
]
```

---

## Cenário 4: Registrar uma Saída (Remover do Estoque)

### 👤 Você Faz
```
Produto: Caixa Papelão P
Quantidade: 150
Tipo: Saída ✓
```

### 🤖 JavaScript Processa

#### **Passo 1-2: Validações**
```javascript
const nome = "CAIXA PAPELÃO P"
const quantidade = 150
const tipo = "saida"
// Passa nas validações iniciais

let produtoExistente = estoque.find(p => p.nome === nome);
// Encontra: {sku: 'PROD-5234', nome: 'CAIXA PAPELÃO P', saldo: 600}
```

#### **Passo 3: Validação de Saída**
```javascript
if (tipo === 'saida') {
    if (!produtoExistente) {
        // Produto existe? SIM, não entra aqui
    }
    
    if (produtoExistente.saldo < quantidade) {
        // 600 < 150? NÃO, não entra aqui
    }
    
    // EXECUTA A SAÍDA
    produtoExistente.saldo -= quantidade;
    // produtoExistente.saldo = 600 - 150 = 450
}
```

#### **Passo 4: Registra**
```javascript
historico.push({
    data: "30/08/2026 16:20:30",
    acao: "SAIDA",              // Mudou para SAIDA
    sku: "PROD-5234",
    produto: "CAIXA PAPELÃO P",
    qtd: 150
});
```

#### **Passo 5: Dashboard**
```javascript
atualizarDashboard();
// totalEstoque = 450
// entradasHoje = 600 (apenas ENTRADA)
// saidasHoje = 150 (apenas SAIDA)
```

### 📊 Tela Mostra
```
[450 itens] | [600 entradas] | [150 saídas]

Tabela:
| PROD-5234 | CAIXA PAPELÃO P | 450 (✅ Normal) |
```

---

## Cenário 5: Tentar Saída Inválida (Sem saldo suficiente)

### 👤 Você Faz
```
Produto: Caixa Papelão P
Quantidade: 500  (mas só tem 450!)
Tipo: Saída
```

### 🤖 JavaScript Processa
```javascript
let produtoExistente = estoque.find(p => p.nome === nome);
// Encontra: {saldo: 450}

if (tipo === 'saida') {
    if (produtoExistente.saldo < quantidade) {
        // 450 < 500? SIM!
        alert(`Erro: Saldo insuficiente. Você tem apenas ${produtoExistente.saldo} unidades.`);
        // Mostra: "Erro: Saldo insuficiente. Você tem apenas 450 unidades."
        
        return; // SAI DA FUNÇÃO - nada é salvo
    }
}

// Histórico NÃO é atualizado
// Dados NÃO são salvos
// Tela NÃO muda
```

### ⚠️ Resultado
- Nada acontece
- Usuário vê mensagem de erro
- Dados permanecem como estavam

---

## Cenário 6: Estoque Crítico (Alerta Visual)

### 👤 Você Faz
```
Produto: Fita de Embalagem
Quantidade: 15
Tipo: Entrada
```

### 🤖 Sistema Cria Produto com Saldo Baixo

```javascript
estoque = [
  {sku: 'PROD-9999', nome: 'FITA DE EMBALAGEM', saldo: 15}
]
```

### 🎨 Tabela Renderiza Com Alerta

```javascript
function renderizarTabela(dados) {
    dados.forEach(item => {
        const estoqueCritico = item.saldo < 20;
        // 15 < 20? SIM
        
        const estiloAlerta = estoqueCritico 
            ? 'color: var(--danger); font-weight: bold;'
            : '';
        // Resultado: texto VERMELHO e NEGRITO
        
        const aviso = estoqueCritico ? '⚠️ Baixo' : '✅ Normal';
        // Resultado: mostra ⚠️ Baixo
        
        // Cria: <td style="color: #ef4444; font-weight: bold;">15 (⚠️ Baixo)</td>
    });
}
```

### 📱 Tela Mostra
```
Tabela:
| PROD-9999 | FITA DE EMBALAGEM | 15 (⚠️ Baixo) |
                                  └─ VERMELHO E NEGRITO!
```

---

## Cenário 7: Busca de Produtos

### 👤 Você Digita no Campo de Busca
```
Digita: "FITA"
```

### 🤖 JavaScript Filtra em Tempo Real

```javascript
inputBusca.addEventListener('input', function() {
    const termo = inputBusca.value.toUpperCase();
    // termo = "FITA"
    
    const estoqueFiltrado = estoque.filter(item => 
        item.nome.includes(termo) || item.sku.includes(termo)
    );
    
    // Procura em todo estoque:
    // CAIXA PAPELÃO P - "CAIXA".includes("FITA")? NÃO
    // FITA DE EMBALAGEM - "FITA DE EMBALAGEM".includes("FITA")? SIM ✅
    
    // estoqueFiltrado = [{sku: 'PROD-9999', nome: 'FITA DE EMBALAGEM', saldo: 15}]
    
    renderizarTabela(estoqueFiltrado);
});
```

### 📱 Tela Mostra Apenas
```
Tabela:
| PROD-9999 | FITA DE EMBALAGEM | 15 (⚠️ Baixo) |

(Outros produtos desaparecem da tabela)
```

### 👤 Você Limpa a Busca
```
Apaga "FITA", deixa vazio
```

### 🤖 JavaScript Mostra Tudo Novamente
```javascript
const termo = ""; // Vazio
const estoqueFiltrado = estoque.filter(item => 
    item.nome.includes("") || item.sku.includes("")
);
// Todas as strings .includes("")? SIM! Tudo passa

// Mostra todos os produtos novamente
```

---

## Cenário 8: Exportar Relatório em CSV

### 👤 Você Clica "Exportar CSV"

### 🤖 JavaScript Gera o Arquivo

#### **Passo 1: Valida**
```javascript
if (historico.length === 0) {
    alert('Não há movimentações para exportar.');
    return;
}
// Temos 3 movimentações, segue em frente
```

#### **Passo 2: Monta o Texto CSV**
```javascript
let csvContent = "DATA,ACAO,SKU,PRODUTO,QUANTIDADE\n";
// Cabeçalho

historico.forEach(log => {
    csvContent += `${log.data},${log.acao},${log.sku},${log.produto},${log.qtd}\n`;
});

// Resultado:
csvContent = `DATA,ACAO,SKU,PRODUTO,QUANTIDADE
30/08/2026 14:32:15,ENTRADA,PROD-5234,CAIXA PAPELÃO P,500
30/08/2026 15:10:45,ENTRADA,PROD-5234,CAIXA PAPELÃO P,100
30/08/2026 16:20:30,SAIDA,PROD-5234,CAIXA PAPELÃO P,150
`;
```

#### **Passo 3: Cria o Arquivo**
```javascript
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// Blob = "objeto de arquivo" contendo o CSV

const link = document.createElement("a");
// Cria <a href="..." download="...">

const url = URL.createObjectURL(blob);
// Transforma blob em URL: blob:https://example.com/a1b2c3

link.setAttribute("href", url);
link.setAttribute("download", "relatorio_logistica.csv");
```

#### **Passo 4: Simula Clique (faz download)**
```javascript
document.body.appendChild(link);
// Adiciona link ao HTML

link.click();
// Simula clique - navegador faz download!
// Arquivo "relatorio_logistica.csv" na pasta Downloads

document.body.removeChild(link);
// Remove link (limpeza)
```

### 📥 Arquivo Baixado
```
relatorio_logistica.csv (baixa na pasta Downloads)

Conteúdo:
┌────────────────────────────────────────────────────────────┐
│ DATA,ACAO,SKU,PRODUTO,QUANTIDADE                           │
│ 30/08/2026 14:32:15,ENTRADA,PROD-5234,CAIXA PAPELÃO P,500 │
│ 30/08/2026 15:10:45,ENTRADA,PROD-5234,CAIXA PAPELÃO P,100 │
│ 30/08/2026 16:20:30,SAIDA,PROD-5234,CAIXA PAPELÃO P,150   │
└────────────────────────────────────────────────────────────┘
```

### 📊 Aberto no Excel
```
┌────────────────┬────────────┬──────────┬────────────────────┬────────────┐
│ DATA           │ ACAO       │ SKU      │ PRODUTO            │ QUANTIDADE │
├────────────────┼────────────┼──────────┼────────────────────┼────────────┤
│ 30/08/2026...  │ ENTRADA    │ PROD-5234│ CAIXA PAPELÃO P    │ 500        │
│ 30/08/2026...  │ ENTRADA    │ PROD-5234│ CAIXA PAPELÃO P    │ 100        │
│ 30/08/2026...  │ SAIDA      │ PROD-5234│ CAIXA PAPELÃO P    │ 150        │
└────────────────┴────────────┴──────────┴────────────────────┴────────────┘
```

---

## Cenário 9: Fechar e Reabrir a Página

### 👤 Ações
```
1. Usa o sistema (registra movimentações)
2. Fecha a aba (❌ do navegador)
3. Reabre a página depois
```

### 🤖 JavaScript Recupera Dados

```javascript
// Quando a página carrega (reload):

let estoque = JSON.parse(localStorage.getItem('estoqueApp')) || [];
// localStorage.getItem() retorna o JSON salvo
// JSON.parse() converte de volta em objeto JS
// estoque = [{sku: 'PROD-5234', nome: 'CAIXA PAPELÃO P', saldo: 450}]

let historico = JSON.parse(localStorage.getItem('historicoApp')) || [];
// historico = [{...}, {...}, {...}] (3 movimentações)

renderizarTabela(estoque);
// Tabela é redesenhada com os produtos
```

### 📱 Tela Mostra
```
Exatamente como estava antes de fechar!
Nenhum dado foi perdido!

Dashboard:
[450 itens] | [600 entradas] | [150 saídas]

Tabela:
| PROD-5234 | CAIXA PAPELÃO P | 450 (✅ Normal) |
```

---

## Resumo: Fluxo Completo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    PÁGINA CARREGA                            │
│  (F5 ou abrir URL)                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            JavaScript Carrega (script.js)                    │
│  - Procura dados em localStorage                            │
│  - Se não encontra: arrays vazios []                        │
│  - Se encontra: recupera dados salvos                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            renderizarTabela(estoque)                         │
│  - Desenha tabela com produtos                             │
│  - Checa estoque crítico (< 20)                            │
│  - Aplica cores (vermelho/normal)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            atualizarDashboard()                              │
│  - Calcula total em estoque                                │
│  - Calcula entradas de hoje                                │
│  - Calcula saídas de hoje                                  │
│  - Atualiza os 3 cards                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
    ┌──────────────────┐  ┌──────────────────┐
    │ USUÁRIO VÊ PÁGINA│  │ AGUARDA EVENTOS  │
    │ Pronta para usar │  │ (submit, input,  │
    │                  │  │  click)          │
    └──────────────────┘  └────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ Formulário Busca   Exportar
              │ Submit   │  │ Input    │  │ Click    │
              │          │  │          │  │          │
              ▼          ▼  ▼          ▼  ▼
           Registra   Filtra    Gera CSV
           Movimento  Produtos  Download
                   │
                   ▼
        ┌──────────────────────┐
        │  SALVA NO LOCALSTORAGE │
        │  localStorage.setItem  │
        └──────────────┬─────────┘
                       │
                       ▼
         ┌──────────────────────────┐
         │ REDESENHA TABELA E CARDS │
         │ (tudo atualizado!)       │
         └──────────────────────────┘
```

---

**🎓 Parabéns! Agora você entende como cada linha do código funciona!**
