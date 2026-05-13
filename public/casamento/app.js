const API_URL = "https://script.google.com/macros/s/AKfycbyO5SlN-n6jlaOUjmfcLleuQj4tKT5sSEyb_Cj4vjAA4Al1SXOnl4BiHZqDqO5YndMm/exec";

async function upload() {
  const status = document.getElementById("status");
  const files = selected;

  if (!files.length) {
    status.innerText = "Selecione ao menos 1 foto";
    return;
  }

  status.innerText = "Enviando...";

  try {
    for (const file of files) {
      const base64 = await toBase64(file);

      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          data: base64
        })
      });
    }

    status.innerText = "Enviado 🎉";

    selected = [];
    document.getElementById("preview").innerHTML = "";
    document.getElementById("count").innerText = "";

  } catch {
    status.innerText = "Erro ao enviar";
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}