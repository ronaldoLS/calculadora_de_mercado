const btnAdicionar = document.getElementById("btnAdicionar");
const olListaProdutos = document.getElementById("listaProdutos");
const inputProduto = document.getElementById("txtProduto");
const inputPreco = document.getElementById("txtPreco");
const inputQuantidade = document.getElementById("quantidade");
const spanEuros = document.getElementById("euros");
const spanCentavos = document.getElementById("centavos");
const h4Subtotal = document.getElementById("subtotal");
const enter = 13;
let produtos = [];
let indexEditar = -1;
var flagQuantidade = false;


document.addEventListener("DOMContentLoaded", () => {
    recuperarLista();
    mostarProdutos();

});

btnAdicionar.addEventListener('click', adicionarProduto);

function verificaTecla(event) {
    if (event.keyCode == enter)
        adicionarProduto();
}

function inputsPreenchidos() {
    return inputProduto.value != "" && inputPreco.value != "" && inputQuantidade.value != ""
}

function temEsteProduto() {
    return produtos.some(p => p.nome === inputProduto.value)
}

function limparCampos() {
    inputProduto.value = inputPreco.value = "";
    flagQuantidade = false;
    inputQuantidade.value = "";
    h4Subtotal.innerHTML = "€ 0,00";
}

function mostarProdutos() {
    olListaProdutos.innerHTML = "";
    produtos.forEach((p, index) => {
        var preco = p.preco;
        var quantidade = ("" + p.quantidade).replace(".", ",");
        var subtotal = p.preco * p.quantidade;
        subtotal = subtotal.toFixed(2).replace(".", ",");

        preco = p.preco.toLocaleString('pt-GB', { style: 'currency', currency: 'EUR' });

        olListaProdutos.innerHTML += `
        <!-- produto${index} -->
            <li id="produto${index}" class="produto">
                <a href="#" onclick="editarProduto(${index})">
                    <h2 class="descricaoProduto" >${p.nome}</h2>
                    <div class="detalhe">
                        <h4 class="subTitulo">Preço/Uni.</h4>
                        <p class="preco">${preco}</p>
                    </div>
                    <div class="detalhe">
                        <h4 class="subTitulo">Qtd.</h4>
                        <p class="quantidade">${quantidade}</p>
                    </div>
                    <div class="detalhe">
                        <h4 class="subTitulo">subtotal</h4>
                        <p class="subtotal">€ ${subtotal}</p>
                    </div>
                </a>
                <div class="detalhe btnDeletar" onclick="apagarProduto(${index})">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
            </li>
        `;
    });

    mostrarTotal();
}

function adicionarProduto() {
    let produto = {};
    if (inputsPreenchidos()) {
        produto.nome = inputProduto.value.trim();

        produto.preco = inputPreco.value.replace("€ ", "");
        produto.preco = produto.preco.replace(",", ".");
        produto.preco = parseFloat(produto.preco);


        produto.quantidade = inputQuantidade.value.replace(",", ".");
        produto.quantidade = parseFloat(produto.quantidade);

        if (indexEditar == -1) {
            produtos.unshift(produto);
            limparCampos();
        }

        else {
            produtos[indexEditar] = produto;
            btnAdicionar.innerHTML = "Adicionar";
            indexEditar = -1;
            limparCampos();
        }

    }

    mostarProdutos();
    armazernarLista();
}

function editarProduto(index) {
    inputProduto.value = produtos[index].nome;
    inputPreco.value = produtos[index].preco.toLocaleString('pt-GB', { style: 'currency', currency: 'EUR' });
    inputQuantidade.value = ("" + produtos[index].quantidade).replace(".", ",");
    flagQuantidade = true;
    let subtotal = produtos[index].preco * produtos[index].quantidade;
    mostrarSubtotal(subtotal);
    btnAdicionar.innerHTML = "Atualizar";
    indexEditar = index;
}

function apagarProduto(index) {
    produtos.splice(index, 1);
    armazernarLista();
    mostarProdutos();
}

function apagarTudo() {
    produtos = [];
    armazernarLista();
    mostarProdutos();
}

function maisQuantidade() {
    let qtd = parseFloat(inputQuantidade.value.replace(",", "."));
    if (qtd < 99)
        qtd++;
    inputQuantidade.value = ("" + parseFloat((qtd).toFixed(1))).replace(".", ",");
    calcularSubtotal();
}

function menosQuantidade() {
    let qtd = parseFloat(inputQuantidade.value.replace(",", "."));
    if (qtd > 1)
        qtd--;
    inputQuantidade.value = ("" + parseFloat((qtd).toFixed(1))).replace(".", ",");
    calcularSubtotal();
}

function mostrarpreco() {
    var valor = validarPreco();
    inputPreco.value = valor.toLocaleString('pt-GB', { style: 'currency', currency: 'EUR' });
    return valor;
}

function validarPreco() {
    var valor = inputPreco.value.replace(/\D/g, '');
    valor = parseInt(valor);
    valor = valor >= 0 ? valor : 0;
    valor = valor / 100;

    return valor;
}

function mostrarSubtotal(subtotal) {
    subtotal = "€ " + subtotal.toFixed(2).replace(".", ",");
    h4Subtotal.innerHTML = subtotal;
}

function calcularSubtotal() {
    var preco = mostrarpreco();
    var quantidade = parseFloat(inputQuantidade.value.replace(",", "."));
    let subtotal = 0;
    console.log(quantidade);
    
        if (!(quantidade >= 0)) 
            inputQuantidade.value = 1;
  

    if (preco > 0 && quantidade > 0)
        subtotal = preco * quantidade;
    mostrarSubtotal(subtotal);
}

function calcularTotal() {
    let soma = 0;
    produtos.forEach(element => {
        soma += parseFloat(element.preco) * parseFloat(element.quantidade);
    });
    return soma;
}

function mostrarTotal() {
    let total = calcularTotal();
    let euros = parseInt(total);
    let centavos = (total - euros).toFixed(2);

    // formata o valor no formato moeda e apresenta na tela
    spanEuros.innerHTML = "€ " + (euros > 999 ? (euros / 1000) : euros);
    spanCentavos.innerHTML = centavos.substring(2, 4);
}

function armazernarLista() {
    let produtosJSON = JSON.stringify(produtos);
    localStorage.setItem("produtosJSON", produtosJSON);
}

function recuperarLista() {
    let produtosJSON = localStorage.getItem("produtosJSON");
    if (produtosJSON)
        produtos = JSON.parse(produtosJSON);
}
