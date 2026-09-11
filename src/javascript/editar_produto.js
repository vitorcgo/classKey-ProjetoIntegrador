document.addEventListener('DOMContentLoaded', async () => {
  const form=document.getElementById('form-produto'),button=form.querySelector('[type="submit"]');
  const id=new URLSearchParams(location.search).get('id');
  button.disabled=true;
  if(!id){ClassKey.message('Escolha um produto na listagem para editar.',true,form);return;}
  try {
    const [response,ready]=await Promise.all([fetch(`src/php/buscar_produto.php?id=${encodeURIComponent(id)}`),window.categoriasProntas]);
    if(!ready)return;
    if(!response.ok)throw new Error('Produto não encontrado.');
    const product=await response.json();if(product.erro)throw new Error(product.erro);
    document.getElementById('produtoId').value=product.produto_id;
    for(const field of ['nome','preco','descricao','quantidade'])document.getElementById(field).value=product[field]??'';
    document.getElementById('categoria-options').value=product.categoria_id;
    document.getElementById('id-produto').textContent=`(${product.produto_id})`;
    if(product.imagem_url){const img=document.getElementById('imagem-preview');img.src=product.imagem_url.replace(/^\//,'');img.style.display='block';document.getElementById('sem-imagem').style.display='none';}
    button.disabled=false;
  }catch(error){ClassKey.message(error.message,true,form);}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(button.disabled)return;button.disabled=true;
    try{const response=await fetch('src/php/editar_produto.php',{method:'POST',body:new FormData(form)});const result=await response.json();if(!response.ok||result.erro)throw new Error(result.erro||'Não foi possível salvar.');location.href='listadeprodutos.html';}
    catch(error){ClassKey.message(error.message,true,form);button.disabled=false;}
  });
});
