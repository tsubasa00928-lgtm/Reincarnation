// =====================================================
// 世代別ノート ページ用スクリプト
// - ?stage=top / elementary / middle ... に応じて内容を切り替え
// - デフォルトは "top"（≪トップ≫タブ）
// - 各ステージは ./data/<stage>.json から読み込み
// =====================================================
// 世代別ノートページ用スクリプト
// - ≪トップ≫ タブと 8 ステージの切り替え
// - JSON から 7 部構成 UI を自動描画

document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll(".gen-tab"));
  const contentRoot = document.getElementById("genContentRoot");
  const tabs = Array.from(document.querySelectorAll(".stage-tab"));
  const topView = document.getElementById("top-view");
  const stageView = document.getElementById("stage-view");
  const stageContent = document.getElementById("stage-content");

  // クエリパラメータから stage を取得
  if (!stageContent) return;

  // URL パラメータから初期ステージを取得
const params = new URLSearchParams(window.location.search);
let currentStage = params.get("stage") || "top";

  // 存在しない値対策
  const validStages = [
    "top",
    "elementary",
    "middle",
    "high",
    "university",
    "earlyCareer",
    "midCareer",
    "lateCareer",
    "secondCareer",
  ];
  if (!validStages.includes(currentStage)) {
    currentStage = "top";
  }

  // 初期レンダリング
  setActiveTab(currentStage);
  renderStage(currentStage);

  // タブクリックイベント
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const stage = tab.dataset.stage;
      if (!stage || !validStages.includes(stage)) return;

      currentStage = stage;
      // URL 更新（履歴を汚しすぎないように replaceState）
      const baseUrl = window.location.pathname;
      const newUrl =
        stage === "top" ? `${baseUrl}` : `${baseUrl}?stage=${stage}`;
      window.history.replaceState(null, "", newUrl);

      setActiveTab(stage);
      renderStage(stage);
    });
  });

  // -----------------------------------------------------
  // タブのアクティブ状態を切り替え
  // -----------------------------------------------------
  // タブのアクティブ状態を更新
