const btnAdicionar = document.getElementById("btnAdicionar");
const olListaProdutos = document.getElementById("listaProdutos");
const inputProduto = document.getElementById("txtProduto");
const inputPreco = document.getElementById("txtPreco");
const inputQuantidade = document.getElementById("quantidade");
const spanEuros = document.getElementById("euros");
const spanCentavos = document.getElementById("centavos");
const h4Subtotal = document.getElementById("subtotal");
let produtos = [];
let indexEditar = -1;


function inputsPreenchidos() {
    return inputProduto.value != "" && inputPreco.value != "" && inputQuantidade.value != ""
}

function temEsteProduto() {
    return produtos.some(p => p.nome === inputProduto.value)
}


btnAdicionar.addEventListener('click', (evento) => {
    let produto = {};
    if (inputsPreenchidos()) {
        produto.nome = inputProduto.value.trim();
        produto.preco = inputPreco.value.trim();
        produto.quantidade = inputQuantidade.value.trim();
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
});

function limparCampos() {
    inputProduto.value = inputPreco.value = "";
    inputQuantidade.value = 1;
    h4Subtotal.innerHTML = "€ 0,00";
}

function editarProduto(index) {
    inputProduto.value = produtos[index].nome;
    inputPreco.value = produtos[index].preco;
    inputQuantidade.value = produtos[index].quantidade;
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

function apagarTudo(){
    produtos = [];
    armazernarLista();
    mostarProdutos();
}

function maisQuantidade() {
    let qtd = parseInt(inputQuantidade.value);
    if (qtd < 99)
        inputQuantidade.value = qtd + 1;
    calcularSubtotal()
}
function menosQuantidade() {
    let qtd = parseInt(inputQuantidade.value);
    if (qtd > 1)
        inputQuantidade.value = qtd - 1;
    calcularSubtotal()
}

function calcularSubtotal() {
    let subtotal = inputPreco.value * inputQuantidade.value;
    mostrarSubtotal(subtotal);
}

function mostrarSubtotal(subtotal) {
    subtotal = "€ " + subtotal.toFixed(2).replace(".", ",");
    // calcula e defeine o tamanho da font conforme o tamanho da string
    h4Subtotal.style.fontSize = ((6 * 1.3) / subtotal.length) + "rem";
    h4Subtotal.innerHTML = subtotal;
}

function calcularTotal() {
    let soma = 0;
    produtos.forEach(element => {
        soma += element.preco * element.quantidade
    });
    return soma;
}

function mostrarTotal() {
    let total = calcularTotal();
    let euros = parseInt(total);
    let centavos = (total - euros).toFixed(2);

    spanEuros.innerHTML = "€ " + euros;
    spanCentavos.innerHTML = centavos.substring(2, 4);
}

function mostarProdutos() {
    olListaProdutos.innerHTML = "";
    produtos.forEach((p, index) => {

        olListaProdutos.innerHTML += `
        <!-- produto${index} -->
            <li id="produto${index}" class="produto">
                <a href="#" onclick="editarProduto(${index})">
                    <h2 class="descricaoProduto" >${p.nome}</h2>
                    <div class="detalhe">
                        <h4 class="subTitulo">Preço/Uni.</h4>
                        <p class="preco">€ ${p.preco.replace(".",",")}</p>
                    </div>
                    <div class="detalhe">
                        <h4 class="subTitulo">Qtd.</h4>
                        <p class="quantidade">${p.quantidade.replace(".",",")}</p>
                    </div>
                    <div class="detalhe">
                        <h4 class="subTitulo">subtotal</h4>
                        <p class="subtotal">€ ${(p.preco * p.quantidade).toFixed(2).replace(".",",")}</p>
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

function armazernarLista() {
    let produtosJSON = JSON.stringify(produtos);
    localStorage.setItem("produtosJSON", produtosJSON);
}

function recuperarLista() {
    let produtosJSON = localStorage.getItem("produtosJSON");
    if (produtosJSON)
        produtos = JSON.parse(produtosJSON);


}
document.addEventListener("DOMContentLoaded", () => {
    recuperarLista();
    mostarProdutos();
    inputQuantidade.value = 1;
});