import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, getDocs , orderBy, doc, deleteDoc, where, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';

// CHAVE
const firebaseConfig = {
  apiKey: 'AIzaSyA5DWm_hrQPn8RyxGu-ZhnbDHCvdxxG7MQ',
  authDomain: 'doceria-85ffc.firebaseapp.com',
  projectId: 'doceria-85ffc',
  storageBucket: 'doceria-85ffc.appspot.com',
  messagingSenderId: '636432934299',
  appId: '1:636432934299:web:13348abba3cf6f87d0ad3e',
  measurementId: 'G-2R6C10H9Y2'
};

// INICIANDO
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const collectionProdutos = collection(db, 'produtos')
getProdutos()

//  FUNÇÃO PARA PEGAR OS PRODUTOS NO FIREBASE
async function getProdutos() {
  let listagemProdutos = document.getElementById('listagem-dos-produtos'); // ID PUXADO PARA ADICIONAR

  const produtosListagem = query(collectionProdutos, where('tipo', '==', 'kits'), orderBy('dataCadastro', 'desc')); // SEPARANDO CONFORME CATEGORIA
  const querySnapshot = await getDocs(produtosListagem);

  // CRIANDO DINAMICAMENTE
  querySnapshot.forEach(async (doc) => {
    if (doc.data().nome !== "") {
      try {
        // DECODIFICANDO IMAGEM SALVA EM BASE 64
        const response = await decodificarImagemBase64(doc.data().image); 
        // RETIRANDO A VÍRGULA DA FORMA COM QUE FOI SALVA AS RESTRIÇÕES
        let restricoes = doc.data().restricao.split(',');
        // PEGANDO O NOME DO PRODUTO PARA UTILIZAR NA API DO WHATSAPP
        let nomeFormatadoWhats = '';
        let nomeProdutoArray = doc.data().nome.split(' ');

        for(let i=0; i<nomeProdutoArray.length; i++){
          if(i==(nomeProdutoArray.length-1)){
            nomeFormatadoWhats += `${nomeProdutoArray[i]}`
          }
          else{
            nomeFormatadoWhats += `${nomeProdutoArray[i]}+`
          }
        }

        let precoDoProduto = doc.data().preco
        const responseNumeroTemVirgula = await verificaSeNumeroTemVirgula(precoDoProduto);

        if(!responseNumeroTemVirgula){
          precoDoProduto += ",00";
        }

        // FORMATANDO O PESO, CONVERTENDO PARA KG CASO PRECISO
        const pesoFormatado = doc.data().peso > 1000
        ? `${(doc.data().peso / 1000)}kg`.replace('.',',')
        : `${doc.data().peso}g`;
 
        // CRIAÇÃO DOS CARDS
        let newProduct = document.createElement('div'); // ELEMENTO QUE SERÁ CRIADO
        newProduct.className = 'card transition'; // NOME DA CLASSE DO ELEMENTO
        newProduct.innerHTML = `
          <a target="_blank" href="https://api.whatsapp.com/send/?phone=5515998430479&text=Ol%C3%A1%2C+gostaria+de+pedir+o+seguinte+produto: ${nomeFormatadoWhats}">
            <img class="card-img-top" id="produtoImagem">
          </a>
          <div class="card-body">
            <div class="nome-e-desc">
              <h2 class="card-title nome-produto">${doc.data().nome}</h2>
              <p class="desc-produto">${doc.data().desc}</p>
            </div>
            <h1 class="preco">R$ ${precoDoProduto}</h1>
            <h6 class="peso-produto">${pesoFormatado}</h6>
           
            <div id="restricoes" class="align-text-right restricoes-produto">
              
            </div>

             <a target="_blank" class="peca-ja" href="https://api.whatsapp.com/send/?phone=5515998430479&text=Ol%C3%A1%2C+gostaria+de+pedir+o+seguinte+produto: ${nomeFormatadoWhats}">
              <p> Peça Já! </p>
            </a>

          </div>
        `; // CONSTRUÇÃO HTML

        listagemProdutos.appendChild(newProduct); 

        // TRATAMENTO PRÓPRIO PARA AS RESTRIÇÕES
        const restricoesDiv = newProduct.querySelector('#restricoes'); 

        for(let i=0; i<restricoes.length; i++){
          
          var textRestricao = document.createElement('h3');
          textRestricao.textContent = restricoes[i];
          restricoesDiv.appendChild(textRestricao);
        }
        
        // TRATAMENTO PRÓPRIO PARA A IMAGEM
        const produtoImagem = newProduct.querySelector('#produtoImagem');
        produtoImagem.src = response;
      } catch (error) {
        console.error('Erro ao processar a imagem:', error);
      }
    }
  });
}

// FUNÇÃO QUE DECODIFICARÁ A IMAGEM
async function decodificarImagemBase64(imageBase64) {
  return new Promise((resolve, reject) => {
    try {
      if (imageBase64) {
        const decodedImageData = atob(imageBase64);
        const buffer = new ArrayBuffer(decodedImageData.length);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < decodedImageData.length; i++) {
          view[i] = decodedImageData.charCodeAt(i);
        }
  
        // CRIA UM BLOB A PARTIR DO ARRAY BUFFER
        const blob = new Blob([buffer], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        resolve(imageUrl);
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


async function verificaSeNumeroTemVirgula(number){
  return new Promise((resolve, reject) => {
    try {

      for(let i=0; i<number.length; i++){
        if(number[i] == ","){
          resolve(true);
        }
      }

      resolve(false)
      
    } catch (err) {
      console.error(err)
    }
  })
}