# 📊 Documentação Completa - Sistema de Gestão de Estoque

## 🎯 Visão Geral do Projeto

Um **sistema web de controle de estoque em tempo real** que permite:
- ✅ Registrar entradas e saídas de produtos
- ✅ Visualizar saldo em estoque
- ✅ Alertas de estoque crítico (< 20 unidades)
- ✅ Busca instantânea de produtos
- ✅ Exportar relatórios em CSV
- ✅ Persistência de dados no navegador (LocalStorage)

---

## 📁 Estrutura de Arquivos

```
Gestão de Estoque/
├── index.html        # Estrutura HTML (esqueleto da página)
├── script.js         # Lógica JavaScript (funcionamento)
├── style.css         # Estilos CSS (visual e layout)
└── DOCUMENTACAO.md   # Este arquivo
```

---

## 🔧 Tecnologias Utilizadas

| Tecnologia | Função | Versão |
|------------|--------|--------|
| **HTML5** | Estrutura semântica | 5 |
| **CSS3** | Estilo visual responsivo | 3 |
| **JavaScript ES6+** | Lógica e interatividade | ES2020 |
| **LocalStorage API** | Persistência de dados | Nativo do navegador |

---

## 📝 Fluxo de Funcionamento

### 1️⃣ **INICIALIZAÇÃO** (Quando abre a página)
```
Navegador carrega HTML
     ↓
Carrega CSS → Página fica bonita
     ↓
Carrega JavaScript → Lógica ativa
     ↓
JS busca dados no LocalStorage
     ↓
Tabela é desenhada com produtos antigos
     ↓
Dashboard mostra estatísticas
```

### 2️⃣ **REGISTRO DE MOVIMENTAÇÃO** (Quando usuario submete formulário)
```
Usuário preenche:
  • Produto: "Caixa Papelão P"
  • Quantidade: 50
  • Tipo: "Entrada"
     ↓
Clica "Registrar Movimentação"
     ↓
JavaScript valida os dados
     ↓
Atualiza saldo do produto
     ↓
Registra no histórico
     ↓
Salva tudo no LocalStorage
     ↓
Tabela e Dashboard atualizam automaticamente
```

### 3️⃣ **BUSCA** (Quando digita no campo de busca)
```
Usuário digita: "CAIXA"
     ↓
JavaScript filtra produtos com "CAIXA" no nome/SKU
     ↓
Tabela é redesenhada com apenas esses produtos
```

### 4️⃣ **EXPORTAÇÃO** (Quando clica "Exportar CSV")
```
Clica "Exportar CSV"
     ↓
JavaScript coleta todo o histórico
     ↓
Transforma em formato CSV
     ↓
Cria arquivo "relatorio_logistica.csv"
     ↓
Navegador faz download automaticamente
     ↓
Arquivo é aberto no Excel ou Google Sheets
```

---

## 📊 Estrutura de Dados

### **Array: `estoque`**
Contém todos os produtos cadastrados

```javascript
let estoque = [
  {
    sku: "PROD-5234",        // Código único (gerado aleatoriamente)
    nome: "CAIXA PAPELÃO P", // Nome do produto (MAIÚSCULAS)
    saldo: 150              // Quantidade disponível
  },
  {
    sku: "PROD-8901",
    nome: "FITA ADESIVA",
    saldo: 45
  }
];
```

### **Array: `historico`**
Registro de TODAS as movimentações (entradas e saídas)

```javascript
let historico = [
  {
    data: "30/08/2026 14:32:15",    // Data e hora
    acao: "ENTRADA",                 // "ENTRADA" ou "SAIDA"
    sku: "PROD-5234",                // SKU do produto
    produto: "CAIXA PAPELÃO P",      // Nome do produto
    qtd: 50                          // Quantidade movimentada
  },
  {
    data: "30/08/2026 15:10:45",
    acao: "SAIDA",
    sku: "PROD-5234",
    produto: "CAIXA PAPELÃO P",
    qtd: 10
  }
];
```

---

## 🎨 Paleta de Cores

