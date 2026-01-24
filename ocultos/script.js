const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6GcpbCIIjB7FkfJmWBvjQN0VOq44Dw0lhkKlXxlGY-nei16jOuz1uNlCth00t-98B/exec';

function enviar() {
  const input = document.getElementById('file');
  const status = document.getElementById('status');

  if (!input.files.length) {
    alert('Selecione uma imagem');
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const base64 = reader.result.split(',')[1];

    const formData = new FormData();
    formData.append('file', base64);
    formData.append('filename', file.name);
    formData.append('type', file.type);

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(() => {
      status.innerText = 'Imagem enviada com sucesso!';
      input.value = '';
    })
    .catch(() => {
      status.innerText = 'Erro ao enviar imagem';
    });
  };

  reader.readAsDataURL(file);
}
