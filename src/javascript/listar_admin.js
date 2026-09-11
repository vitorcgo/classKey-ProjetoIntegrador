document.addEventListener('DOMContentLoaded', () => {
    fetch('src/php/listar_admin.php')
        .then(res => res.json())
        .then(admins => {
            const tbody = document.querySelector('#tabela-adm tbody');
            tbody.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

            if (!Array.isArray(admins)) throw new Error('Resposta inválida');
            admins.forEach(admin => {
                // Formatar as datas para exibição
                const dataCriacao = admin.data_criacao ? new Date(admin.data_criacao.replace(' ', 'T')).toLocaleString('pt-BR') : '---';
                const dataUltimoAcesso = admin.data_ultimo_acesso ? new Date(admin.data_ultimo_acesso.replace(' ', 'T')).toLocaleString('pt-BR') : '---';

                // Garantir que o status seja uma string antes de aplicar toUpperCase
                const status = ClassKey.status(admin.status);
                const classeStatus = status === 'ATIVO' ? 'verde' : 'vermelho';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${admin.admin_id}</td>
                    <td>${ClassKey.esc(admin.usuario)}</td>

                    <td>${dataCriacao}</td>
                    <td>${dataUltimoAcesso}</td>
                    <td>
                        <button class="status-btn ${classeStatus}"
                               onclick="toggleStatus(this, ${admin.admin_id})">
                            ${status}
                        </button>
                        <button class="btn-excluir" data-id="${admin.admin_id}"><i class="ti ti-trash"></i> Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (!admins.length) tbody.innerHTML = '<tr><td colspan="5" class="table-empty">Nenhum administrador cadastrado.</td></tr>';
            ClassKey.table(tbody);
            // Adicionar evento de exclusão para os botões
            document.querySelectorAll('.btn-excluir').forEach(btn => {
                btn.addEventListener('click', excluirAdmin);
            });
        })
        .catch(err => { const body=document.querySelector('#tabela-adm tbody'); body.innerHTML='<tr><td colspan="8" class="table-empty">Não foi possível carregar os registros. Recarregue a página.</td></tr>'; ClassKey.table(body); });
});

function excluirAdmin(event) {
    const adminId = event.target.closest('[data-id]').getAttribute('data-id');

    if (!confirm('Tem certeza que deseja excluir este administrador?')) return;

    fetch('src/php/excluir_admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `admin_id=${adminId}`
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta.sucesso) {
            alert('Administrador excluído com sucesso!');
            location.reload(); // Recarregar a página para refletir as mudanças
        } else {
            alert('Erro ao excluir: ' + (resposta.erro || 'Erro desconhecido'));
        }
    })
    .catch(err => {
        console.error('Erro na exclusão:', err);
        alert('Erro ao excluir administrador.');
    });
}

function toggleStatus(botao, adminId) {
    const novoStatus = botao.textContent.trim().toUpperCase() === 'ATIVO' ? 'INATIVO' : 'ATIVO';

    fetch('src/php/atualizar_status_admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${adminId}&status=${novoStatus}`
    })
    .then(res => res.text())
    .then(resposta => {
        if (resposta === 'sucesso') {
            botao.textContent = novoStatus;
            botao.classList.toggle('verde');
            botao.classList.toggle('vermelho');
        } else {
            alert('Erro ao alterar status: ' + resposta);
        }
    })
    .catch(err => {
        console.error('Erro ao alterar status:', err);
        alert('Erro ao alterar status do administrador.');
    });
}
