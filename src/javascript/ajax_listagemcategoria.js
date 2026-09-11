let todasAsCategorias = []; // Armazena a lista original para filtragem

document.addEventListener('DOMContentLoaded', () => {
    fetch('src/php/listar_categorias.php')
        .then(res => res.json())
        .then(categorias => {

            todasAsCategorias = categorias;
            renderizarTabela(categorias);

            // Ativa filtro ao digitar
            const barraPesquisa = document.getElementById('barra-pesquisa');
            if (barraPesquisa) {
                barraPesquisa.addEventListener('input', () => {
                    const termo = barraPesquisa.value.trim().toLowerCase();

                    const filtrados = todasAsCategorias.filter(categoria => {
                        const nome = categoria.categoria.toLowerCase();
                        const id = String(categoria.categoria_id);
                        return nome.includes(termo) || id.includes(termo);
                    });

                    renderizarTabela(filtrados);
                });
            }
        })
        .catch(err => { const body=document.querySelector('#corpo-tabela'); body.innerHTML='<tr><td colspan="8" class="table-empty">Não foi possível carregar os registros. Recarregue a página.</td></tr>'; ClassKey.table(body); });
});

function renderizarTabela(categorias) {
    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = '';

    if (!Array.isArray(categorias)) {
        alert('Dados inválidos retornados: ' + JSON.stringify(categorias));
        return;
    }

    categorias.forEach(categoria => {
        const status = ClassKey.status(categoria.status);
        const classeStatus = status === 'ATIVO' ? 'verde' : 'vermelho';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${categoria.categoria_id}</td>
            <td>${ClassKey.esc(categoria.categoria)}</td>
            <td>
                <button class="status-btn ${classeStatus}"
                    onclick="toggleStatus(this, ${categoria.categoria_id})">
                    ${status}
                </button>
            </td>
            <td>
                <a class="btn-editar" href="editarcategoria.html?id=${categoria.categoria_id}"><i class="ti ti-edit"></i> Editar</a>
                <button class="btn-excluir" data-id="${categoria.categoria_id}"><i class="ti ti-trash"></i> Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });

    if (!categorias.length) corpoTabela.innerHTML = '<tr><td colspan="4" class="table-empty">Nenhum registro encontrado.</td></tr>';
    ClassKey.table(corpoTabela);
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', excluirCategoria);
    });
}

function excluirCategoria(event) {
    // Get the ID from the button or closest parent with data-id
    const button = event.target.closest('.btn-excluir');
    const id = button.getAttribute('data-id');

    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        fetch('src/php/excluir_categoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        })
        .then(res => res.text())
        .then(resposta => {
            if (resposta === 'sucesso') {
                alert('Categoria excluída com sucesso!');
                location.reload();
            } else {
                alert('Erro ao excluir: ' + resposta);
            }
        });
    }
}

function toggleStatus(botao, categoriaId) {
    const novoStatus = botao.textContent.trim().toUpperCase() === 'ATIVO' ? 'INATIVO' : 'ATIVO';

    fetch('src/php/atualizar_status_categoria.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${categoriaId}&status=${novoStatus}`
    })
    .then(res => res.text())
    .then(resposta => {
        if (resposta === 'sucesso') {
            const item=todasAsCategorias.find(c=>String(c.categoria_id)===String(categoriaId)); if(item)item.status=novoStatus;
            botao.textContent = novoStatus;
            botao.classList.toggle('verde');
            botao.classList.toggle('vermelho');
        } else {
            alert('Erro ao alterar status: ' + resposta);
        }
    });
}