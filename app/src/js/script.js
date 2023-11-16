import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, getDocs , orderBy, doc, deleteDoc, where, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';

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

// PEGAR OS PRODUTOS
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
        <th scope="row"><center>${id}</center></th>
        <td><center>${doc.data().nome}</center></td>
        <td><center>${doc.data().preco}</center></td>
        <td><center>${doc.data().desc}</center></td>
        <td><center>${doc.data().restricao}</center></td>
        <td><center>${doc.data().peso}</center></td>
        <td><center>${doc.data().tipo}</center></td>
        <td>
          <center>
                <img src="./src/image/lapis.svg" class="btn update-button" id="botao__atualizar"  data-bs-toggle="modal" data-bs-target="#atualizarModal" data-product-id="${doc.id}" data-product-name="${doc.data().nome}" data-product-restricao="${doc.data().restricao}" data-product-peso="${doc.data().peso}" data-product-tipo="${doc.data().tipo}" data-product-desc="${doc.data().desc}" data-product-preco="${doc.data().preco}" data-product-image="${doc.data().image}">
          </center>
        </td>

        <td>
          <center>
              <img src="./src/image/lixeira.svg" class="btn delete-button" data-product-id="${doc.id}" data-product-name="${doc.data().nome}">
          </center>
        </td>
        `;

      listagens.appendChild(newRow);
    }
  });
}

// ATUALIZAR A LISTA
function atualizarTabela(produtos) {
  console.log(produtos)
  let idInterno = 0;
  const listagens = document.getElementById('tabela');
  listagens.innerHTML = '';

  produtos.forEach((produto) => {
    idInterno++;
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
      <th scope="row"><center>${idInterno}<center></th>
      <td><center>${produto.nome}</center></td>
      <td><center>${produto.preco}</center></td>
      <td><center>${produto.desc}</center></td>
      <td><center>${produto.restricao}</center></td>
      <td><center>${produto.peso}</center></td>
      <td><center>${produto.tipo}</center></td>
      <td>
      <center>
        <img src="./src/image/lapis.svg" class="btn update-button" id="botao__atualizar"  data-bs-toggle="modal" data-bs-target="#atualizarModal" data-product-id="${produto.id}" data-product-name="${produto.nome}" data-product-restricao="${produto.restricao}" data-product-peso="${produto.peso}" data-product-tipo="${produto.tipo}" data-product-desc="${produto.desc}" data-product-preco="${produto.preco}" data-product-image="${produto.img}">
      </center>
    </td>

    <td>
      <center>
        <img src="./src/image/lixeira.svg" class="btn delete-button" data-product-id="${produto.id}" data-product-name="${produto.nome}">
      </center>
    </td>
    `;

    listagens.appendChild(newRow);
  });
}

// CONSULTAR NO FIRESTORE
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
      restricao: doc.data().restricao,
      peso: doc.data().peso,
      tipo: doc.data().tipo,
      img: doc.data().image
    });
  });

  atualizarTabela(produtosFiltrados);
}

// CONSULTAR NO APP
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

// CODIFICAR IMAGEM PARA GUARDAR
async function codificarImagemEmBase64(inputImageElement) {
  return new Promise((resolve, reject) => {
    try {
      if (inputImageElement.files.length > 0) {
        const file = inputImageElement.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageBase64 = e.target.result.split(',')[1];
          console.log('Imagem codificada em base64:', imageBase64);
          resolve(imageBase64);
        }

        reader.readAsDataURL(file); 
      } else {
        console.log('Caminho da Imagem não encontrado!');
        const imageBase64 = "";
        resolve(imageBase64);
      }
    } catch (error) {
      console.error(error);
      resolve({ error: true });
    }
  });
}

// DECODIFICAR PARA EXIBIR 
async function decodificarImagemBase64(imageBase64) {
  return new Promise((resolve, reject) => {
    try {
      if (imageBase64) {
        const decodedImageData = atob(imageBase64);
        resolve(decodedImageData);
      } else {
        console.log('Imagem base64 vazia.');
        resolve('');
      }
    } catch (error) {
      console.error('Erro ao decodificar a imagem base64:', error);
      resolve({ error: true });
    }
  });
}