```css
--primary: #4f46e5      /* Azul - cor principal, botões */
--success: #10b981      /* Verde - entradas, botão exportar */
--danger: #ef4444       /* Vermelho - alertas, saídas */
--text-strong: #0f172a  /* Cinza escuro - títulos */
--text-soft: #64748b    /* Cinza médio - subtítulos */
--bg-body: #f8fafc      /* Cinza claro - fundo */
--bg-card: #ffffff      /* Branco - cards, formulários */
```

---

## 🔑 Funções Principais (JavaScript)

### 1. **`salvarDados()`**
Salva os arrays `estoque` e `histórico` no LocalStorage do navegador

```javascript
function salvarDados() {
    localStorage.setItem('estoqueApp', JSON.stringify(estoque));
    localStorage.setItem('historicoApp', JSON.stringify(historico));
}
```

**Uso:** Chamada após qualquer alteração nos dados

---

### 2. **`atualizarDashboard()`**
Calcula estatísticas e atualiza os 3 cards do topo

```javascript
function atualizarDashboard() {
    // Calcula total de itens
    const totalEstoque = estoque.reduce((acc, item) => acc + item.saldo, 0);
    
    // Calcula entradas de hoje
    const entradasHoje = historico
        .filter(log => log.acao === 'ENTRADA' && log.data.includes(dataHoje))
        .reduce((acc, log) => acc + log.qtd, 0);
    
    // Calcula saídas de hoje
    const saidasHoje = historico
        .filter(log => log.acao === 'SAIDA' && log.data.includes(dataHoje))
        .reduce((acc, log) => acc + log.qtd, 0);
    
    // Atualiza os cards
    cardTotalItens.textContent = `${totalEstoque} itens`;
    cardEntradasHoje.textContent = `${entradasHoje} itens`;
    cardSaidasHoje.textContent = `${saidasHoje} itens`;
}
```

**Uso:** Chamada sempre que a tabela é redesenhada

---

### 3. **`renderizarTabela(dados)`**
Desenha a tabela com lista de produtos

```javascript
function renderizarTabela(dados) {
    corpoTabela.innerHTML = ''; // Limpa
    
    dados.forEach(item => {
        const linha = document.createElement('tr');
        
        // Alerta se estoque crítico (< 20)
        const estoqueCritico = item.saldo < 20;
        const estiloAlerta = estoqueCritico ? 'color: var(--danger); font-weight: bold;' : '';
        const aviso = estoqueCritico ? '⚠️ Baixo' : '✅ Normal';
        
        linha.innerHTML = `
            <td><strong>${item.sku}</strong></td>
            <td>${item.nome}</td>
            <td style="${estiloAlerta}">${item.saldo} (${aviso})</td>
        `;
        corpoTabela.appendChild(linha);
    });
    
    atualizarDashboard(); // Atualiza cards também
}
```

**Uso:** Chamada quando há entrada, saída ou busca

---

### 4. **Evento: Formulário (submit)**
Registra nova movimentação

```javascript
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    // Coleta dados do formulário
    const nome = document.getElementById('produto').value.trim().toUpperCase();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const tipo = document.getElementById('tipo').value;
    
    // VALIDAÇÕES
    if (quantidade <= 0 || isNaN(quantidade)) {
        alert('Erro: Quantidade inválida');
        return;
    }
    
    let produtoExistente = estoque.find(p => p.nome === nome);
    
    if (tipo === 'saida') {
        if (!produtoExistente || produtoExistente.saldo < quantidade) {
            alert('Erro: Saldo insuficiente');
            return;
        }
        produtoExistente.saldo -= quantidade;
    } else {
        if (produtoExistente) {
            produtoExistente.saldo += quantidade;
        } else {
            produtoExistente = {
                sku: 'PROD-' + Math.floor(Math.random() * 10000),
                nome: nome,
                saldo: quantidade
            };
            estoque.push(produtoExistente);
        }
    }
    
    // Registra no histórico
    historico.push({
        data: new Date().toLocaleString('pt-BR'),
        acao: tipo.toUpperCase(),
        sku: produtoExistente.sku,
        produto: nome,
        qtd: quantidade
    });
    
    salvarDados();
    formulario.reset();
    renderizarTabela(estoque);
});
```

---

### 5. **Evento: Busca (input)**
Filtra produtos conforme digita

