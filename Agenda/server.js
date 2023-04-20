require('dotenv').config(); // Referente ao .env config do desenvolvimento que nao quero deixar publico como a conta do banco

const express = require('express'); // puxando o express
const app = express();   // iniciando o expp
const routes = require('./routes');  
const path = require('path');


const mongoose = require('mongoose');       //CONEXAO DO BANCO MODELAGEM 
mongoose.set('strictQuery', true);  
mongoose.connect(process.env.CONNECTIONSTRING)       
.then(()=> {                                      //Retorna um promise quando estiver conectado
    console.log('conectei a base de dados');
    app.emit('pronto')
})
.catch(e => console.log(e));


const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware');  //Trazendo os middlware, quando quiser fazer algo no fim,comeco ou fim das rotas
const session = require('express-session');   // trazendo a session para o express "cookie"
const MongoStore = require('connect-mongo');   // conectando ao cookie usando session, É para dizer que os cookies vão ser salvo no banco de dados pq por padrao sao salvas em memoria
const flash = require('connect-flash');   //Flash Messages serve para passar mensagem quando ocorrer algum evento de erro dentro do cookie E depois ela some

const helmet = require('helmet');  // parte de segurança
const csrf = require('csurf');  // parte de segurança



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.use(helmet());
app.use(express.urlencoded({ extended: true})); // é o tratamento de body para parametros em express
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); //significa que sao tudo o que esta dentro de public no caso, faz ter acesso a tudo que estiver em public diretamente

const sessionOptions = session({   // configuracao de sessao
    secret: 'dsad asdafdszxqjffdkfdk dsaji dsaj dasijdas a6()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }), // store faz a conexao do cookie com o mongo,   mongoUrl{} passa onde quer conectar, no caso (mongoDB)
    resave:false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')); // aqui estou apenas dizendo qual pasta é a de views
app.set('view engine', 'ejs');  // é a view engine que estamos usando para poder usar js dentro do html da pasta view


//Nossos proprios Middlewares
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);
 
app.on('pronto', () => {          //app online depois da conexao com o banco
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000');
    })              //PORTA    
})
