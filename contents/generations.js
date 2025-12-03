// generations.js
// 世代別ノート：JSON を読み込んで 7部構成の UI を動的描画
// =====================================================
// ・?stage=top / elementary / middle ... に応じて内容を切り替え
// ・サイドバーの .stage-tab をクリックすると各ステージへ遷移
// ・各ステージは ./data/<stage>.json から読み込み
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------
  // DOM 取得
  // ---------------------------------------------------
  const stageTitleEl = document.getElementById("stageTitle");
  const overviewTextEl = document.getElementById("overviewText");
  const accordionRoot = document.getElementById("accordionRoot");
  const finalLineEl = document.getElementById("finalLine");

  // サイドバーのタブ（≪トップ≫ / 1.小学生 …）
  const stageTabs = Array.from(document.querySelectorAll(".stage-tab"));

  // 利用するステージ一覧
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

  // ---------------------------------------------------
  // 初期ステージ決定（?stage= があればそれを優先）
  // ---------------------------------------------------
  const initialFromQuery = getStageFromQuery();
  let currentStage = validStages.includes(initialFromQuery)
    ? initialFromQuery
    : "university"; // デフォルトは大学・専門期

  // ---------------------------------------------------
  // タブクリック時の挙動
  // ---------------------------------------------------
  stageTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const stage = tab.getAttribute("data-stage");
      if (!stage || !validStages.includes(stage) || stage === currentStage) {
        return;
      }
      setStage(stage, true);
    });
  });

  // ---------------------------------------------------
  // 初期表示
  // ---------------------------------------------------
  setStage(currentStage, false);

  // ===================================================
  // 関数定義
  // ===================================================

  /**
   * クエリパラメータから stage を取得
   */
  function getStageFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("stage") || "";
  }

  /**
   * ステージ切り替えのメイン処理
   * @param {string} stage
   * @param {boolean} updateUrl - true の場合、URL の ?stage= も更新
   */
  function setStage(stage, updateUrl) {
    if (!validStages.includes(stage)) {
      stage = "university";
    }
    currentStage = stage;

    // タブの見た目更新
    highlightStageTab(stage);

    // URL の ?stage= を同期
    if (updateUrl) {
      syncUrl(stage);
    }

    // トップ（≪トップ≫）だけは JSON 読み込みを行わず、簡易メッセージ表示にする
    if (stage === "top") {
      renderTopPlaceholder();
      return;
    }

    const filePath = `data/${stage}.json`;

    // ローディング中メッセージ
    if (accordionRoot) {
      accordionRoot.innerHTML =
        '<p class="stage-message">このステージの構造を読み込んでいます…</p>';
    }
    if (stageTitleEl) stageTitleEl.textContent = "";
    if (overviewTextEl) overviewTextEl.textContent = "";
    if (finalLineEl) finalLineEl.textContent = "";

    // JSON を読み込んでレンダリング
    fetch(filePath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`JSON 読み込みエラー: ${filePath}`);
        }
        return res.json();
      })
      .then((data) => {
        renderGeneration(data);
      })
      .catch((err) => {
        console.error(err);
        showErrorMessage(filePath);
      });
  }

  /**
   * ステージタブの active / is-active を更新
   */
  function highlightStageTab(stage) {
    stageTabs.forEach((tab) => {
      const key = tab.getAttribute("data-stage");
      const isActive = key === stage;
      tab.classList.toggle("is-active", isActive);
      tab.classList.toggle("active", isActive); // 旧CSS互換
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  /**
   * URL の ?stage= を同期
   */
  function syncUrl(stage) {
    const url = new URL(window.location.href);
    if (stage === "university") {
      // デフォルトステージならパラメータを省略してもよい
      url.searchParams.delete("stage");
    } else {
      url.searchParams.set("stage", stage);
    }
    window.history.replaceState({}, "", url.toString());
  }

  /**
   * トップタブ（≪トップ≫）用のプレースホルダ表示
   * ここでは JSON を読み込まず、「サイドのタブから選んでください」のような案内にする
   */
  function renderTopPlaceholder() {
    if (stageTitleEl) {
      stageTitleEl.textContent = "人生地図禄（トップ）";
    }
    if (overviewTextEl) {
      overviewTextEl.textContent =
        "人生全体の流れを俯瞰しつつ、左のステージタブから気になるフェーズを選んでください。";
    }
    if (accordionRoot) {
      accordionRoot.innerHTML = `
        <article class="accordion is-open">
          <div class="accordion-header">
            <div class="accordion-header-main">
              <div class="accordion-title">使い方</div>
              <div class="accordion-subtitle">左の「1.小学生〜8.セカンドキャリア」のタブから、今知りたいステージを選びます。</div>
            </div>
          </div>
          <div class="accordion-body" style="max-height:none;">
            <div class="accordion-inner">
              <p>それぞれのステージで：</p>
              <ul>
                <li>その時期の <strong>本質</strong>（構造）</li>
                <li>よくある <strong>分岐パターン</strong></li>
                <li>つまずきやすい <strong>迷い・不安</strong></li>
                <li>二周目視点の <strong>Insights</strong></li>
                <li>どちらを選んでも後悔しないための <strong>選択のコンパス</strong></li>
              </ul>
              <p>…といった 7 部構成で、「今どこにいて、どこで詰まりやすいか」を整理できるようになっています。</p>
            </div>
          </div>
        </article>
      `;
    }
    if (finalLineEl) {
      finalLineEl.textContent = "";
    }
  }

  /**
   * JSON データから UI を構築（7部構成）
   */
  function renderGeneration(data) {
    if (!accordionRoot) return;

    // ① 概要
    if (stageTitleEl) stageTitleEl.textContent = data.title || "";
    if (overviewTextEl) overviewTextEl.textContent = data.overview || "";

    // ②〜⑥ アコーディオン描画
    accordionRoot.innerHTML = "";

    // ② 本質
    accordionRoot.appendChild(
      createAccordionSection(
        "本質",
        "このステージの深い構造",
        "essence",
        createEssenceContent(data.essence || [])
      )
    );

    // ③ 分岐パターン
    accordionRoot.appendChild(
      createAccordionSection(
        "分岐パターン",
        "この時期によく起こる選択の分かれ道",
        "paths",
        createCommonPathsContent(data.commonPaths || [])
      )
    );

    // ④ 迷い・不安
    accordionRoot.appendChild(
      createAccordionSection(
        "迷い・不安",
        "このステージでよく生まれるモヤモヤ",
        "pains",
        createPainsContent(data.pains || [])
      )
    );

    // ⑤ Insights
    accordionRoot.appendChild(
      createAccordionSection(
        "二周目視点 × 処世術",
        "抽象と具体で、このステージを軽くする",
        "insights",
        createInsightsContent(data.insights || [])
      )
    );

    // ⑥ Choices
    accordionRoot.appendChild(
      createAccordionSection(
        "選択のコンパス",
        "どちらを選んでも後悔しないためのヒント",
        "choices",
        createChoicesContent(data.choices || [])
      )
    );

    // ⑦ 指針一言
    if (finalLineEl) {
      finalLineEl.textContent = data.finalLine || "";
    }

    // アコーディオン動作のセットアップ
    setupAccordions();
  }

  /**
   * アコーディオンセクション生成
   */
  function createAccordionSection(title, subtitle, key, bodyContentEl) {
    const wrapper = document.createElement("article");
    wrapper.className = "accordion";
    wrapper.dataset.section = key;

    const headerBtn = document.createElement("button");
    headerBtn.type = "button";
    headerBtn.className = "accordion-header";

    const main = document.createElement("div");
    main.className = "accordion-header-main";

    const titleEl = document.createElement("div");
    titleEl.className = "accordion-title";
    titleEl.textContent = title;

    const subtitleEl = document.createElement("div");
    subtitleEl.className = "accordion-subtitle";
    subtitleEl.textContent = subtitle;

    main.appendChild(titleEl);
    main.appendChild(subtitleEl);

    const icon = document.createElement("div");
    icon.className = "accordion-icon";
    icon.textContent = "＋";

    headerBtn.appendChild(main);
    headerBtn.appendChild(icon);

    const body = document.createElement("div");
    body.className = "accordion-body";

    const inner = document.createElement("div");
    inner.className = "accordion-inner";

    if (bodyContentEl) {
      inner.appendChild(bodyContentEl);
    } else {
      inner.textContent = "データがありません。";
    }

    body.appendChild(inner);

    wrapper.appendChild(headerBtn);
    wrapper.appendChild(body);

    return wrapper;
  }

  /**
   * 本質（Essence）コンテンツ生成
   */
  function createEssenceContent(essenceArr) {
    const ul = document.createElement("ul");
    ul.className = "essence-list";

    essenceArr.forEach((text) => {
      if (!text) return;
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });

    return ul;
  }

  /**
   * 分岐パターン（Common Paths）コンテンツ生成
   */
  function createCommonPathsContent(paths) {
    const ul = document.createElement("ul");
    ul.className = "paths-list";

    paths.forEach((p) => {
      if (!p || (!p.label && !p.desc)) return;
      const li = document.createElement("li");

      const label = document.createElement("div");
      label.className = "path-item-label";
      label.textContent = p.label || "";

      const desc = document.createElement("p");
      desc.className = "path-item-desc";
      desc.textContent = p.desc || "";

      li.appendChild(label);
      li.appendChild(desc);
      ul.appendChild(li);
    });

    return ul;
  }

  /**
   * 迷い・不安（Pains）コンテンツ生成
   */
  function createPainsContent(pains) {
    const grid = document.createElement("div");
    grid.className = "pains-grid";

    pains.forEach((p) => {
      if (!p) return;
      const card = document.createElement("div");
      card.className = "pain-card";
      card.textContent = p;
      grid.appendChild(card);
    });

    return grid;
  }

  /**
   * Insights コンテンツ生成
   */
  function createInsightsContent(insights) {
    const wrapper = document.createElement("div");
    wrapper.className = "insights-list";

    insights.forEach((ins) => {
      if (!ins || (!ins.title && !ins.abstract && !ins.action)) return;

      const card = document.createElement("article");
      card.className = "insight-card";

      if (ins.title) {
        const t = document.createElement("h3");
        t.className = "insight-title";
        t.textContent = ins.title;
        card.appendChild(t);
      }

      if (ins.abstract) {
        const ab = document.createElement("p");
        ab.className = "insight-abstract";
        ab.textContent = ins.abstract;
        card.appendChild(ab);
      }

      if (ins.action) {
        const ac = document.createElement("p");
        ac.className = "insight-action";
        ac.textContent = ins.action;
        card.appendChild(ac);
      }

      wrapper.appendChild(card);
    });

    return wrapper;
  }

  /**
   * Choices コンテンツ生成
   */
  function createChoicesContent(choices) {
    const wrapper = document.createElement("div");
    wrapper.className = "choices-list";

    choices.forEach((c) => {
      if (!c || (!c.title && !c.insight)) return;

      const card = document.createElement("article");
      card.className = "choice-card";

      if (c.title) {
        const t = document.createElement("h3");
        t.className = "choice-title";
        t.textContent = c.title;
        card.appendChild(t);
      }

      if (c.insight) {
        const ins = document.createElement("p");
        ins.className = "choice-insight";
        ins.textContent = c.insight;
        card.appendChild(ins);
      }

      wrapper.appendChild(card);
    });

    return wrapper;
  }

  /**
   * アコーディオン動作セットアップ
   */
  function setupAccordions() {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach((acc) => {
      const header = acc.querySelector(".accordion-header");
      const body = acc.querySelector(".accordion-body");

      if (!header || !body) return;

      // 初期は閉じた状態
      body.style.maxHeight = "0px";

      header.addEventListener("click", () => {
        const isOpen = acc.classList.contains("open");

        if (isOpen) {
          acc.classList.remove("open");
          body.style.maxHeight = "0px";
        } else {
          acc.classList.add("open");
          const inner = body.querySelector(".accordion-inner");
          const targetHeight = inner ? inner.scrollHeight : 0;
          body.style.maxHeight = `${targetHeight}px`;
        }
      });
    });
  }

  /**
   * エラー表示
   */
  function showErrorMessage(filePath) {
    if (stageTitleEl)
      stageTitleEl.textContent = "データを読み込めませんでした";
    if (overviewTextEl)
      overviewTextEl.textContent = `URL やファイル構成（${filePath}）を確認してください。`;

    if (accordionRoot) {
      accordionRoot.innerHTML = "";
      const p = document.createElement("p");
      p.className = "stage-message";
      p.textContent = "このステージの詳細データは順次追加予定です。";
      accordionRoot.appendChild(p);
    }

    if (finalLineEl) {
      finalLineEl.textContent = "";
    }
  }
});
