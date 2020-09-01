
class Usuario {
    constructor(obj){
        obj = obj || {}; //Tratamento para não dar erro.

        this.id = obj.id;
        this.nome = obj.nome;
        this.sobrenome = obj.sobrenome;
        this.tipo = obj.tipo;
        this.status =  this.retornarStatus(obj.status)
        this.email = obj.email;
    }

    retornarStatus(status){
        switch (status) {
            case 'Ativado': return true;
            case 'Desativado': return false;
            case true: return true;
            case false: return false;
            default: return undefined;   
        }
    }

    modeloValido(){
        return !!(this.nome && this.sobrenome && this.email && this.tipo);
    }
}

