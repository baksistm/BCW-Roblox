const SHEET_ID = "1GUNfJ-OO7DqEqd2UEUcrNRPhy9Sp5HYTedUrq9hk7Qk";
const SHEET_NAME = "LoginADM";
const UPDATE_SCRIPT_URL = "";

const COLLAB_IFRAME_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlJ8XnsZL2F86H6O8d_29ADYA3yh2r8uxmYI2vGOjeQqXwgKYYfeJGTDddF6uFC0Zuvj1wi4oa7tEf/pubhtml";
const COLLAB_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1fpRmz2KAcONKs2BHWu2akqQ1ruMTPwDfW6Bduqr3IP4/edit?usp=sharing";

const FILE_LINKS = [
  { label: "Imagens", url: "", status: "Em criação" },
  {
    label: "Atrações",
    url: "https://drive.google.com/drive/folders/1H3mUvIHiIhUPxQKnPsyHRnz4VcS_LNcG",
  },
  {
    label: "Restaurantes",
    url: "https://drive.google.com/drive/folders/1StpGpTXF9qKdeDXpaGQjkoce5pNDDka_",
  },
  {
    label: "Game Pass",
    url: "https://drive.google.com/drive/folders/1GM2joJgY-aGyvj6pVkypXcC2XiQQNsd3",
  },
  {
    label: "Marca",
    url: "https://drive.google.com/drive/folders/1vJ0fnHxc4TG8MZVl4KIVu55FYnxtnJPe",
  },
  {
    label: "Parque",
    url: "https://drive.google.com/drive/folders/1aSx0M-p30t_ZBPaa-q9Nbti6vn0ACy6D",
  },
  { label: "Colabore", url: "", status: "URL pendente" },
  {
    label: "Imagens site - Monitor",
    url: "https://drive.google.com/drive/folders/19hyV1vOANMhk4OGezDrTd5xHUxzi0ZVy",
  },
  {
    label: "Imagens site - Mobile",
    url: "https://drive.google.com/drive/folders/134tsnaywn4_Ax3JEZ68TSoL3AeCs8Sql",
  },
  { label: "Banners", url: "", status: "URL pendente" },
  {
    label: "Home",
    url: "https://drive.google.com/drive/folders/13LGcE5kEO5yyNSTWn-Z1pZBeza5_K_pm",
  },
  { label: "Atrações (em criação)", url: "", status: "Em criação" },
  {
    label: "Textos",
    url: "https://drive.google.com/drive/folders/1xykfgHeOOduzYjHPxhXn0e-ZdKh6Pbiz",
  },
];

