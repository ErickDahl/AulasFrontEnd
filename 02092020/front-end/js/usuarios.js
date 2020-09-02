var moduloUsuario = (() => {


    let listaUsuariosBackup = [];
    let tabelaUsuarios = document.querySelector('#tabela-usuarios tbody')
    let modal = {
        nome: document.querySelector('#nome-usuario'),
        sobrenome: document.querySelector('#sobrenome-usuario'),
        funcao: document.querySelector('#tipo-usuario'),
        status: document.querySelector('#status-usuario'),
        email: document.querySelector('#email-usuario'),
        btnSalvar: document.querySelector('#btn-salvar-usuario'),
        btnCancelar: document.querySelector('#btn-cancelar-usuario')
    };
    let btnAdicionar = document.querySelector('#btn-adcionar-usuario');

    let idUsuarioAtivo = undefined;


    btnAdicionar.addEventListener('click', (e) => {
        e.preventDefault();
        _limparModal();
        _abrirModalAdicionar();
    })

    modal.btnSalvar.addEventListener('click', (e) => {
        e.preventDefault();

        // Aqui vou verificar se os campos brigatorios foram preenchidos.

        var usuario  = new Usuario({
            nome: modal.nome.value,
            sobrenome: modal.sobrenome.value,
            funcao: modal.funcao.value,
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
                _fecharModalAdicionar();
                mensagem.mostrar(`Foi atualizado com sucesso!`,
                `Usuário ${response.nome}`, 'success');
            })
            .catch(error => console.log(error));

            return;
        }  
        
        // Se não tem id, cadastra.
        apiUsuario.cadastrar(usuario)
        .then(response => {
            listaUsuariosBackup.push( new Usuario(response));
            _popularTabela(listaUsuariosBackup);
            _fecharModalAdicionar();
            mensagem.mostrar(`Foi cadastrado com sucesso!`,
            `Usuário ${response.nome}`, 'success');
        })
        .catch(error => console.log(error));
        
    })
    
    function _atualizarUsuarioNaLista(usuario){

       var index = listaUsuariosBackup.map(u => u.id).indexOf(usuario.id);

       if(index == -1) return; //Tratar aqui informando que não conseguimos atualziar a lista.
    
        listaUsuariosBackup.splice(index, 1, usuario);
    
    }

    function _fecharModalAdicionar(){
        $('#modal-adicionar-usuario').modal('hide');
    }

    function _abrirModalAdicionar(){
        $('#modal-adicionar-usuario').modal({backdrop: "static"});
    }

    function _fecharModalMensagem(){
        $('#modal-mensagem').modal('hide');
    }

    function _abrirModalMensagem(){
        $('#modal-mensagem').modal({backdrop: "static"});
    }


    function editar(id){
        var user = _localizarUsuarioPeloId(id);

        idUsuarioAtivo = user.id;

        //  agora devo popular o modal com esse usuario.
        modal.nome.value = user.nome;
        modal.sobrenome.value = user.sobrenome;
        modal.email.value = user.email;
        modal.status.value = (user.status) ? 'Ativado' : 'Desativado'; // Aqui deve ta com problema ???
        modal.funcao.value = user.funcao; // Aqui deve ta com problema ???

        //  abrir o modal
        _abrirModalAdicionar();
    
    }

    function _localizarUsuarioPeloId(id){
        //  pegando de dentro da lista de backup quem eu tenho que atualizar.
        return listaUsuariosBackup.filter(u => u.id == id)[0];
    }


    function excluir(id){

        var user = _localizarUsuarioPeloId(id);
        
        // Aqui vou perguntar o usuario se ele realmente deseja excluir o usuario.
        _criarModalMensagem(user);
        _abrirModalMensagem();     
    }

    function cancelarExclusao(){
        _fecharModalMensagem();
    }

    function confirmarExclusao(id){
        
        apiUsuario.deletar(id)
        .then(response => {

            if(!response) {
                mensagem.mostrar('Não foi possível deletar o usuário!',
                             'Ops',
                             'error');
                             return;
            }

            mensagem.mostrar('Deletado com sucesso!',
            'Usuário',
            'success');

            obterTodosOsUsuarios();                   
        })

        .catch(error => console.log(error));

        _fecharModalMensagem();

    }

    function _limparModal(){
        modal.nome.value = "";
        modal.sobrenome.value = "";
        modal.email.value = "";
        modal.status.value = "";
        modal.funcao.value = "";
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
            var tdFuncao = document.createElement('td');
            var tdEmail = document.createElement('td');
            var tdAcoes = document.createElement('td');

            // Passando os valores para as Tds
            tdId.textContent = u.id;
            tdNome.textContent = u.nome;
            tdSobrenome.textContent = u.sobrenome;
            tdFuncao.textContent = u.funcao;
            tdEmail.textContent = u.email;
            tdAcoes.innerHTML = `
            <button
             class="btn btn-outline-primary btn-sm "
             onClick="moduloUsuario.editar(${u.id})">
             <i class="fas fa-pencil-alt"></i> Editar
             </button>
            <button class="btn btn-outline-primary btn-sm "
            onClick="moduloUsuario.excluir(${u.id})"><i class="fas fa-trash-alt"></i> Excluir</button>
            `;

            // Tenho que add as minhas tds na minha tr.

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdFuncao);
            tr.appendChild(tdEmail);
            tr.appendChild(tdAcoes);
         
            tabelaUsuarios.appendChild(tr);
        });
    }


    function _criarModalMensagem(usuario){
        var modal = `
        <div class="modal-dialog">

        <div class="modal-content">

          <!-- Modal body -->
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">

                <h4 class="title">Deseja excluir o usuário ${usuario.nome}?</h4>

              </div>
              <div class="col-sm-12">
                <div class="acoes">

                  <button class="btn btn-primary usuario-${usuario.id}" 
                  onClick="moduloUsuario.confirmarExclusao(${usuario.id})">Sim</button>

                  <button class="btn btn-outline-primary usuario-${usuario.id}"
                  onClick="moduloUsuario.cancelarExclusao()">Não</button>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    document.querySelector('#modal-mensagem').innerHTML = modal;

    }

    function obterTodosOsUsuarios(){
        apiUsuario.obterTodos()
        .then(resposta => { 
            var lista = resposta.map(e => new Usuario(e));
            listaUsuariosBackup = lista;
            _popularTabela(lista);
        })
        .catch(error => console.log(error))
    }

    obterTodosOsUsuarios();


    return {
        editar,
        excluir,
        cancelarExclusao,
        confirmarExclusao
    }
})()