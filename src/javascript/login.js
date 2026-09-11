document.getElementById('formularioLogin').addEventListener('submit', async event => {
  event.preventDefault();
  const form=event.currentTarget,button=form.querySelector('button'),error=document.getElementById('mensagem-erro');
  if(button.disabled || !form.reportValidity()) return;
  error.hidden=true;button.disabled=true;button.textContent='Entrando...';
  try {
    const response=await fetch('src/php/login_admin.php',{method:'POST',body:new URLSearchParams(new FormData(form))});
    if(!response.ok) throw new Error('Não foi possível entrar. Tente novamente.');
    const result=await response.json();
    if(!result.sucesso) throw new Error(result.mensagem || 'Confira seu e-mail e senha.');
    location.href='index.html';
  } catch(cause) {
    error.textContent=cause instanceof SyntaxError ? 'O servidor não respondeu corretamente. Tente novamente.' : cause.message;
    error.hidden=false;
  } finally {button.disabled=false;button.textContent='Entrar';}
});