// CADASTRAR
const salvarButton = document.querySelector('#salvar');
salvarButton.addEventListener('click', async function(event) {
  event.preventDefault();

  const nomeProd = document.querySelector('#input_nome').value;
  const precoProd = document.querySelector('#input_preco').value;
  const descricaoProd = document.querySelector('#input_desc').value;
  const pesoProd = document.querySelector('#input_peso').value;
  const tipoProd = document.querySelector('#input_tipo').value;
  const inputImageElement = document.querySelector('#input_image_cadastrar');
  const dataCadastroProduto = new Date();
  let imagemCodificada;
  let produtoParaCadastrar;
  const restricaoCheckBoxes = document.querySelectorAll('#input_restricao input[type="checkbox"]');
  const restricoesSelecionadas = Array.from(restricaoCheckBoxes)
  .filter(checkbox => checkbox.checked)
  .map(checkbox => checkbox.value);

  const restricaoProd = restricoesSelecionadas.join('<br>');

    await codificarImagemEmBase64(inputImageElement)
    .then(response => {
      imagemCodificada = response
    })
    .then(() => {
      produtoParaCadastrar = {
        dataCadastro: dataCadastroProduto,
        desc: descricaoProd,
        nome: nomeProd,
        preco: precoProd,
        restricao: restricaoProd,
        peso: pesoProd,
        tipo: tipoProd
      }
  
      if(imagemCodificada.error==true){
        produtoParaCadastrar.image = " ";
      }
      else{
        produtoParaCadastrar.image = imagemCodificada
      }
    })
    .then(() => {
      addDoc(collectionProdutos, produtoParaCadastrar)
      .then(doc => console.log('Documento criado com o ID', doc.id))
      .then(() => {
        document.getElementById('input_nome').value = "";
        document.getElementById('input_preco').value =  "";
        document.getElementById('input_desc').value = "";
        document.getElementById('input_peso').value = "";
        document.getElementById('input_restricao').value = ""; 
        document.getElementById('opcao_padrao').selected = true;
        document.getElementById('input_image_cadastrar').value = "";
      })
      .catch(console.log)
      .finally(() => {
        getProdutos()
      });
    })
});

// X DA IMAGEM DO CADASTRAR
const xImagemCadastrar = document.getElementById('x_imagem_cadastrar');

xImagemCadastrar.addEventListener('click', function() {
  document.getElementById('input_image_cadastrar').value = "";
});

// EXIBIR IMAGEM NO CADASTRAR
const inputElementCadastrar = document.getElementById('input_image_cadastrar');

inputElementCadastrar.addEventListener('change', function() {
  const selectedFile = inputElementCadastrar.files[0]; // Obtém o arquivo selecionado
  document.getElementById('show_image_cadastrar').src = selectedFile.path;
  }
);

// ALERT DO EXCLUIR
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
      console.log('IsConfirmed');
      excluirProduto(id);
    }
  });
}

// DELETAR
async function excluirProduto(id) {
  try {
    await deleteDoc(doc(db, 'produtos', id));
    Swal.fire('Sucesso!', 'Produto excluído com sucesso!', 'success');
    getProdutos();
  } catch (error) {
    console.error('Erro ao excluir o produto:', error);
    Swal.fire('Erro!', 'Ocorreu um erro ao excluir o produto.', 'error');
  }
}

