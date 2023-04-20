const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema( {
    nome: {type: String, require: true},
    sobrenome: {type: String, require: false, default: ''},
    email: {type: String, require: true, default: ''},
    telefone: {type: String, require: true, default: ''},
    criadoEm: {type: Date, default: Date.now},
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body){
    this.body = body;
    this.errors = [];
    this.contato = null;
}


Contato.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
}


Contato.prototype.valida = function() {
    this.cleanUp();

    //CHECANDO SE O EMAIL É VALIDO >>>>
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');   // usando o Validator para validar email

    //CHECANDO SE TEM NOME 
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatório');

    //CHECANDO SE TEM CONTATO EMAIL OU TELEFONE
    if(!this.body.email && !this.body.telefone) this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone');
}

Contato.prototype.cleanUp = function () {
    for(let key in this.body) {       // nesse for estou garantindo que todos valores recebidos no body seja uma String
        if(typeof this.body[key] !== 'string'){
            this.body[key] = '';            
        }
    };


    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    };
}


Contato.prototype.edit = async function (id){
    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true});
};

//Metodos estáticos

Contato.buscaPorId = async (id) =>{
    if (typeof id !== 'string') return; // o id precisa ser uma string
    const contato = await ContatoModel.findById(id); // pegando o id criado pelo banco de dados
    return contato; // retornando o Id pego no banco
}

Contato.buscaContatos = async () =>{
    const contatos = await ContatoModel.find()
    .sort({criadoEm: -1}); 
    return contatos; 
}

Contato.delete = async (id) =>{
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato; 
}

module.exports = Contato;