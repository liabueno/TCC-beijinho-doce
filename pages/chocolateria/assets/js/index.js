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
getProdutos()


async function getProdutos() {
  let listagemProdutos = document.getElementById('listagem-dos-produtos');

  const produtosListagem = query(collectionProdutos, where('tipo', '==', 'chocolateria'));
  const querySnapshot = await getDocs(produtosListagem);

  querySnapshot.forEach(async (doc) => {
    if (doc.data().nome !== "") {
      try {
        const response = await decodificarImagemBase64(doc.data().image);
        let restricoes = doc.data().restricao.split(',');
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

        const pesoFormatado = doc.data().peso > 1000
        ? `${(doc.data().peso / 1000).toFixed(2)}kg`
        : `${doc.data().peso}g`;
 
        let newProduct = document.createElement('div');
        newProduct.className = 'card transition';
        newProduct.innerHTML = `
          <a target="_blank" href="https://api.whatsapp.com/send/?phone=5515998430479&text=Ol%C3%A1%2C+gostaria+de+pedir+o+seguinte+produto: ${nomeFormatadoWhats}">
            <img class="card-img-top" id="produtoImagem">
          </a>
          <div class="card-body">
            <h2 class="card-title">${doc.data().nome}</h2>
            <p>${doc.data().desc}</p>
            <h1 class="preco">R$ ${doc.data().preco}</h1>
            <h6>${pesoFormatado}</h6>
            <a target="_blank" href="https://api.whatsapp.com/send/?phone=5515998430479&text=Ol%C3%A1%2C+gostaria+de+pedir+o+seguinte+produto: ${nomeFormatadoWhats}">
              <p class="encomenda"> Peça já! </p>
            </a>
            <div id="restricoes" class="direita">
              
            </div>
          </div>
       
        `;

        listagemProdutos.appendChild(newProduct);

        const restricoesDiv = newProduct.querySelector('#restricoes');

        for(let i=0; i<restricoes.length; i++){
          
          var textRestricao = document.createElement('h3');
          textRestricao.textContent = restricoes[i];
          restricoesDiv.appendChild(textRestricao);
        }
        
        const produtoImagem = newProduct.querySelector('#produtoImagem');
        produtoImagem.src = response;
      } catch (error) {
        console.error('Erro ao processar a imagem:', error);
      }
    }
  });
}


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
  
        // Cria um Blob a partir do ArrayBuffer
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