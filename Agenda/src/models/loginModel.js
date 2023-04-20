const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema( {
    email: {type: String, require: true},
    password: {type: String, require: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);


class Login{              //TUDO QUE FOR POSTADO DENTRO DE LOGIN CONTROLLER VOU PASSAR AQUI

    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email: this.body.email})

        if(!this.user) {
            this.errors.push('Usuário não existe'); //verificando se o usuario existe para fazer o login
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) { // primeiro checa a senha, e depois faz checagem para ver se o hash da senha esta igual
            this.errors.push('senha inválida');
            this.user = null;
            return;
        }
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;   //Checando se a erro ou nao

        await this.userExists(); // Checando se o User ja existe ou nao, se existe não cria outro na base de dados(no LoginModel.create)
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt); //Hash da senha no banco

        this.user = await LoginModel.create(this.body)   // Jogando os dados para o banco, ESSA E A CRIACAO DO USUARIO
   

    }

    valida() {
        this.cleanUp();

        //CHECANDO SE O EMAIL É VALIDO >>>>
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');   // usando o Validator para validar email

        // SENHA ENTRE 5 E 15 CARACTERES
        if(this.body.password.length < 5 || this.body.password.length > 15) {
            this.errors.push('A senha precisa conter de 5 a 15 caracteres');
        }

    }

    cleanUp() {
        for(let key in this.body) {       // nesse for estou garantindo que todos valores recebidos no body seja uma String
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';            
            }
        };


        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }

    async userExists(){
        this.user = await LoginModel.findOne({email: this.body.email}) //Checando se email ja existe para criação do user
        if(this.user) this.errors.push('Usuário já existe');
    }

}


module.exports = Login;