exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user; //pegando a user criada em Login e jogando em todas as páginas
    next();
}

exports.outroMiddleware = (req, res, next) => {
    console.log('outro middleware');
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if(err){
        return res.render('404') ;                //QUALQUER ERRO QUE ACONTEÇA PASSA ESSA FUNÇÃO DE MIDLLE E RENDERIZA A PAGINA PARA O 404.EJS
    }

    next();
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}

exports.loginRequired = (req, res, next) => {      // colocar na route de cadastrar contatos para nao poder acessar cadastrar caso nao esteja logado
    if(!req.session.user){
        req.flash('errors', 'Você precisa fazer login.');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
};