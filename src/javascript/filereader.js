const input = document.getElementById('imagemInput');
const preview = document.getElementById('preview');
function limparPreview() {
  input.value = '';
  preview.replaceChildren(Object.assign(document.createElement('span'), { textContent: 'Nenhuma imagem selecionada' }));
}
input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) { limparPreview(); return; }
  if (!file.type.startsWith('image/')) { limparPreview(); ClassKey.message('Selecione um arquivo de imagem.', true, input.closest('form')); return; }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const image = document.createElement('img'); image.src = reader.result; image.alt = 'Prévia da imagem selecionada';
    preview.replaceChildren(image);
  });
  reader.readAsDataURL(file);
});
