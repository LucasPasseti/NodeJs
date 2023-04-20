import 'core-js/stable';
import 'regenerator-runtime/runtime';  // para navegadores antigos

import Login from './modules/Login.Js'; // importando Login do Modules/Login.JS
const login = new Login ('.form-login'); // Instanciando Login De modules login
const cadastro = new Login ('.form-cadastro'); 
login.init(); //Chamando a funcao init De dentro do construtor Login, nosso init foi feito com a intencao de inicializar a validação do form no front
cadastro.init();
// import './assets/css/style.css';