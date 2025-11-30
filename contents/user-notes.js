// ---- 心に留めたい言葉（localStorage） ----
const STORAGE_KEY_QUOTES = "jn_user_quotes";

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUOTES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQuotes(quotes) {
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
}

function renderQuotes() {
  const container = document.getElementById("quoteList");
  const quotes = loadQuotes();
  if (!quotes.length) {
    container.innerHTML =
      '<p style="font-size:12px;color:#9ca3af;margin:0;">まだ登録されていません。刺さった一文をメモしてみてください。</p>';
    return;
  }
  container.innerHTML = "";
  quotes.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "quote-item";
    div.innerHTML = `
      <div class="quote-text">${q}</div>
      <button class="quote-delete" data-index="${index}">削除</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll(".quote-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      const current = loadQuotes();
      current.splice(idx, 1);
      saveQuotes(current);
      renderQuotes();
    });
  });
}

function initQuoteSection() {
  const input = document.getElementById("quoteInput");
  const addBtn = document.getElementById("quoteAddBtn");
  if (!input || !addBtn) return;

  addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    const current = loadQuotes();
    current.push(text);
    saveQuotes(current);
    input.value = "";
    renderQuotes();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBtn.click();
    }
  });

  renderQuotes();
}

// ---- 悩み相談チャット（ダミーAI） ----
const demoReplies = [
  "いまの気持ちを言葉にできているだけで、大きな一歩です。",
  "すぐに答えを出さなくても大丈夫です。少しずつ整理していきましょう。",
  "一周目の自分にとっては重たいテーマでも、二周目視点では“素材”になります。",
  "誰かと比較するより、「昨日の自分」と比べてみてもいいかもしれません。"
];

function appendChatMessage(text, role) {
  const win = document.getElementById("chatWindow");
  if (!win) return;
  const div = document.createElement("div");
  div.className = "chat-message " + role;
  div.textContent = text;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function initChat() {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendChatMessage(text, "user");
    input.value = "";

    // ダミーAI応答
    const reply =
      demoReplies[Math.floor(Math.random() * demoReplies.length)];
    setTimeout(() => {
      appendChatMessage(reply, "ai");
    }, 400);
  });
}

// ---- オーバーレイメニュー ----
function initOverlayMenuUN() {
  const overlay = document.getElementById("un-menu-overlay");
  const toggleBtn = document.getElementById("un-menu-toggle");
  const closeBtn = document.getElementById("un-menu-close");
  if (!overlay || !toggleBtn || !closeBtn) return;

  const openMenu = () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  toggleBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenu();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initOverlayMenuUN();
  initQuoteSection();
  initChat();
});
