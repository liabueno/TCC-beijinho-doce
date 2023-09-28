import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';

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
getFuncionarios();
  
const salvarButton = document.querySelector('#salvar');
salvarButton.addEventListener('click', function (event) {
  event.preventDefault();

  const nomeProd = document.querySelector('#input_nome').value;
  const precoProd = document.querySelector('#input_preco').value;
  const descricaoProd = document.querySelector('#input_desc').value;
  const tipoProd = document.querySelector('#input_tipo').value;
  // const dataCadastroProduto = new Date();

  console.log('Nome:', nomeProd);
  console.log('Preço:', precoProd);
  console.log('Descrição:', descricaoProd);
  console.log('Tipo:', tipoProd);
  // console.log('Data de Cadastro:', dataCadastroProduto);

  addDoc(collectionProdutos, {
    desc: descricaoProd,
    nome: nomeProd,
    preco: precoProd,
    tipo: tipoProd,
    // dataCadastro: dataCadastroProduto
  })
  .then(doc => console.log('Document criado com o ID', doc.id))
  .catch(console.log)
  .finally(()=>{
    getFuncionarios()
  })
})

async function getFuncionarios(){
  let id=0;
  let listagens = document.getElementById('tabela');
  listagens.innerHTML = "";
  const produtosListagem = query(collectionProdutos);
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
      `;
      listagens.appendChild(newRow);
    }
  });
  console.log(querySnapshot)
}