const SHEET_QUERY_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(
  SHEET_NAME
)}&tqx=out:json`;

function parseSheetResponse(text) {
  const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const data = JSON.parse(jsonText);
  if (!data.table || !data.table.rows) {
    return [];
  }

  return data.table.rows.map((row, index) => {
    const cells = row.c || [];
    return {
      index,
      nome: cells[0]?.v || "",
      usuario: cells[1]?.v || "",
      senha: cells[2]?.v || "",
    };
  });
}

async function fetchUsers() {
  const response = await fetch(SHEET_QUERY_URL);
  const text = await response.text();
  return parseSheetResponse(text);
}

function setLoggedUser(user) {
  sessionStorage.setItem("adminLogged", "true");
  sessionStorage.setItem("adminUser", user.usuario);
  sessionStorage.setItem("adminName", user.nome);
  if (user.index !== undefined) {
    sessionStorage.setItem("adminRow", String(user.index + 2));
  } else if (user.row) {
    sessionStorage.setItem("adminRow", String(user.row));
  }
}

function showWarningScreen() {
  document.body.innerHTML = `
    <div class="warning-screen">
      <div class="warning-card">
        <div class="warning-icon">⚠️</div>
        <h2>Você deve realizar o login</h2>
        <p>Para continuar, acesse a página de login da administração.</p>
        <p><strong>Caso você não realize o login não será possível acessar a administração.</strong></p>
        <a class="button" href="admin.html">Ir para o login</a>
      </div>
    </div>
  `;
}

function ensureAuth() {
  if (sessionStorage.getItem("adminLogged") !== "true") {
    showWarningScreen();
    return false;
  }
  return true;
}

function initLoginPage() {
  const form = document.querySelector("[data-login-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userInput = document.getElementById("login-user");
    const passInput = document.getElementById("login-pass");
    const errorMessage = document.getElementById("login-error");
    const loadingScreen = document.getElementById("loading-screen");
    const loginCard = document.getElementById("login-card");
    const welcomeName = document.getElementById("loading-name");

    errorMessage.style.display = "none";

    try {
      const users = await fetchUsers();
      const found = users.find(
        (row) =>
          row.usuario.toLowerCase() === userInput.value.trim().toLowerCase()
      );

      if (!found || found.senha !== passInput.value.trim()) {
        errorMessage.style.display = "block";
        return;
      }

      setLoggedUser(found);
      welcomeName.textContent = found.nome || "administrador";

      loginCard.style.display = "none";
      loadingScreen.style.display = "flex";

      setTimeout(() => {
        window.location.href = "admin-home.html";
      }, 4000);
    } catch (error) {
      errorMessage.textContent =
        "Não foi possível acessar a planilha. Verifique a publicação e tente novamente.";
      errorMessage.style.display = "block";
    }
  });
}

function initNavUser() {
  const nameSpot = document.querySelector("[data-admin-name]");
  if (nameSpot) {
    nameSpot.textContent = sessionStorage.getItem("adminName") || "Admin";
  }
}

function initCollabPage() {
  const iframe = document.getElementById("collab-iframe");
  const button = document.getElementById("collab-button");
  if (!iframe || !button) return;

  iframe.src = COLLAB_IFRAME_URL;
  button.href = COLLAB_SHEET_URL;
}

function initFilesPage() {
  const container = document.getElementById("files-grid");
  if (!container) return;

  container.innerHTML = "";
  FILE_LINKS.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const status = item.status ? `<span class="badge">${item.status}</span>` : "";
    card.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <strong>${item.label}</strong>
        ${status}
        <a class="button ${item.url ? "" : "disabled"}" ${
      item.url ? `href="${item.url}" target="_blank"` : ""
    }>${item.url ? "Abrir pasta" : "Indisponível"}</a>
      </div>
    `;

    container.appendChild(card);
  });
}

function initProfilePage() {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;

  const nameInput = document.getElementById("profile-name");
  const userInput = document.getElementById("profile-user");
  const passInput = document.getElementById("profile-pass");
  const statusMessage = document.getElementById("profile-status");

  nameInput.value = sessionStorage.getItem("adminName") || "";
  userInput.value = sessionStorage.getItem("adminUser") || "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    statusMessage.textContent = "";

    if (!UPDATE_SCRIPT_URL) {
      statusMessage.textContent =
        "Configuração pendente: adicione a URL do Apps Script no admin.js.";
      statusMessage.style.color = "var(--red)";
      return;
    }

    const payload = {
      action: "update",
      row: sessionStorage.getItem("adminRow"),
      nome: nameInput.value.trim(),
      usuario: userInput.value.trim(),
      senha: passInput.value.trim(),
    };

    try {
      const response = await fetch(UPDATE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.type !== "opaque") {
        statusMessage.textContent = "Não foi possível salvar as alterações.";
        statusMessage.style.color = "var(--red)";
        return;
      }

      setLoggedUser(payload);
      statusMessage.textContent = "Informações atualizadas com sucesso!";
      statusMessage.style.color = "var(--green-primary)";
    } catch (error) {
      statusMessage.textContent = "Erro ao conectar com o Apps Script.";
      statusMessage.style.color = "var(--red)";
    }
  });
}

function initLogout() {
  const logoutBtn = document.querySelector("[data-logout]");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "admin.html";
  });
}

function init() {
  const isProtected = document.body.dataset.protected === "true";
  if (isProtected && !ensureAuth()) {
    return;
  }

  initLoginPage();
  initNavUser();
  initCollabPage();
  initFilesPage();
  initProfilePage();
  initLogout();
}

document.addEventListener("DOMContentLoaded", init);
