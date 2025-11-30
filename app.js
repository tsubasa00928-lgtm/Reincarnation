/* =========================
   ページ切り替え
   ========================= */

const pages = document.querySelectorAll(".page");
const hero = document.getElementById("hero");

function switchPage(pageId) {
  // ページ表示切り替え
  pages.forEach(p => p.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");

  // ホームだけヒーロー表示
  if (hero) {
    if (pageId === "home") {
      hero.style.display = "";
    } else {
      hero.style.display = "none";
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  // ページごとのMarkdown読み込み（1回目だけ）
  if (pageId in sectionMarkdownMap && !loadedSections.has(pageId)) {
    const info = sectionMarkdownMap[pageId];
    loadMarkdown(info.path, info.targetId);
    loadedSections.add(pageId);
  }
}

/* =========================
   ホームの6ノート
   ========================= */

document.querySelectorAll(".large-feature").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetPage = btn.dataset.go;
    if (targetPage) {
      switchPage(targetPage);
      closeMenuIfOpen();
    }
  });
});

/* =========================
   「ホーム」ボタン
   ========================= */

document.querySelectorAll(".back-home").forEach(btn => {
  btn.addEventListener("click", () => {
    switchPage("home");
    closeMenuIfOpen();
  });
});

/* =========================
   ヘッダーメニュー（アコーディオン）
   ========================= */

const menuToggle = document.getElementById("menu-toggle");
const headerMenu = document.getElementById("header-menu");

function closeMenuIfOpen() {
  if (!headerMenu) return;
  if (headerMenu.classList.contains("open")) {
    headerMenu.classList.remove("open");
    headerMenu.setAttribute("aria-hidden", "true");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }
}

if (menuToggle && headerMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = headerMenu.classList.toggle("open");
    headerMenu.setAttribute("aria-hidden", String(!isOpen));
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // メニュー内のナビアイテム
  headerMenu.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetPage = btn.dataset.go;
      if (targetPage) {
        switchPage(targetPage);
        closeMenuIfOpen();
      }
    });
  });
}

/* =========================
   Markdown 読み込み共通関数
   ========================= */

function loadMarkdown(path, targetId) {
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  targetEl.innerHTML = `<p class="markdown-placeholder">読み込み中...</p>`;

  fetch(path)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return res.text();
    })
    .then(text => {
      const html = marked.parse(text);
      targetEl.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      targetEl.innerHTML = `
        <p class="markdown-placeholder">
          コンテンツを読み込めませんでした。<br>
          (${path} が存在するか確認してください)
        </p>
      `;
    });
}

/* =========================
   各ページ用のMarkdownパス設定
   ========================= */

const sectionMarkdownMap = {
  knowledge: {
    path: "contents/knowledge/overview.md",
    targetId: "knowledge-content"
  },
  catchup: {
    path: "contents/catchup/overview.md",
    targetId: "catchup-content"
  },
  experiences: {
    path: "contents/experiences/overview.md",
    targetId: "experiences-content"
  },
  roadmap: {
    path: "contents/roadmap/overview.md",
    targetId: "roadmap-content"
  },
  stock: {
    path: "contents/stock/overview.md",
    targetId: "stock-content"
  }
};

// 一度読み込んだセクションを記録（無駄な再fetch防止）
const loadedSections = new Set();

/* =========================
   世代別ノート：ボタン → md読み込み
   ========================= */

// 世代 → ファイルパス マップ
const generationMarkdownMap = {
  elementary: "contents/generation/elementary.md",
  junior: "contents/generation/junior.md",
  high: "contents/generation/high.md",
  university: "contents/generation/university.md",
  worker: "contents/generation/worker.md",
  senior: "contents/generation/senior.md"
};

const genButtons = document.querySelectorAll(".generation-tabs button");
const generationContentId = "generation-content";

function loadGeneration(genKey) {
  const path = generationMarkdownMap[genKey];
  if (!path) return;

  loadMarkdown(path, generationContentId);
}

genButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const genKey = btn.dataset.gen;
    genButtons.forEach(b => b.classList.remove("gen-active"));
    btn.classList.add("gen-active");
    loadGeneration(genKey);
  });
});

// 初期表示：小学生（elementary）とホーム
loadGeneration("elementary");
switchPage("home");
