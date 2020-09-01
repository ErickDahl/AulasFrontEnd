var moduloUsuario = (() => {


    let listaUsuariosBackup = [];
    let tabelaUsuarios = document.querySelector('#tabela-usuarios tbody')
    let modal = {
        nome: document.querySelector('#nome-usuario'),
        sobrenome: document.querySelector('#sobrenome-usuario'),
        tipo: document.querySelector('#tipo-usuario'),
        status: document.querySelector('#status-usuario'),
        email: document.querySelector('#email-usuario'),
        btnSalvar: document.querySelector('#btn-salvar-usuario'),
        btnCancelar: document.querySelector('#btn-cancelar-usuario')
    };

    let idUsuarioAtivo = undefined;


    modal.btnSalvar.addEventListener('click', (e) => {
        e.preventDefault();

        // Aqui vou verificar se os campos brigatorios foram preenchidos.

        var usuario  = new Usuario({
            nome: modal.nome.value,
            sobrenome: modal.sobrenome.value,
            tipo: modal.tipo.value,
            status: modal.status.value,
            email: modal.email.value
        });

    
        if(!usuario.modeloValido()){
            mensagem.mostrar('Favor preencher os campos obrigatórios.',"Atenção",'success');
            return;
        }

        // Aqui vou enviar os dados para serem gravados no meu backend.
        // Aqui tenho que saber se devo cadastrar ou atualziar;


        // Se tem id, é para atualziar.
        if(idUsuarioAtivo){
            usuario.id = idUsuarioAtivo;

            apiUsuario.atualizar(usuario)
            .then(response => {
                _atualizarUsuarioNaLista(new Usuario(response));
                _popularTabela(listaUsuariosBackup);
                _fecharModal();
                // disparar mensagem marota;
            })
            .catch(error => console.log(error));

            return;
        }  
        
        // Se não tem id, cadastra.
        apiUsuario.cadastrar(usuario)
        .then(response => {
            listaUsuariosBackup.push( new Usuario(response));
            _popularTabela(listaUsuariosBackup);
            _fecharModal();
            // disparar mensagem marota;
        })
        .catch(error => console.log(error));
        
    })
    
    function _atualizarUsuarioNaLista(usuario){

       var index = listaUsuariosBackup.map(u => u.id).indexOf(usuario.id);

       if(index == -1) return; //Tratar aqui informando que não conseguimos atualziar a lista.
    
        listaUsuariosBackup.splice(index, 1, usuario);
    
    }

    function _fecharModal(){
        $('#modal-adicionar-usuario').modal('hide');
    }

    function _abrirModal(){
        $('#modal-adicionar-usuario').modal('show');
    }

    function editar(event){
        //  obtendo id do usuario
        var id = parseInt(event.id.replace('salvar-usuario-',''));

        //  pegando de dentro da lista de backup quem eu tenho que atualizar.
        var user = listaUsuariosBackup.filter(u => u.id == id)[0];

        idUsuarioAtivo = user.id;

        //  agora devo popular o modal com esse usuario.
        modal.nome.value = user.nome;
        modal.sobrenome.value = user.sobrenome;
        modal.email.value = user.email;
        modal.status.value = (user.status) ? 'Ativado' : 'Desativado'; // Aqui deve ta com problema ???
        modal.tipo.value = user.tipo; // Aqui deve ta com problema ???

        //  abrir o modal
        _abrirModal();
    
    }

    function _popularTabela(listaUsuarios){

        // Aqui eu limpo a tabela inteira \o/
        tabelaUsuarios.textContent = "";

        listaUsuarios.map(u => {
            // Criando os elementos 
            var tr = document.createElement('tr');

            var tdId = document.createElement('td');
            var tdNome = document.createElement('td');
            var tdSobrenome = document.createElement('td');
            var tdTipo = document.createElement('td');
            var tdEmail = document.createElement('td');
            var tdAcoes = document.createElement('td');

            // Passando os valores para as Tds
            tdId.textContent = u.id;
            tdNome.textContent = u.nome;
            tdSobrenome.textContent = u.sobrenome;
            tdTipo.textContent = u.tipo;
            tdEmail.textContent = u.email;
            tdAcoes.innerHTML = `
            <button id="salvar-usuario-${u.id}"
             class="btn btn-outline-secondary btn-sm"
             onClick="moduloUsuario.editar(this)">
             <i class="fas fa-pencil-alt"></i> Editar
             </button>
            <button id="excluir-usuario-${u.id}" class="btn btn-outline-secondary btn-sm"><i class="fas fa-trash-alt"></i> Excluir</button>
            `;

            // Tenho que add as minhas tds na minha tr.

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdTipo);
            tr.appendChild(tdEmail);
            tr.appendChild(tdAcoes);
         
            tabelaUsuarios.appendChild(tr);
        });
    }

    apiUsuario.obterTodos()
    .then(resposta => { 
        var lista = resposta.map(e => new Usuario(e));
        listaUsuariosBackup = lista;
        _popularTabela(lista);
    })
    .catch(error => console.log(error))

    return {
        editar
    }
})()