```javascript
inputBusca.addEventListener('input', function() {
    const termo = inputBusca.value.toUpperCase();
    const estoqueFiltrado = estoque.filter(item => 
        item.nome.includes(termo) || item.sku.includes(termo)
    );
    renderizarTabela(estoqueFiltrado);
});
```

---

### 6. **Evento: Exportar CSV (click)**
Gera e baixa relatório

```javascript
btnExportar.addEventListener('click', function() {
    if (historico.length === 0) {
        alert('Sem dados para exportar');
        return;
    }
    
    let csvContent = "DATA,ACAO,SKU,PRODUTO,QUANTIDADE\n";
    
    historico.forEach(log => {
        csvContent += `${log.data},${log.acao},${log.sku},${log.produto},${log.qtd}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_logistica.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
```

---

## 📱 Elementos HTML Principais

### **Dashboard (3 Cards)**
```html
<section id="resumo">
    <div class="card">
        <h3>Total em Estoque</h3>
        <p>0 itens</p>  <!-- Atualizado pelo JavaScript -->
    </div>
    <!-- Card 2 e 3 similar -->
</section>
```

### **Formulário**
```html
<section id="movimentacao">
    <form>
        <label for="produto">Produto:</label>
        <input type="text" id="produto" required>
        
        <label for="quantidade">Quantidade:</label>
        <input type="number" id="quantidade" required>
        
        <label for="tipo">Tipo:</label>
        <select id="tipo">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
        </select>
        
        <button type="submit">Registrar Movimentação</button>
    </form>
</section>
```

### **Tabela**
```html
<section id="inventario">
    <h2>Inventário Atual</h2>
    
    <!-- Busca e Exportação -->
    <input type="text" id="busca" placeholder="Buscar...">
    <button id="btnExportar">Exportar CSV</button>
    
    <!-- Tabela -->
    <table>
        <thead>
            <tr>
                <th>Código (SKU)</th>
                <th>Descrição</th>
                <th>Saldo Atual</th>
            </tr>
        </thead>
        <tbody>
            <!-- Preenchida pelo JavaScript -->
        </tbody>
    </table>
</section>
```

---

## 🔐 Persistência de Dados (LocalStorage)

Os dados são salvos no navegador e persistem entre abas e até fechar o navegador!

```javascript
// Salva no navegador (uma única vez)
localStorage.setItem('estoqueApp', JSON.stringify(estoque));
localStorage.setItem('historicoApp', JSON.stringify(historico));

// Recupera dados salvos (no início da página)
let estoque = JSON.parse(localStorage.getItem('estoqueApp')) || [];
let historico = JSON.parse(localStorage.getItem('historicoApp')) || [];
```

**Limitações:**
- Máximo ~5-10MB por domínio (geralmente suficiente)
- Dados perdidos se usuário limpar histórico/cache do navegador
- Cada navegador/computador tem seu próprio LocalStorage isolado

---

## 🚀 Como Usar a Aplicação

### **1. Registrar uma ENTRADA (Adicionar estoque)**
```
1. Abra a página
2. Preencha:
   - Produto: "Caixa Papelão P"
   - Quantidade: 100
   - Tipo: "Entrada"
3. Clique "Registrar Movimentação"
4. Produto será criado ou saldo será incrementado
5. Dashboard atualizará automaticamente
```

### **2. Registrar uma SAÍDA (Remover estoque)**
```
1. Produto deve existir
2. Preencha:
   - Produto: "Caixa Papelão P" (nome EXATO)
   - Quantidade: 25
   - Tipo: "Saída"
