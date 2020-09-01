
/* 
    1° o primeiro parenteses é para dizer que estou criando o modulo.
    2° o segundo parenteses é para exportar o modulo.
    3° a função dentro do primeiro parenteses é o modulo em sí.
*/

// Criando um módulo no javaScript.
// (function(){
//     // Aqui dentro tudo é privado.
//     var nome = "Weberson";


// })()


// modulo que é exportado para uma variável.

// var login = (function(){
//     var nome ="weberson"
//     var batata = "123";

//     function teste(){
//         alert('oi');
//     }

//     return {
//         batata,
//         teste
//     }
// })()
// -----------------------//------------------------------


(function(){
// Aqui dentro tudo é global...

    const emailUser = 'a';
    const senhaUser = 'a';

    var email = document.querySelector('#email');
    var senha = document.querySelector('#senha');
    var btnEntra = document.querySelector('#btn-entrar');
    var alerta = document.querySelector('div.alert');
    var close = document.querySelector('span.close');

    // Para pegar o click do mouse
    btnEntra.addEventListener('click', login);

    // Para pegar as teclas que estão sendo precionadas.
    btnEntra.addEventListener('keypress', login);

    close.addEventListener('click', esconderAlerta);

    function login(event){
       
        // Utilizamos para avisar o codigo que daqui para baixo sou eu quem manda.
        event.preventDefault();

        // Aqui verifico se o Enter foi clicado, se não retorno.
        if(event.keyCode != undefined && event.keyCode != 13) {
            return;
        }

        if(!email.value || !senha.value) {
            mostrarMensagem('Email e senha devem ser informados.');
            return;
        } 

        if(email.value.toLowerCase() != emailUser || senha.value != senhaUser){
            mostrarMensagem('Usuário ou senha inválidos.');
            return;
        }
        
        // Aqui eu mando o usuario para a tela Home.
        window.location.href = './views/home.html';
    }

    function mostrarMensagem(mensagem) {
 
        alerta.querySelector('span.mensagem').textContent = mensagem;
        mostrarAlerta();

        // // Depois de 10 segundos sumir com a mensagem automaticamente.
        setTimeout(function(){
            esconderAlerta();
        },10000);

    }

    function esconderAlerta(){
        alerta.classList.add('esconder');
    }

    function mostrarAlerta(){
        alerta.classList.remove('esconder');
    }
})();

