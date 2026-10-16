# 📦 Sistema de Gestão de Estoque

![Versão](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Licença](https://img.shields.io/badge/license-MIT-green.svg)
![Tecnologias](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20JavaScript-orange.svg)

Aplicação web *Vanilla Fullstack/Front-end* para controle e gestão de estoque em tempo real. Desenvolvida focado em **Clean Code**, **Performance**, **Acessibilidade (A11y)** e **Segurança contra vulnerabilidades comuns (XSS e CSV Injection)**.

---

## 📋 Sumário

- [Demonstração e Recursos](#-demonstração-e-recursos)
- [Arquitetura de Segurança e Performance](#-arquitetura-de-segurança-e-performance)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Especificações Técnicas](#-especificações-técnicas)
  - [HTML5 Semântico](#html5-semântico)
  - [CSS3 Moderno](#css3-moderno)
  - [JavaScript (ES6+)](#javascript-es6)
- [Próximas Evoluções](#-próximas-evoluções)
- [Licença](#-licença)

---

## 🚀 Demonstração e Recursos

- 📊 **Dashboard Dinâmico**: Indicadores em tempo real para Total em Estoque, Entradas do Dia e Saídas do Dia.
- 📥 **Registro de Movimentação**: Entrada e saída de produtos com atualização automática de saldo e geração de histórico.
- 🏷️ **Geração de SKU Único**: Atribuição automática de código identificador utilizando a API criptográfica do navegador (`crypto.randomUUID()`).
- ⚠️ **Alertas de Estoque Crítico**: Sinalização visual automática para itens com saldo inferior a 20 unidades.
- 🔍 **Busca em Tempo Real (Debounced)**: Filtragem por nome ou SKU otimizada para alto desempenho.
- 📄 **Exportação CSV Profissional**: Download do histórico com codificação UTF-8 BOM (`\uFEFF`), garantindo leitura correta de acentuação no Microsoft Excel e Google Sheets.
- 💾 **Persistência Local**: Armazenamento offline dos dados via `localStorage`.

---

## 🛡️ Arquitetura de Segurança e Performance

| Desafio de Engenharia | Solução Aplicada | Benefício |
| :--- | :--- | :--- |
| **Vulnerabilidade XSS (Cross-Site Scripting)** | Função de sanitização `escaparHTML()` aplicada a todos os inputs do usuário antes do inserto no DOM. | Impede a execução de scripts maliciosos na página. |
| **Quebra de Sintaxe e Injeção em CSV** | Sanitização de aspas duplas (`"`) e prefixagem com Byte Order Mark UTF-8 (`\uFEFF`). | Compatibilidade perfeita com o Excel e proteção contra execução de fórmulas em planilhas. |
| **Gargalos de Renderização (Reflow/Repaint)** | Inserção de linhas via `DocumentFragment` no DOM. | Agrupa alterações na memória antes de atualizar a tela em um único ciclo. |
| **Disparos Excessivos na Busca** | Algoritmo de *Debouncing* com intervalo de 250ms. | Reduz processamento desnecessário durante a digitação rápida do usuário. |
| **Colisão de SKUs (IDs Duplicados)** | API `crypto.randomUUID()` com *fallback* numérico. | Garante a unicidade de identificação de novos produtos. |

---

## 📁 Estrutura do Projeto

gestao-de-estoque/
│
├── index.html       # Markup semântico, acessível e estruturado
├── style.css        # Estilização modular com variáveis CSS e responsividade
├── script.js        # Regras de negócio, sanitização, manipulação do DOM e storage
└── README.md        # Documentação completa do repositório

---

## ⚙️ Como Executar

Por ser uma aplicação baseada em tecnologia web nativa (*Vanilla*), não é necessário instalar dependências via `npm` ou `yarn`.

1. **Clone o repositório**:
   ```bash
   git clone (https://github.com/LeticiaMS89/sistema-de-estoque.git)
   ```

1. **Navegue até a pasta do projeto**:
   ```text
   cd gestao-de-estoque
   ```
2.**Abra o arquivo index.html**:

Dê um duplo clique no arquivo index.html para abri-lo no seu navegador padrão; OU

Utilize a extensão Live Server no VS Code para servir a aplicação localmente.

## 🛠️ Especificações Técnicas
HTML5 Semântico
Estruturação focada em acessibilidade com o uso das tags <header>, <main>, <section>, <table>, <form>.

Inclusão de rótulos de acessibilidade (aria-label) nos campos de entrada e botões de ação.

Inclusão de restrições nativas como required e min="1" no formulário.

CSS3 Moderno
Design System leve: Utilização de variáveis CSS (:root) para gerenciamento de cores, raios de borda e velocidades de transição.

Layout Responsivo: Estruturado com Flexbox e consultas de mídia (@mediaqueries) adaptadas para telas móveis (Smartphones e Tablets).

Acessibilidade Visual: Utilização de seletores :focus-visible para suporte à navegação por teclado (Tab).

JavaScript (ES6+)
Manipulação do DOM resiliente: Seleção de elementos feita prioritariamente via IDs únicos (document.getElementById).

Padrão de Estado: Leitura e gravação resilientes no localStorage encapsuladas em blocos de tratamento de exceção try/catch.

Clean Code: Funções com responsabilidade única e comentários descritivos em todo o fluxo da lógica.

## 🔮 Próximas Evoluções
[ ] Implementação de edição e exclusão manual de produtos cadastrados.

[ ] Integração com banco de dados remoto (ex: Node.js + PostgreSQL / Firebase).

[ ] Paginação na tabela de inventário para suporte a grandes volumes de dados (10.000+ itens).

[ ] Gráficos visuais de movimentação semanal/mensal utilizando a biblioteca Chart.js.

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
   
