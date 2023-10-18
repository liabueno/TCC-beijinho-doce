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

async function codificarImagemEmBase64(img){
  return new Promise((resolve, reject) => {
    try {
      let imageBase64;
      if (inputImageElement.files.length > 0) { // Verifique se um arquivo foi selecionado
        const file = inputImageElement.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          imageBase64 = e.target.result.split(',')[1]; 
          console.log('Imagem codificada em base64:', imageBase64);
          reader.readAsDataURL(file);
          resolve(imageBase64)
        }
      } else {
        console.log('Caminho da Imagem não encontrado!');
        imageBase64 = ""; 
        resolve(imageBase64)
      }


    } catch (error) {
      resolve({error: true})
    }
  })
}

  
const salvarButton = document.querySelector('#salvar');
salvarButton.addEventListener('click', async function(event) {
  event.preventDefault();

  const nomeProd = document.querySelector('#input_nome').value;
  const precoProd = document.querySelector('#input_preco').value;
  const descricaoProd = document.querySelector('#input_desc').value;
  const tipoProd = document.querySelector('#input_tipo').value;
  const inputImageElement = document.querySelector('#input_image'); // Seletor do input de arquivo
  const dataCadastroProduto = new Date();
  let imagemCodificada;

    await codificarImagemEmBase64(inputImageElement)
    .then(response => {
      imagemCodificada = response
    })

    addDoc(collectionProdutos, {
      desc: descricaoProd,
      nome: nomeProd,
      preco: precoProd,
      tipo: tipoProd,
      image: imagemCodificada, 
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
      <td><center><button type="button" class="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-pencil-fill lapis" viewBox="0 0 16 16">
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
    </svg></button></center></td>
      <td><center><button type="button" class="btn  delete-button btn-excluir" data-product-id="${produto.id}" data-product-name="${produto.nome}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-trash3-fill excluir delete-button" data-product-id="${produto.id}" data-product-name="${produto.nome}" viewBox="0 0 16 16">
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
    </svg></button></center></td>
    `;
    // <td><center><button type="button" class="btn btn-secondary btn-atualizar"></button></center></td>
    // <td><center><button type="button" class="btn btn-danger delete-button btn-excluir" data-product-id="${produto.id}" data-product-name="${produto.nome}"></button></center></td>
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

async function pesquisarNoFirestore(palavraRecebida) {
  let termo = palavraRecebida.charAt(0).toUpperCase() + palavraRecebida.slice(1).toLowerCase();
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
        <td><center><button type="button" class="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill lapis" viewBox="0 0 16 16">
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
      </svg></button></center></td>
        <td><center><button type="button" class="btn btn-danger delete-button" data-product-id="${doc.id}" data-product-name="${doc.data().nome}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill excluir delete-button" data-product-id="${doc.id}" data-product-name="${doc.data().nome}" viewBox="0 0 16 16">
        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
      </svg></button></center></td>
        `;

        // <td><center><button type="button" class="btn btn-secondary btn-atualizar"></button></center></td>
        // <td><center><button type="button" class="btn btn-danger delete-button btn-excluir" data-product-id="${doc.id}" data-product-name="${doc.data().nome}">
        // </button></center></td>
      listagens.appendChild(newRow);
    }
  });
}




// Fora da função getProdutos(), adicione o event listener para os botões de exclusão
document.addEventListener('click', function (event) {
  console.log(event.target.classList)
  if (event.target.classList.contains('delete-button')) {
    const productId = event.target.getAttribute('data-product-id');
    const productName = event.target.getAttribute('data-product-name');
    confirmarExclusao(productId, productName);
  }
});



function confirmarExclusao(id, nome) {
  Swal.fire({
    title: 'Tem certeza?',
    text: `O produto "${nome}" será excluído permanentemente`,
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



