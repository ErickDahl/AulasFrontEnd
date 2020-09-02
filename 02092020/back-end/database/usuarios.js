const listaUsuarios = [
    {
        id:1,
        nome:"Fulano",
        sobrenome: "Candongas",
        funcao: "Gerente",
        status: true,
        email: "fulano@fulano.com"
    },
    {
        id:2,
        nome:"Ciclano",
        sobrenome: "Candongas",
        funcao: "Gerente",
        status: true,
        email: "ciclano@ciclano.com"
    }
];



function obterTodos(){
    return listaUsuarios;
}

// aqui vai ter que mudar pois poderemos deletar usuarios.
function cadastrar(usuario){
    var user = usuario;
    user.id = listaUsuarios.length + 1;
    listaUsuarios.push(user);

    return user;
}

// aqui vai ter que mudar pois poderemos deletar usuarios.
function atualizar(usuario){
    var index = listaUsuarios.map(u => u.id).indexOf(usuario.id);

    if(index == -1) return false;
    
    listaUsuarios.splice(index, 1, usuario);

    return listaUsuarios.filter(u => u.id == usuario.id)[0];
}


function deletar(id){

    var cont = listaUsuarios.length;

    var index = listaUsuarios.map(u => u.id).indexOf(id);

    if(index == -1) return false;

    listaUsuarios.splice(index, 1);

    return (listaUsuarios.length + 1 == cont);
}

module.exports = { 
    obterTodos,
    cadastrar,
    atualizar,
    deletar
}