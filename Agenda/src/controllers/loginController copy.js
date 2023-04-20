const Login = require('../models/loginModel') //Passando loginModel pra ca para poder usar os validamento

exports.index = (req, res ) => {
    if(req.session.user) return res.render('login-logado');
    res.render('login');
};

exports.register = async (req, res ) => {
    const login = new Login(req.body);    //Chamando o Login require junto com o (body) da model

    try{
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors) // Criando a mensagem de erros
            req.session.save(function() {  //Essa função serve para assim que criar uma mensagem de erro voltar a pagina, então mantendo na mesma
                return res.redirect('/login/index')
            });
            return
        }


        req.flash('success', 'Seu usuário foi criado com sucesso') // Criando a mensagem de Sucesso
        req.session.save(function() {  
            return res.redirect('/login/index')
        });
    } catch(e){
        console.log(e);
        return res.render('404')
    }
};

exports.login = async (req, res ) => {
    const login = new Login(req.body);    //Chamando o Login require junto com o (body) da model

    try{
        await login.login();  // chamando o login para checar

        if(login.errors.length > 0) {
            req.flash('errors', login.errors) // Criando a mensagem de erros
            req.session.save(function() {  //Essa função serve para assim que criar uma mensagem de erro voltar a pagina, então mantendo na mesma
                return res.redirect('/login/index')
            });
            return
        }

        req.flash('success', 'Você entrou no sistema.') // Criando a mensagem de Sucesso
        req.session.user = login.user;  //o user vem do this.user = null; da clase
        req.session.save(function() {  
            return res.redirect('/login/index')
        });
    } catch(e){
        console.log(e);
        return res.render('404')
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}
