document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const load = async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao carregar o painel.');
    const data = await response.json();
    if (data.erro) throw new Error(data.erro);
    return data;
  };
  try {
    const [counts, products] = await Promise.all([
      load('src/php/get_counts.php'), load('src/php/listar_produtos.php')
    ]);
    for (const key of ['totalProdutos', 'totalCategorias', 'totalAdministradores']) {
      document.getElementById(key).textContent = counts[key];
    }
    const stock = new Map();
    products.forEach(product => {
      const name = product.categoria_nome || 'Sem categoria';
      stock.set(name, (stock.get(name) || 0) + Number(product.quantidade || 0));
    });
    const canvas = document.getElementById('graficoVendas');
    canvas.hidden = !stock.size;
    document.getElementById('grafico-vazio').hidden = Boolean(stock.size);
    if (stock.size && window.Chart) {
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: [...stock.keys()],
          datasets: [{ label: 'Unidades em estoque', data: [...stock.values()], backgroundColor: '#af63ee', borderRadius: 6, maxBarThickness: 64 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#c1cada' }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { precision: 0, color: '#c1cada' }, grid: { color: 'rgba(255,255,255,.08)' } }
          }
        }
      });
    }
  } catch (error) {
    ClassKey.message('Não foi possível carregar os dados do painel. Recarregue a página para tentar novamente.', true);
    for (const key of ['totalProdutos', 'totalCategorias', 'totalAdministradores']) document.getElementById(key).textContent = 'Indisponível';
  }
});
