// 世代別ノートページ用スクリプト
// - ≪トップ≫ タブと 8 ステージの切り替え
// - JSON から 7 部構成 UI を自動描画

document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll(".stage-tab"));
  const topView = document.getElementById("top-view");
  const stageView = document.getElementById("stage-view");
  const stageContent = document.getElementById("stage-content");

  if (!stageContent) return;

  // URL パラメータから初期ステージを取得
  const params = new URLSearchParams(window.location.search);
  let currentStage = params.get("stage") || "top";

  // タブのアクティブ状態を更新
  function setActiveTab(stage) {
    tabs.forEach((tab) => {
      const s = tab.getAttribute("data-stage");
      if (s === stage) {
        tab.classList.add("is-active");
      } else {
        tab.classList.remove("is-active");
      }
    });
// knowledge-notes.js
// 処世術禄：サイドOSタブ / 総合検索 / 今日の処世術（ランダムカード） / ショートカット連動
// 「今日の処世術」「今の悩みから探す」は ≪トップ≫（all）タブのみ表示

(function () {
  // ============================================================
  // 状態管理
  // ============================================================
  const state = {
    loaded: false,
    topics: [], // { title, summary, tags, essence, ... , _category }
    activeCategory: "all", // all | mind | relation | work | habit | future
    search: ""
  };

  // カテゴリごとのJSON設定
  const categoryConfigs = {
    mind: {
      jsonPath: "data/shoseijutsu/mind.json",
      label: "心の扱い方（内部OS）"
    },
    relation: {
      jsonPath: "data/shoseijutsu/relation.json",
      label: "人との関わり方（対人OS）"
    },
    work: {
      jsonPath: "data/shoseijutsu/work.json",
      label: "社会での立ち回り（社会OS）"
    },
    habit: {
      jsonPath: "data/shoseijutsu/habit.json",
      label: "行動・習慣の技術（行動OS）"
    },
    future: {
      jsonPath: "data/shoseijutsu/future.json",
      label: "キャッチアップの極意（未来OS）"
    }
  };

  // DOM参照
  const sidebarEl = document.getElementById("kn-sidebar");
  const sidebarToggleBtn = document.querySelector(".kn-sidebar-toggle");
  const osTabButtons = sidebarEl
    ? sidebarEl.querySelectorAll(".kn-os-tab")
    : [];
  const searchInput = document.getElementById("kn-search-input");
  const todayCardContainer = document.getElementById("kn-today-card");
  const todayRefreshBtn = document.getElementById("kn-today-refresh");
  const resultsContainer = document.getElementById("kn-results-container");
  const resultsMetaEl = document.getElementById("kn-results-meta");
  const shortcutButtons = document.querySelectorAll(".kn-shortcut");
  const topOnlySections = document.querySelectorAll(".kn-top-only");

  // ============================================================
  // 初期化
  // ============================================================

  function init() {
    // イベントの紐付け
    setupSidebarToggle();
    setupOsTabs();
    setupSearchInput();
    setupShortcuts();
    setupTodayRefresh();

    // データのロード
    loadAllCategories()
      .then(() => {
        state.loaded = true;
        // 今日の処世術カード
        renderTodayCard();
        // 検索結果（初期はランダムピックアップ）
        renderResults();
        // トップ専用セクションの表示制御
        updateTopOnlySections();
      })
      .catch((err) => {
        console.error(err);
        if (todayCardContainer) {
          todayCardContainer.innerHTML =
            '<p class="kn-loading-text">データの読み込み中にエラーが発生しました。</p>';
        }
        if (resultsMetaEl) {
          resultsMetaEl.textContent =
            "データの読み込み中にエラーが発生しました。";
        }
      });

    // 初期状態（activeCategory = all）の可視状態を保証
    updateTopOnlySections();
}

  // ビューの表示・非表示
  function showTopView() {
    topView.classList.add("is-visible");
    topView.setAttribute("aria-hidden", "false");
    stageView.classList.remove("is-visible");
    stageView.setAttribute("aria-hidden", "true");
  // ============================================================
  // データロード
  // ============================================================

  function loadAllCategories() {
    const entries = Object.entries(categoryConfigs);
    const promises = entries.map(([categoryId, config]) => {
      return fetch(config.jsonPath)
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `failed to load ${config.jsonPath} (${res.status})`
            );
          }
          return res.json();
        })
        .then((json) => {
          const topics = Array.isArray(json.topics) ? json.topics : [];
          topics.forEach((topic) => {
            const cloned = Object.assign({}, topic, {
              _category: categoryId
            });
            state.topics.push(cloned);
          });
        });
    });

    return Promise.all(promises);
}

  function showStageView() {
    topView.classList.remove("is-visible");
    topView.setAttribute("aria-hidden", "true");
    stageView.classList.add("is-visible");
    stageView.setAttribute("aria-hidden", "false");
  // ============================================================
  // サイドバー（OSタブ）
  // ============================================================

  function setupSidebarToggle() {
    if (!sidebarToggleBtn || !sidebarEl) return;

    sidebarToggleBtn.addEventListener("click", () => {
      const isOpen = sidebarEl.classList.toggle("is-open");
      sidebarToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
}

  // URL の stage パラメータを更新
  function updateUrl(stage) {
    const url = new URL(window.location.href);
    url.searchParams.set("stage", stage);
    window.history.replaceState({}, "", url.toString());
  function setupOsTabs() {
    if (!osTabButtons || osTabButtons.length === 0) return;

    osTabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const categoryId = btn.getAttribute("data-category") || "all";
        setActiveCategory(categoryId);
        // スマホ：タブ選択後はサイドバーを閉じる
        if (sidebarEl && sidebarEl.classList.contains("is-open")) {
          sidebarEl.classList.remove("is-open");
          if (sidebarToggleBtn) {
            sidebarToggleBtn.setAttribute("aria-expanded", "false");
          }
        }
      });
    });
}

  // ステージを切り替えるメイン関数
  function setStage(stage, shouldUpdateUrl = true) {
    currentStage = stage;
    setActiveTab(stage);
  function setActiveCategory(categoryId) {
    state.activeCategory = categoryId;

    if (stage === "top") {
      showTopView();
      // JSON は読み込まない
      if (shouldUpdateUrl) updateUrl("top");
      return;
    // ボタンの見た目更新
    if (osTabButtons && osTabButtons.length > 0) {
      osTabButtons.forEach((btn) => {
        const target = btn.getAttribute("data-category");
        btn.classList.toggle("is-active", target === categoryId);
      });
}

    showStageView();
    if (shouldUpdateUrl) updateUrl(stage);
    loadStageData(stage);
    // トップ専用セクションの表示制御
    updateTopOnlySections();

    // 再描画
    renderResults();
}

  // ローディングメッセージ表示
  function showMessage(text) {
    stageContent.innerHTML = `<p class="stage-message">${text}</p>`;
  // 「今日の処世術」「今の悩みから探す」を
  // ≪トップ≫（all）のときだけ表示する
  function updateTopOnlySections() {
    const isTop = state.activeCategory === "all";
    if (!topOnlySections || topOnlySections.length === 0) return;

    topOnlySections.forEach((sec) => {
      if (!sec) return;
      sec.hidden = !isTop;
    });
}

  // JSON 読み込み
  function loadStageData(stage) {
    showMessage("このステージの構造を読み込んでいます…");
  // ============================================================
  // 検索入力
  // ============================================================

  function setupSearchInput() {
    if (!searchInput) return;

    // contents/generations.html から見た相対パス
    const url = `data/${stage}.json`;
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value || "";
      renderResults();
    });

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`JSON 読み込みエラー: ${res.status}`);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        state.search = searchInput.value || "";
        renderResults();
      }
    });
  }

  // ============================================================
  // ショートカット（シチュエーション別）
  // ============================================================

  function setupShortcuts() {
    if (!shortcutButtons || shortcutButtons.length === 0) return;

    shortcutButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const keyword = btn.getAttribute("data-keyword") || "";
        if (!searchInput) return;
        searchInput.value = keyword;
        state.search = keyword;
        renderResults();
        // 必要ならスクロール
        const resultsSection = document.querySelector(".kn-results-section");
        if (resultsSection && typeof resultsSection.scrollIntoView === "function") {
          resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}
        return res.json();
      })
      .then((data) => {
        renderStage(data);
      })
      .catch((err) => {
        console.error(err);
        showMessage("データの読み込みに失敗しました。しばらくしてからもう一度試してください。");
});
    });
}

  // ステージ UI を描画（7 部構成）
  function renderStage(data) {
    // データが不足していても落ちないようにデフォルトを用意
    const title = data.title || "このステージ";
    const overview = data.overview || "";
    const essence = Array.isArray(data.essence) ? data.essence : [];
    const commonPaths = Array.isArray(data.commonPaths) ? data.commonPaths : [];
    const pains = Array.isArray(data.pains) ? data.pains : [];
    const insights = Array.isArray(data.insights) ? data.insights : [];
    const choices = Array.isArray(data.choices) ? data.choices : [];
    const finalLine = data.finalLine || "";

    // 各配列を HTML に変換
    const essenceHtml = essence
      .map(
        (item) => `
      <div class="essence-item">${escapeHtml(item)}</div>
    `
      )
      .join("");

    const commonPathsHtml = commonPaths
      .map(
        (p) => `
      <div class="common-path-item">
        <div class="common-path-label">${escapeHtml(p.label || "")}</div>
        <p class="common-path-desc">${escapeHtml(p.desc || "")}</p>
      </div>
    `
      )
      .join("");

    const painsHtml = pains
      .map(
        (p) => `
      <div class="pain-item">${escapeHtml(p)}</div>
    `
      )
      .join("");

    const insightsHtml = insights
      .map(
        (it) => `
      <article class="insight-item">
        <h3 class="insight-title">${escapeHtml(it.title || "")}</h3>
        <p class="insight-abstract">${escapeHtml(it.abstract || "")}</p>
        <p class="insight-action">${escapeHtml(it.action || "")}</p>
      </article>
    `
      )
      .join("");

    const choicesHtml = choices
      .map(
        (c) => `
      <article class="choice-item">
        <h3 class="choice-title">${escapeHtml(c.title || "")}</h3>
        <p class="choice-insight">${escapeHtml(c.insight || "")}</p>
      </article>
    `
      )
      .join("");

    // 7 部構成 UI を組み立て
    const html = `
      <header class="generation-hero">
        <h1 class="generation-title">${escapeHtml(title)}</h1>
        <p class="generation-lead">
          このステージで起こりがちな構造を、二周目視点で整理します。
        </p>
      </header>

      <!-- ① 概要 -->
      <section class="stage-overview">
        <p class="stage-overview-label">概要</p>
        <p class="stage-overview-text">${escapeHtml(overview)}</p>
      </section>

      <!-- ② Essence -->
      <section class="stage-section accordion" data-section="essence">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">本質</span>
            <span class="accordion-sub">このステージの内側にある3つの構造</span>
          </div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="essence-list">
              ${essenceHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
          </div>
        </div>
      </section>

      <!-- ③ Common Paths -->
      <section class="stage-section accordion" data-section="paths">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">分岐パターン</span>
            <span class="accordion-sub">よくある進み方・キャリアの流れ</span>
          </div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="common-paths-list">
              ${commonPathsHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
          </div>
        </div>
      </section>

      <!-- ④ Pains -->
      <section class="stage-section accordion" data-section="pains">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">迷い・不安</span>
            <span class="accordion-sub">この時期に出やすい悩み・行き詰まり</span>
          </div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="pains-list">
              ${painsHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
          </div>
        </div>
      </section>

      <!-- ⑤ Insights -->
      <section class="stage-section accordion" data-section="insights">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">二周目視点 × 処世術</span>
            <span class="accordion-sub">抽象と具体をつなぐ「見方」と「動き方」</span>
          </div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="insights-list">
              ${insightsHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
          </div>
        </div>
      </section>

      <!-- ⑥ Choices -->
      <section class="stage-section accordion" data-section="choices">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">選択のコンパス</span>
            <span class="accordion-sub">よく迷う分岐に対する「軸」のヒント</span>
          </div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="choices-list">
              ${choicesHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
          </div>
        </div>
      </section>

      <!-- ⑦ Final Line -->
      <section class="stage-final">
        <p class="stage-final-label">指針一言</p>
        <p class="stage-final-text">${escapeHtml(finalLine)}</p>
      </section>
    `;

    stageContent.innerHTML = html;
    initAccordions();
  // ============================================================
  // 今日の処世術（ランダムカード）＋更新ボタン
  // ============================================================

  function setupTodayRefresh() {
    if (!todayRefreshBtn) return;

    todayRefreshBtn.addEventListener("click", () => {
      if (!state.loaded) return;
      renderTodayCard();
    });
}

  // アコーディオンの初期化
  function initAccordions() {
    const sections = Array.from(stageContent.querySelectorAll(".stage-section"));
  function renderTodayCard() {
    if (!todayCardContainer) return;

    sections.forEach((section) => {
      const header = section.querySelector(".accordion-header");
      const panel = section.querySelector(".accordion-panel");
      if (!header || !panel) return;
    todayCardContainer.innerHTML = "";

      // 初期状態は閉
      panel.style.maxHeight = "0px";
    if (!state.loaded || !Array.isArray(state.topics) || state.topics.length === 0) {
      const p = document.createElement("p");
      p.className = "kn-loading-text";
      p.textContent = "利用可能な処世術カードがまだありません。";
      todayCardContainer.appendChild(p);
      return;
    }

      header.addEventListener("click", () => {
        const isOpen = section.classList.contains("is-open");
    const randomIndex = Math.floor(Math.random() * state.topics.length);
    const topic = state.topics[randomIndex];

        if (isOpen) {
          section.classList.remove("is-open");
          panel.style.maxHeight = "0px";
        } else {
          section.classList.add("is-open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
    const card = createShoseiCard(topic);
    card.classList.add("is-today");

    // カテゴリラベルを追加
    const catLabel = document.createElement("span");
    catLabel.className = "tag-chip tag-chip-category";
    const categoryLabel = categoryConfigs[topic._category]
      ? categoryConfigs[topic._category].label
      : "不明カテゴリ";
    catLabel.textContent = categoryLabel;

    const tagsWrap = card.querySelector(".shosei-tags");
    if (tagsWrap) {
      tagsWrap.insertBefore(catLabel, tagsWrap.firstChild);
    }

    todayCardContainer.appendChild(card);
  }

  // ============================================================
  // 検索結果のレンダリング
  // ============================================================

  function renderResults() {
    if (!resultsContainer || !resultsMetaEl) return;

    resultsContainer.innerHTML = "";

    if (!state.loaded) {
      resultsMetaEl.textContent = "データを読み込み中です…";
      return;
    }

    const allTopics = Array.isArray(state.topics) ? state.topics : [];
    if (allTopics.length === 0) {
      resultsMetaEl.textContent =
        "まだ処世術カードが登録されていません。";
      return;
    }

    const keyword = (state.search || "").trim().toLowerCase();
    const activeCat = state.activeCategory;

    let filtered = allTopics;

    // カテゴリフィルタ
    if (activeCat && activeCat !== "all") {
      filtered = filtered.filter((t) => t._category === activeCat);
    }

    // キーワードフィルタ
    if (keyword) {
      filtered = filtered.filter((topic) => {
        const title = (topic.title || "").toLowerCase();
        const summary = (topic.summary || "").toLowerCase();
        return title.includes(keyword) || summary.includes(keyword);
});
    }

    const totalCount = filtered.length;

    // メタ情報表示
    const catLabelText =
      activeCat === "all"
        ? "すべてのOS"
        : categoryConfigs[activeCat]
        ? categoryConfigs[activeCat].label
        : "不明カテゴリ";

    if (!keyword && activeCat === "all") {
      resultsMetaEl.textContent = `全カテゴリからランダムに最大6件をピックアップして表示しています（登録総数：${allTopics.length}件）。`;
    } else if (!keyword && activeCat !== "all") {
      resultsMetaEl.textContent = `${catLabelText} から ${totalCount}件を表示中。`;
    } else if (keyword && activeCat === "all") {
      resultsMetaEl.textContent = `「${keyword}」で全カテゴリから ${totalCount}件ヒットしました。`;
    } else {
      resultsMetaEl.textContent = `${catLabelText} × 「${keyword}」で ${totalCount}件ヒットしました。`;
    }

    // ヒットなし
    if (filtered.length === 0) {
      const p = document.createElement("p");
      p.className = "kn-loading-text";
      p.textContent = "条件に合う処世術カードがありませんでした。";
      resultsContainer.appendChild(p);
      return;
    }

    // 初期表示（キーワードなし・カテゴリall）の場合は上限6件ランダム表示
    if (!keyword && activeCat === "all") {
      const shuffled = shuffleArray(filtered.slice());
      filtered = shuffled.slice(0, 6);
    }

    filtered.forEach((topic) => {
      const card = createShoseiCard(topic);

      // カテゴリラベルチップ
      const catLabel = document.createElement("span");
      catLabel.className = "tag-chip tag-chip-category";
      const categoryLabel = categoryConfigs[topic._category]
        ? categoryConfigs[topic._category].label
        : "不明カテゴリ";
      catLabel.textContent = categoryLabel;

      const tagsWrap = card.querySelector(".shosei-tags");
      if (tagsWrap) {
        tagsWrap.insertBefore(catLabel, tagsWrap.firstChild);
      }

      resultsContainer.appendChild(card);
});
}

  // シンプルなエスケープ処理
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  // ============================================================
  // ユーティリティ：配列シャッフル
  // ============================================================

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  // ============================================================
  // 処世術カード生成（概要＋アコーディオン詳細）
  // ============================================================

  function createShoseiCard(topic) {
    const card = document.createElement("article");
    card.className = "shosei-card";

    // タイトル
    const titleEl = document.createElement("h3");
    titleEl.className = "shosei-title";
    titleEl.textContent = topic.title || "タイトル未設定";

    // サマリー
    const summaryEl = document.createElement("p");
    summaryEl.className = "shosei-summary";
    summaryEl.textContent = topic.summary || "";

    // タグ列
    const tagsWrap = document.createElement("div");
    tagsWrap.className = "shosei-tags";
    if (Array.isArray(topic.tags)) {
      topic.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.textContent = tag;
        tagsWrap.appendChild(chip);
      });
    }

    // 詳細（アコーディオン部）
    const detailWrapper = document.createElement("div");
    detailWrapper.className = "shosei-detail";

    const detailInner = document.createElement("div");
    detailInner.className = "shosei-detail-inner";

    // essence
    if (Array.isArray(topic.essence) && topic.essence.length > 0) {
      detailInner.appendChild(
        createDetailBlock("本質ポイント", topic.essence)
      );
    }

    // traps
    if (Array.isArray(topic.traps) && topic.traps.length > 0) {
      detailInner.appendChild(createDetailBlock("よくある罠", topic.traps));
    }

    // actionTips
    if (Array.isArray(topic.actionTips) && topic.actionTips.length > 0) {
      detailInner.appendChild(
        createDetailBlock("行動ヒント", topic.actionTips)
      );
    }

    if (detailInner.children.length > 0) {
      detailWrapper.appendChild(detailInner);
    }

    // カードクリックで詳細開閉
    let isOpen = false;
    card.addEventListener("click", () => {
      isOpen = !isOpen;
      if (isOpen) {
        card.classList.add("is-open");
        detailWrapper.style.maxHeight = detailInner.scrollHeight + "px";
      } else {
        card.classList.remove("is-open");
        detailWrapper.style.maxHeight = "0";
      }
    });

    // 構成を組み立て
    card.appendChild(titleEl);
    card.appendChild(summaryEl);
    card.appendChild(tagsWrap);
    card.appendChild(detailWrapper);

    return card;
}

  // タブクリックイベント
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const stage = tab.getAttribute("data-stage");
      if (!stage || stage === currentStage) return;
      setStage(stage, true);
  function createDetailBlock(title, items) {
    const block = document.createElement("div");
    block.className = "detail-block";

    const titleEl = document.createElement("h4");
    titleEl.className = "detail-title";
    titleEl.textContent = title;

    const ul = document.createElement("ul");
    ul.className = "detail-list";

    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
});
  });

  // 初期表示ステージを反映
  setStage(currentStage, false);
});
    block.appendChild(titleEl);
    block.appendChild(ul);
    return block;
  }

  // ============================================================
  // 実行
  // ============================================================

  // defer で読み込まれる前提なので、そのまま init を叩いて問題ない
  init();
})();
