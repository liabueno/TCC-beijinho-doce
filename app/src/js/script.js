import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, getDocs , orderBy, doc, deleteDoc, where } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA5DWm_hrQPn8RyxGu-ZhnbDHCvdxxG7MQ',
  authDomain: 'doceria-85ffc.firebaseapp.com',
  projectId: 'doceria-85ffc',
  storageBucket: 'doceria-85ffc.appspot.com',
  messagingSenderId: '636432934299',
  appId: '1:636432934299:web:13348abba3cf6f87d0ad3e',
  measurementId: 'G-2R6C10H9Y2'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const collectionProdutos = collection(db, 'produtos')
await getProdutos()

  
const salvarButton = document.querySelector('#salvar');
salvarButton.addEventListener('click', function (event) {
  event.preventDefault();

  const nomeProd = document.querySelector('#input_nome').value;
  const precoProd = document.querySelector('#input_preco').value;
  const descricaoProd = document.querySelector('#input_desc').value;
  const tipoProd = document.querySelector('#input_tipo').value;
  const inputImageElement = document.querySelector('#input_image'); // Seletor do input de arquivo
  const dataCadastroProduto = new Date();
  let imageBase64;

    if (inputImageElement.files.length > 0) { // Verifique se um arquivo foi selecionado
      const file = inputImageElement.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        imageBase64 = e.target.result.split(',')[1]; 
        console.log('Imagem codificada em base64:', imageBase64);
        reader.readAsDataURL(file);
      }
    } else {
      imageBase64 = ""; 
    }

    addDoc(collectionProdutos, {
      desc: descricaoProd,
      nome: nomeProd,
      preco: precoProd,
      tipo: tipoProd,
      image: imageBase64, 
      dataCadastro: dataCadastroProduto
    })
    .then(doc => console.log('Documento criado com o ID', doc.id))
    .then(() => {
      document.getElementById('#input_nome').value = " ";
      document.getElementById('#input_preco').value =  " ";
      document.getElementById('#input_desc').value = " ";
      document.getElementById('#input_tipo').value = " ";
      document.getElementById('#input_image').value = " "; // Seletor do input de arquivo
    })
    .catch(console.log)
    .finally(() => {
      getProdutos()
    });
    
});


function atualizarTabela(produtos) {
  console.log(produtos)
  let id = 0;
  const listagens = document.getElementById('tabela');
  listagens.innerHTML = '';

  produtos.forEach((produto) => {
    id++;
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
      <th scope="row">${id}</th>
      <td>${produto.nome}</td>
      <td>${produto.preco}</td>
      <td>${produto.desc}</td>
      <td>${produto.tipo}</td>
      <td><center><button type="button" class="btn btn-secondary funcoes"><img src="./src/image/lapis.png" class="lapis"></button></center></td>
      <td><center><button type="button" class="btn btn-danger delete-button funcoes" data-product-id="${produto.id}" data-product-name="${produto.nome}"><img src="./src/image/excluir.png" class="excluir"></button></center></td>
    `;
    listagens.appendChild(newRow);
  });
}


const botaoPesquisar = document.querySelector('#botao__pesquisar');
const inputProduto = document.querySelector('#input_produto');

botaoPesquisar.addEventListener('click', function () {
  const termoPesquisa = inputProduto.value;
  if(termoPesquisa!=""){
    pesquisarNoFirestore(termoPesquisa);
  }
  else{
    getProdutos()
  }
});

inputProduto.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const termoPesquisa = inputProduto.value;
    if(termoPesquisa!=""){
      pesquisarNoFirestore(termoPesquisa);
    }
    else{
      getProdutos()
    }
  }
});

async function pesquisarNoFirestore(termo) {
  console.log(termo)
  const pesquisaQuery = query(
    collectionProdutos,
    orderBy('nome'),
    orderBy('dataCadastro', 'asc'),
    where('nome', '>=', termo),
    where('nome', '<=', termo+'\uf8ff'),
  );

  const querySnapshot = await getDocs(pesquisaQuery);

  const produtosFiltrados = [];
  querySnapshot.forEach((doc) => {
    produtosFiltrados.push({
      id: doc.id,
      nome: doc.data().nome,
      preco: doc.data().preco,
      desc: doc.data().desc,
      tipo: doc.data().tipo,
    });
  });

  atualizarTabela(produtosFiltrados);
}


async function getProdutos(){
  let id=0;
  let listagens = document.getElementById('tabela');
  listagens.innerHTML = "";
  const produtosListagem = query(collectionProdutos, orderBy("dataCadastro", "asc"));
  const querySnapshot = await getDocs(produtosListagem);
  querySnapshot.forEach((doc) => {
    if (doc.data().nome !== "") {
      id++;
      let newRow = document.createElement('tr');
      newRow.innerHTML = `
        <th scope="row">${id}</th>
        <td>${doc.data().nome}</td>
        <td>${doc.data().preco}</td>
        <td>${doc.data().desc}</td>
        <td>${doc.data().tipo}</td>
        <td><center><button type="button" class="btn btn-secondary funcoes"><img src="./src/image/lapis.png" class="lapis"></button></center></td>
        <td><center><button type="button" class="btn btn-danger delete-button funcoes" data-product-id="${doc.id}" data-product-name="${doc.data().nome}"><img src="./src/image/excluir.png" class="excluir"></button></center></td>
        `;
      listagens.appendChild(newRow);
    }
  });
}





// Fora da função getProdutos(), adicione o event listener para os botões de exclusão
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-button')) {
    const productId = event.target.getAttribute('data-product-id');
    const productName = event.target.getAttribute('data-product-name');
    confirmarExclusao(productId, productName);
  }
});



function confirmarExclusao(id, nome) {
  Swal.fire({
    title: 'Tem certeza?',
    text: `O produto "${nome}" será excluído permanentemente.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      excluirProduto(id);
    }
  });
}


async function excluirProduto(id) {
  try {
    // Use o Firebase Firestore para excluir o produto pelo ID
    await deleteDoc(doc(db, 'produtos', id));
    Swal.fire('Sucesso!', 'Produto excluído com sucesso!', 'success');
    // Atualize a lista de produtos após a exclusão
    getProdutos();
  } catch (error) {
    console.error('Erro ao excluir o produto:', error);
    Swal.fire('Erro!', 'Ocorreu um erro ao excluir o produto.', 'error');
  }
}



