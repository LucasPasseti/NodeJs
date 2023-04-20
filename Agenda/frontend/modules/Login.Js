import validator from "validator";

export default class Login{
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init(){
        this.events();
    }

    events() {
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            alert('Form não enviado');
            this.validate(e);
        })
    }

    validate(e) {        
        const el = e.target;
        const emailinpuit = el.querySelector('input[name="email"]');
        const passwordinput = el.querySelector('input[name="password"]');
        let error = false;

        if(!validator.isEmail(emailinpuit.value)){
            alert('E-mail inválido');
            error = true;
        }


        if(passwordinput.value.lenght < 3 || passwordinput.value.lenght > 15){
            alert('Senha precisa conter entre 3 e 15 caracteres');
            error = true;
        }

        if(!error) el.submit(); 
    }
}