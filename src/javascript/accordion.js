(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const status = value => ['ATIVO','1'].includes(String(value).toUpperCase()) ? 'ATIVO' : 'INATIVO';
  const message = (text, error = false, container = document.querySelector('main')) => {
    let el = container.querySelector('.form-message,.page-message');
    if (!el) { el = document.createElement('p'); el.className = 'page-message'; el.setAttribute('role','status'); container.prepend(el); }
    el.textContent = text; el.classList.toggle('is-error',error); el.hidden = !text;
  };
  const table = body => {
    const element = body.closest('table');
    const labels = Array.from(element.querySelectorAll('th'),cell=>cell.textContent.trim());
    if (!element.parentElement.classList.contains('table-scroll')) { const wrapper=document.createElement('div');wrapper.className='table-scroll';element.before(wrapper);wrapper.append(element); }
    Array.from(body.rows).forEach(row=>Array.from(row.cells).forEach((cell,index)=>{cell.dataset.label=labels[index]||'';}));
    let pager=element.parentElement.nextElementSibling;
    if (!pager?.classList.contains('paginacao')) {pager=document.createElement('nav');pager.className='paginacao';pager.setAttribute('aria-label','Paginação');element.parentElement.after(pager);}
    const rows=Array.from(body.rows),pages=Math.ceil(rows.length/8);let page=1;
    function show() {rows.forEach((row,i)=>{row.hidden=i<(page-1)*8||i>=page*8;});pager.hidden=pages<=1;pager.innerHTML=`<button type="button" aria-label="Página anterior" ${page===1?'disabled':''}>Anterior</button><span>${page} de ${pages}</span><button type="button" aria-label="Próxima página" ${page===pages?'disabled':''}>Próxima</button>`;const buttons=pager.querySelectorAll('button');buttons[0].onclick=()=>{page--;show();};buttons[1].onclick=()=>{page++;show();}; }
    show();
  };
  window.ClassKey = {esc,status,message,table,money:value=>Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})};
  const aside=document.querySelector('.aside'),toggle=document.querySelector('.menu-toggle');
  if (!aside || !toggle) return;
  const mobile=matchMedia('(max-width:800px)');
  const backdrop=document.createElement('button');backdrop.className='menu-backdrop';backdrop.type='button';backdrop.setAttribute('aria-label','Fechar menu');backdrop.hidden=true;document.body.append(backdrop);
  let open=!mobile.matches;
  const sync=()=>{document.body.classList.toggle('menu-aberto',mobile.matches&&open);document.body.classList.toggle('menu-fechado',!mobile.matches&&!open);aside.inert=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');backdrop.hidden=!(mobile.matches&&open);};
  toggle.addEventListener('click',()=>{open=!open;sync();});backdrop.addEventListener('click',()=>{open=false;sync();toggle.focus();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&open&&mobile.matches){open=false;sync();toggle.focus();}});
  mobile.addEventListener('change',()=>{open=!mobile.matches;sync();});sync();
  const pageName=location.pathname.split('/').pop()||'index.html';
  const filename=({'editarprodutos.html':'listadeprodutos.html','editarcategoria.html':'listadecategoria.html'})[pageName]||pageName;
  aside.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href')===filename)link.setAttribute('aria-current','page');});
  aside.querySelectorAll('.accordion-header').forEach((header,index)=>{
    const panel=header.nextElementSibling;panel.id=`submenu-${index}`;header.tabIndex=0;header.setAttribute('role','button');header.setAttribute('aria-controls',panel.id);
    const set=expanded=>{header.classList.toggle('active',expanded);panel.classList.toggle('open',expanded);header.setAttribute('aria-expanded',String(expanded));panel.inert=!expanded;};
    set(Boolean(panel.querySelector('[aria-current="page"]')));
    const change=()=>set(header.getAttribute('aria-expanded')!=='true');header.addEventListener('click',change);header.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();change();}});
  });
})();
