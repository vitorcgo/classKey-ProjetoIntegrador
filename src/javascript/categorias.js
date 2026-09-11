window.categoriasProntas = new Promise(resolve => {
  document.addEventListener('DOMContentLoaded', async () => {
    const select=document.getElementById('categoria-options');
    try {
      const response=await fetch('src/php/categoriaoptions.php');
      if(!response.ok)throw new Error();
      const categories=await response.json();if(!Array.isArray(categories))throw new Error();
      select.replaceChildren(new Option('Escolha a categoria',''));
      categories.forEach(category=>select.add(new Option(category.categoria,category.categoria_id)));
      resolve(true);
    } catch {ClassKey.message('Não foi possível carregar as categorias. Recarregue a página.',true,select.closest('form'));select.disabled=true;select.closest('form').querySelector('[type="submit"]').disabled=true;resolve(false);}
  });
});