// ATUALIZAR
const updateButton = document.querySelector('#atualizar');
updateButton.addEventListener('click', async function(event) {
  event.preventDefault();

  const idProduto = document.getElementById('show_id_atualizar').textContent;
  const nomeProd = document.querySelector('#input_nome_atualizar').value;
  const precoProd = document.querySelector('#input_preco_atualizar').value;
  const descricaoProd = document.querySelector('#input_desc_atualizar').value;
  const pesoProd = document.querySelector('#input_peso_atualizar').value;
  const tipoProd = document.querySelector('#input_tipo_atualizar').value;
  const inputImageElement = document.querySelector('#input_image_atualizar'); // Seletor do input de arquivo
  let imagemCodificada;
  const restricaoCheckBoxesAtualizar = document.querySelectorAll('#input_restricao_atualizar input[type="checkbox"]');
  const restricoesSelecionadasAtualizar = Array.from(restricaoCheckBoxesAtualizar)
  .filter(checkbox => checkbox.checked)
  .map(checkbox => checkbox.value);

  // Agora, restricoesSelecionadasAtualizar é um array contendo os valores das restrições selecionadas
  const restricaoProdAtualizar = restricoesSelecionadasAtualizar.join('<br>');

    await codificarImagemEmBase64(inputImageElement)
    .then(response => {
      imagemCodificada = response
    })

    let produtosAtualizado = {
      desc: descricaoProd,
      nome: nomeProd,
      preco: precoProd,
      peso: pesoProd,
      restricao: restricaoProdAtualizar,
      tipo: tipoProd
    }


    if((!(imagemCodificada.error)&&(imagemCodificada!=''))){
      produtosAtualizado.image = imagemCodificada
    }
    else{
      produtosAtualizado.image = imagemGuardada;
    }
  

    await updateDoc(doc(db, "produtos", idProduto), produtosAtualizado)
    .then(() => console.log('Documento atualizado'))
    .then(() => {
      document.getElementById('input_nome_atualizar').value = "";
      document.getElementById('input_preco_atualizar').value =  "";
      document.getElementById('input_desc_atualizar').value = "";
      document.getElementById('input_restricao_atualizar').value = ""; 
      document.getElementById('input_peso_atualizar').value = "";
      document.getElementById('opcao_padrao').selected = true;
      document.getElementById('input_image_atualizar').value = ""; 
      document.getElementById('show_id_atualizar').innerHTML = " ";
    })
    .catch(console.log)
    .finally(() => {
      getProdutos()
    });
});

// X DA IMAGEM DO ATUALIZAR
const xImagemAtualizar = document.getElementById('x_imagem_atualizar');

xImagemAtualizar.addEventListener('click', function() {
  document.getElementById('input_image_atualizar').value = "";
});

// EXIBIR A IMAGEM NO ATUALIZAR
const inputElement = document.getElementById('input_image_atualizar');

inputElement.addEventListener('change', function() {
  const selectedFile = inputElement.files[0]; // Obtém o arquivo selecionado
  document.getElementById('show_image_atualizar').src = selectedFile.path;
});

// ENCAMINHAR PARA DELETAR OU ATUALIZAR
document.addEventListener('click', async function (event) {
  if (event.target.classList.contains('delete-button')) {
    const productId = event.target.getAttribute('data-product-id');
    const productName = event.target.getAttribute('data-product-name');
    confirmarExclusao(productId, productName);
  }
  else if(event.target.classList.contains('update-button')) {
      document.getElementById('input_nome_atualizar').value = event.target.getAttribute('data-product-name');
      document.getElementById('input_preco_atualizar').value = event.target.getAttribute('data-product-preco');
      document.getElementById('input_desc_atualizar').value = event.target.getAttribute('data-product-desc');
      document.getElementById('input_peso_atualizar').value = event.target.getAttribute('data-product-peso');
      document.getElementById('input_tipo_atualizar').value = event.target.getAttribute('data-product-tipo');
      document.getElementById('show_id_atualizar').innerHTML = event.target.getAttribute('data-product-id');
      
      imagemGuardada = event.target.getAttribute('data-product-image');

      await decodificarImagemBase64(event.target.getAttribute('data-product-image'))
      .then((response) => {
        let imagemCodificada = event.target.getAttribute('data-product-image');
        document.getElementById('show_image_atualizar').src = `data:image/png;base64,${imagemCodificada}`;
      })

      const restricoesSelecionadasAtualizar = event.target.getAttribute('data-product-restricao').split('<br>');

      restricaoCheckBoxesAtualizar.forEach(checkbox => {
        checkbox.checked = restricoesSelecionadasAtualizar.includes(checkbox.value);
      });
  }
});


var imagemGuardada;