3. Clique "Registrar Movimentação"
4. Sistema valida se há saldo suficiente
5. Se OK: saldo é reduzido
```

### **3. Buscar Produtos**
```
1. Digite parte do nome ou SKU no campo "Buscar..."
2. Tabela é filtrada em tempo real
3. Deixe vazio para ver todos novamente
```

### **4. Exportar Relatório**
```
1. Clique "Exportar CSV"
2. Arquivo "relatorio_logistica.csv" é baixado
3. Abra no Excel, Google Sheets, etc.
4. Análise de todas as movimentações
```

---

## ⚠️ Validações Implementadas

1. **Quantidade deve ser > 0** → Erro se tentar registrar 0 ou número negativo
2. **Quantidade deve ser número** → Reject se digitar letras
3. **Produto deve existir para SAÍDA** → Erro se tenta remover produto inexistente
4. **Saldo deve ser suficiente** → Erro se tenta remover mais do que tem
5. **Nomes em MAIÚSCULAS** → Padroniza para evitar "Produto" ≠ "PRODUTO"
6. **Alertas visuais** → Produtos com saldo < 20 ficam VERMELHOS

---

## 🎨 Responsividade (Mobile)

O sistema é **responsivo** - funciona em:
- ✅ Desktop (PC)
- ✅ Tablet
- ✅ Celular (smartphone)

**Como funciona:**
- CSS Flexbox adapta o layout
- Cards em uma linha (desktop) ou coluna (mobile)
- Inputs e botões redimensionam automaticamente

---

## 🔄 Ciclo de Vida de um Produto

```
1. CRIAR (ENTRADA de novo produto)
   - Nome: "Caixa Papelão P"
   - Quantidade: 500
   - Sistema gera SKU: "PROD-7832"
   - Aparece na tabela

2. ATUALIZAR (ENTRADA de produto existente)
   - Quantidade: 100
   - Saldo de "PROD-7832" sobe de 500 para 600

3. VISUALIZAR (Aparece na tabela com ✅ ou ⚠️)
   - Saldo > 20: ✅ Normal (texto cinza)
   - Saldo < 20: ⚠️ Baixo (texto VERMELHO e negrito)

4. REMOVER (SAÍDA)
   - Quantidade: 50
   - Saldo de "PROD-7832" desce de 600 para 550
   - Nota: Produto NÃO é apagado (continua no histórico)

5. EXPORTAR (Relatório)
   - Todas as movimentações aparecem no CSV
   - Histórico é imutável (não pode editar)
```

---

## 🛠️ Melhorias Futuras Possíveis

1. **Backend/Banco de Dados** - Dados em servidor (não só navegador)
2. **Autenticação** - Login/password para múltiplos usuários
3. **Gráficos** - Visualizar tendências de estoque
4. **Editar/Deletar** - Corrigir movimentações erradas
5. **Categorias** - Organizar produtos por tipo
6. **Movimentações agendadas** - Prever entradas/saídas
7. **Integração com APIs** - Conexão com sistemas ERP
8. **Mobile App** - Versão nativa para celular

---

## 📚 Referências de Técnicas

| Técnica | Descrição | Linha |
|---------|-----------|-------|
| **LocalStorage** | Armazenamento local do navegador | script.js:5-6 |
| **DOM Manipulation** | Criar/modificar elementos HTML | Vários |
| **Event Listeners** | Ouvir cliques/submissões | script.js:170+ |
| **Array Methods** | map(), filter(), reduce(), find() | Vários |
| **String Methods** | trim(), toUpperCase(), includes() | Vários |
| **Date API** | Data e hora | script.js:53 |
| **Blob API** | Criar arquivo para download | script.js:330 |
| **JSON** | Serialização de dados | script.js:5-6 |
| **Template Literals** | Strings com variáveis (`) | Vários |
| **Arrow Functions** | Funções lambda/anônimas | Vários |

---

## 📞 Suporte e Debug

### **Dados não salvam?**
- Verifique se LocalStorage está habilitado no navegador
- Navegadores privados/anônimos NÃO salvam persistentemente

### **Tabela não atualiza?**
- F5 para recarregar página
- Abra console (F12) e procure por erros em vermelho

### **Não consigo exportar?**
- Verifique se há movimentações no histórico
- Navegador pode bloquear downloads (verificar barra de notificações)

### **Ver dados salvos (Console):**
```javascript
// Abra F12 → Console e execute:
console.log(localStorage.getItem('estoqueApp'));
console.log(localStorage.getItem('historicoApp'));
```

### **Limpar tudo (reset):**
```javascript
// Abra F12 → Console e execute:
localStorage.removeItem('estoqueApp');
localStorage.removeItem('historicoApp');
location.reload(); // Recarrega a página
```

---

## 📄 Versão do Documento

- **Versão:** 1.0
- **Data:** 30 de agosto de 2026
- **Status:** ✅ Completo e Funcional
- **Últimas modificações:** Adição de comentários detalhados em todas as linhas

---

**🎉 Parabéns! Seu sistema de gestão de estoque está completamente documentado e pronto para uso!**
