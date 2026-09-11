fetch('src/php/obter_usuario.php')
  .then(response => { if (!response.ok) throw new Error('Falha ao carregar usuário'); return response.text(); })
  .then(nome => {
    const el = document.getElementById('nome-usuario');
    el.replaceChildren(document.createTextNode('Bem-vindo, '));
    const strong = document.createElement('strong'); strong.textContent = nome || 'Visitante'; el.append(strong);
  })
  .catch(() => { document.getElementById('nome-usuario').textContent = 'Bem-vindo'; });