function setActiveTab(stage) {
tabs.forEach((tab) => {
      if (tab.dataset.stage === stage) {
        tab.classList.add("gen-tab-active");
      const s = tab.getAttribute("data-stage");
      if (s === stage) {
        tab.classList.add("is-active");
} else {
        tab.classList.remove("gen-tab-active");
        tab.classList.remove("is-active");
}
});
}

  // -----------------------------------------------------
  // ステージに応じて描画
  // -----------------------------------------------------
  function renderStage(stage) {
    if (!contentRoot) return;
    contentRoot.innerHTML = "";
  // ビューの表示・非表示
  function showTopView() {
    topView.classList.add("is-visible");
    topView.setAttribute("aria-hidden", "false");
    stageView.classList.remove("is-visible");
    stageView.setAttribute("aria-hidden", "true");
  }

  function showStageView() {
    topView.classList.remove("is-visible");
    topView.setAttribute("aria-hidden", "true");
    stageView.classList.add("is-visible");
    stageView.setAttribute("aria-hidden", "false");
  }

  // URL の stage パラメータを更新
  function updateUrl(stage) {
    const url = new URL(window.location.href);
    url.searchParams.set("stage", stage);
    window.history.replaceState({}, "", url.toString());
  }

  // ステージを切り替えるメイン関数
  function setStage(stage, shouldUpdateUrl = true) {
    currentStage = stage;
    setActiveTab(stage);

if (stage === "top") {
      renderTopView();
      showTopView();
      // JSON は読み込まない
      if (shouldUpdateUrl) updateUrl("top");
return;
}

    // 各ステージは JSON から読み込み
    const jsonPath = `data/${stage}.json`;
    fetch(jsonPath)
    showStageView();
    if (shouldUpdateUrl) updateUrl(stage);
    loadStageData(stage);
  }

  // ローディングメッセージ表示
  function showMessage(text) {
    stageContent.innerHTML = `<p class="stage-message">${text}</p>`;
  }

  // JSON 読み込み
  function loadStageData(stage) {
    showMessage("このステージの構造を読み込んでいます…");

    // contents/generations.html から見た相対パス
    const url = `data/${stage}.json`;

    fetch(url)
.then((res) => {
if (!res.ok) {
          throw new Error(`JSON 読み込みエラー: ${jsonPath}`);
          throw new Error(`JSON 読み込みエラー: ${res.status}`);
}
return res.json();
})
.then((data) => {
        renderStageFromJson(data);
        renderStage(data);
})
.catch((err) => {
console.error(err);
        renderError(`データを読み込めませんでした。（${jsonPath}）`);
        showMessage("データの読み込みに失敗しました。しばらくしてからもう一度試してください。");
});
}

  // -----------------------------------------------------
  // トップタブ：人生マップ（デモ）
  // -----------------------------------------------------
  function renderTopView() {
    const card = document.createElement("div");
    card.className = "gen-card";

    card.innerHTML = `
      <div class="gen-map-header">
        <h2 class="gen-map-title">人生マップ（デモ）</h2>
        <p class="gen-map-sub">
          小学生〜セカンドキャリアまでの流れを、二周目視点でざっくり俯瞰できるマップです。<br>
          ここから、気になるステージをタブで選んで掘り下げていきます。
        </p>
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

      <div class="gen-map-timeline">
        <div class="gen-map-line"></div>

        <div class="gen-map-stage-row">
          <div class="gen-map-stage">
            <div class="gen-map-dot"></div>
            <div class="gen-map-stage-label">小学生</div>
            <div class="gen-map-stage-note">「世界のルール」を初めて知る時期</div>
          </div>
          <div class="gen-map-stage">
            <div class="gen-map-dot"></div>
            <div class="gen-map-stage-label">中学生</div>
            <div class="gen-map-stage-note">比較と序列が意識に入り込む</div>
          </div>
          <div class="gen-map-stage">
            <div class="gen-map-dot"></div>
            <div class="gen-map-stage-label">高校生</div>
            <div class="gen-map-stage-note">「将来何者になるか」問題が立ち上がる</div>
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
          <div class="gen-map-stage">
            <div class="gen-map-dot gen-map-dot--mid"></div>
            <div class="gen-map-stage-label">大学・専門期</div>
            <div class="gen-map-stage-note">選択の幅が一時的に最大になる</div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="essence-list">
              ${essenceHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
         </div>
       </div>

        <div class="gen-map-stage-row">
          <div class="gen-map-stage">
            <div class="gen-map-dot gen-map-dot--mid"></div>
            <div class="gen-map-stage-label">社会人前期</div>
            <div class="gen-map-stage-note">実戦で「自分のパターン」を知るフェーズ</div>
      </section>

      <!-- ③ Common Paths -->
      <section class="stage-section accordion" data-section="paths">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">分岐パターン</span>
            <span class="accordion-sub">よくある進み方・キャリアの流れ</span>
         </div>
          <div class="gen-map-stage">
            <div class="gen-map-dot gen-map-dot--mid"></div>
            <div class="gen-map-stage-label">社会人中期</div>
            <div class="gen-map-stage-note">責任と自由のバランスが重くなる</div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="common-paths-list">
              ${commonPathsHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
         </div>
          <div class="gen-map-stage">
            <div class="gen-map-dot"></div>
            <div class="gen-map-stage-label">社会人後期</div>
            <div class="gen-map-stage-note">守るものと手放すものを選び始める</div>
        </div>
      </section>

      <!-- ④ Pains -->
      <section class="stage-section accordion" data-section="pains">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">迷い・不安</span>
            <span class="accordion-sub">この時期に出やすい悩み・行き詰まり</span>
         </div>
          <div class="gen-map-stage">
            <div class="gen-map-dot gen-map-dot--end"></div>
            <div class="gen-map-stage-label">セカンドキャリア</div>
            <div class="gen-map-stage-note">「何を残すか」のフェーズ</div>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="pains-list">
              ${painsHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
         </div>
       </div>

        <div class="gen-map-phases">
          <div class="gen-phase-card">
            <h3 class="gen-phase-title">① 成長のフェーズ</h3>
            <p class="gen-phase-text">
              小〜高校は、「自分が選べない前提」が多い時期。<br>
              二周目視点では、自分を責めるより「環境の構造」を理解することが大事になります。
            </p>
      </section>

      <!-- ⑤ Insights -->
      <section class="stage-section accordion" data-section="insights">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">二周目視点 × 処世術</span>
            <span class="accordion-sub">抽象と具体をつなぐ「見方」と「動き方」</span>
         </div>
          <div class="gen-phase-card">
            <h3 class="gen-phase-title">② 選択が増えるフェーズ</h3>
            <p class="gen-phase-text">
              大学・専門期〜社会人前期は、選択肢が一気に増える一方で、<br>
              「本当に選び直せる期限」も同時に進んでいきます。
            </p>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="insights-list">
              ${insightsHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
         </div>
          <div class="gen-phase-card">
            <h3 class="gen-phase-title">③ 仕事の重みが増すフェーズ</h3>
            <p class="gen-phase-text">
              社会人中期〜後期は、役割と責任が増え、<br>
              自分だけの問題ではなくなることで判断が難しくなります。
            </p>
        </div>
      </section>

      <!-- ⑥ Choices -->
      <section class="stage-section accordion" data-section="choices">
        <button class="accordion-header" type="button">
          <div class="accordion-title-wrap">
            <span class="accordion-title">選択のコンパス</span>
            <span class="accordion-sub">よく迷う分岐に対する「軸」のヒント</span>
         </div>
          <div class="gen-phase-card">
            <h3 class="gen-phase-title">④ 自由度が再び高まるフェーズ</h3>
            <p class="gen-phase-text">
              セカンドキャリアは、「もう一度人生を再設計する」タイミング。<br>
              一周目の経験を、二周目の自由さに変換していくステージです。
            </p>
          <span class="accordion-icon">›</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <div class="choices-list">
              ${choicesHtml || "<p>データがまだ登録されていません。</p>"}
            </div>
         </div>
       </div>
      </div>
    `;

    contentRoot.appendChild(card);
  }

  // -----------------------------------------------------
  // 各ステージ：JSON から描画（簡易版7部構成）
  // -----------------------------------------------------
  function renderStageFromJson(data) {
    if (!data) {
      renderError("データが見つかりません。");
      return;
    }
      </section>

    const wrapper = document.createElement("div");
    wrapper.className = "gen-stage-wrapper";

    // 1. 概要
    const headerCard = document.createElement("div");
    headerCard.className = "gen-card gen-stage-header";

    headerCard.innerHTML = `
      <h2 class="gen-stage-title">${escapeHtml(data.title || "")}</h2>
      <p class="gen-stage-overview">${escapeHtml(data.overview || "")}</p>
      <div class="gen-tag-row">
        ${(data.essence || [])
          .map(
            (e) =>
              `<span class="gen-tag-pill">${escapeHtml(e)}</span>`
          )
          .join("")}
      </div>
      <!-- ⑦ Final Line -->
      <section class="stage-final">
        <p class="stage-final-label">指針一言</p>
        <p class="stage-final-text">${escapeHtml(finalLine)}</p>
      </section>
   `;

    // 2. 本質（Essence）＋ 3. 分岐（commonPaths）＋ 4. 迷い（pains）
    const coreCard = document.createElement("div");
    coreCard.className = "gen-card";

    coreCard.innerHTML = `
      <h3 class="gen-section-title">このステージの本質</h3>
      <p class="gen-section-sub">よくある構造・分岐・迷いをざっくり整理しています。</p>

      <h4 class="gen-section-title" style="font-size:0.92rem;margin-top:10px;">よくある分岐パターン</h4>
      <ul class="gen-list">
        ${(data.commonPaths || [])
          .map(
            (p) =>
              `<li><span class="gen-inline-label">${escapeHtml(
                p.label || ""
              )}</span>：${escapeHtml(p.desc || "")}</li>`
          )
          .join("")}
      </ul>

      <h4 class="gen-section-title" style="font-size:0.92rem;margin-top:14px;">よくある迷い・不安</h4>
      <ul class="gen-list">
        ${(data.pains || [])
          .map((p) => `<li>${escapeHtml(p)}</li>`)
          .join("")}
      </ul>
    `;
    stageContent.innerHTML = html;
    initAccordions();
  }

    // 5. Insights（二周目視点 × 処世術）
    const insightsCard = document.createElement("div");
    insightsCard.className = "gen-card";
  // アコーディオンの初期化
  function initAccordions() {
    const sections = Array.from(stageContent.querySelectorAll(".stage-section"));

    insightsCard.innerHTML = `
      <h3 class="gen-section-title">二周目視点 × 処世術</h3>
      <p class="gen-section-sub">一周目でつまずきやすいポイントを、構造ごと整理したメモです。</p>
    `;
    sections.forEach((section) => {
      const header = section.querySelector(".accordion-header");
      const panel = section.querySelector(".accordion-panel");
      if (!header || !panel) return;

    const insightsList = document.createElement("div");
    (data.insights || []).forEach((ins) => {
      const item = document.createElement("div");
      item.className = "gen-insight-item";
      item.innerHTML = `
        <p class="gen-insight-title">${escapeHtml(ins.title || "")}</p>
        <p class="gen-insight-abstract">${escapeHtml(ins.abstract || "")}</p>
        <p class="gen-insight-action">${escapeHtml(ins.action || "")}</p>
      `;
      insightsList.appendChild(item);
    });
    insightsCard.appendChild(insightsList);

    // 6. Choices（選択のコンパス）
    const choicesCard = document.createElement("div");
    choicesCard.className = "gen-card";
      // 初期状態は閉
      panel.style.maxHeight = "0px";

    choicesCard.innerHTML = `
      <h3 class="gen-section-title">選択のコンパス</h3>
      <p class="gen-section-sub">どちらを選んでもいいが、「何を大事にするか」を意識して選ぶためのメモです。</p>
    `;
      header.addEventListener("click", () => {
        const isOpen = section.classList.contains("is-open");

    const choicesList = document.createElement("div");
    (data.choices || []).forEach((ch) => {
      const item = document.createElement("div");
      item.className = "gen-choice-item";
      item.innerHTML = `
        <p class="gen-choice-title">${escapeHtml(ch.title || "")}</p>
        <p class="gen-choice-text">${escapeHtml(ch.insight || "")}</p>
      `;
      choicesList.appendChild(item);
        if (isOpen) {
          section.classList.remove("is-open");
          panel.style.maxHeight = "0px";
        } else {
          section.classList.add("is-open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
});
    choicesCard.appendChild(choicesList);

    // 7. Final Line
    const finalCard = document.createElement("div");
    finalCard.className = "gen-card";
    finalCard.innerHTML = `
      <p class="gen-final-line">${escapeHtml(data.finalLine || "")}</p>
    `;

    wrapper.appendChild(headerCard);
    wrapper.appendChild(coreCard);
    wrapper.appendChild(insightsCard);
    wrapper.appendChild(choicesCard);
    wrapper.appendChild(finalCard);

    contentRoot.appendChild(wrapper);
}

  // -----------------------------------------------------
  // エラー表示
  // -----------------------------------------------------
  function renderError(msg) {
    const card = document.createElement("div");
    card.className = "gen-card";
    card.innerHTML = `
      <p style="margin:0;font-size:0.9rem;color:var(--text-sub);">
        ${escapeHtml(msg)}
      </p>
    `;
    contentRoot.appendChild(card);
  }

  // -----------------------------------------------------
  // シンプルなエスケープ
  // -----------------------------------------------------
  // シンプルなエスケープ処理
function escapeHtml(str) {
if (typeof str !== "string") return "";
return str
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
      .replace(/'/g, "&#39;");
}

  // タブクリックイベント
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const stage = tab.getAttribute("data-stage");
      if (!stage || stage === currentStage) return;
      setStage(stage, true);
    });
  });

  // 初期表示ステージを反映
  setStage(currentStage, false);
});
