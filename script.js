// 1. SELECIONAR OS ELEMENTOS DA TELA
// Pega o formulário inteiro
const formulario = document.querySelector('form');
// Pega o corpo da tabela (onde as linhas ficam)
const corpoTabela = document.querySelector('tbody');

// 2. OUVIR O CLIQUE NO BOTÃO
// Adiciona um "escutador" que dispara quando o formulário é enviado (submit)
formulario.addEventListener('submit', function(evento) {
    
    // Impede o comportamento padrão do navegador de recarregar a página ao salvar
    evento.preventDefault();

    // 3. CAPTURAR OS DADOS DIGITADOS
    const nomeProduto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    const tipo = document.getElementById('tipo').value;

    // Gera um código SKU aleatório apenas para simular o sistema real
    const sku = "PROD-" + Math.floor(Math.random() * 1000);

    // 4. CRIAR UMA NOVA LINHA PARA A TABELA
    const novaLinha = document.createElement('tr');

    // Preenche a nova linha com as colunas (td) e os dados capturados
    // O sinal de crase (`) permite misturar texto com variáveis ${}
    novaLinha.innerHTML = `
        <td>${sku}</td>
        <td>${nomeProduto} <br><small style="color: #7f8c8d;">(${tipo})</small></td>
        <td>${quantidade}</td>
    `;

    // 5. INSERIR A LINHA E LIMPAR O FORMULÁRIO
    // Adiciona a nova linha no final do corpo da tabela
    corpoTabela.appendChild(novaLinha);

    // Limpa os campos de digitação para o próximo registro
    formulario.reset();
});