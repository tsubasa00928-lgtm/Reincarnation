// ---------------------
// タブナビゲーション
// ---------------------
document.querySelectorAll(".tabbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
  });
});

// ---------------------
// 世代別マップ用データ
// ---------------------
const generationData = {
  "小学生": [
    "友だち関係（いじめ・仲間外れへの不安）",
    "勉強よりも遊びたい気持ちとのバランス",
    "親や先生に怒られることへの恐怖"
  ],
  "中学生": [
    "クラス内での立ち位置・キャラづくり",
    "成績・部活・恋愛など比較対象の増加",
    "将来のイメージがまだぼんやりしている不安"
  ],
  "高校生": [
    "進路選択（大学・就職）のプレッシャー",
    "偏差値・模試の結果による自己評価の上下",
    "親の期待と自分の本音のギャップ"
  ],
  "大学生": [
    "将来のキャリア・就活への漠然とした不安",
    "「周りは順調そう」に見えるSNSとの比較",
    "自分のやりたいことが分からない感覚"
  ],
  "社会人": [
    "仕事量・責任の増加によるストレス",
    "キャリアの方向性・転職のタイミングの悩み",
    "同期や同世代との収入・評価の比較"
  ],
  "定年後": [
    "役職・仕事を離れた後のアイデンティティ",
    "健康・老後資金への不安",
    "家族・地域との関わりの再構築"
  ]
};

let currentGeneration = "小学生";

const genTitleEl = document.getElementById("gen-title");
const genListEl = document.getElementById("gen-list");

// 世代の表示を更新
function renderGeneration(gen) {
  currentGeneration = gen;
  genTitleEl.textContent = `${gen}のよくあるテーマ`;

  const items = generationData[gen] || [];
  genListEl.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    genListEl.appendChild(li);
  });
}

// 初期表示
renderGeneration(currentGeneration);

// 世代タブのクリック
document.querySelectorAll(".generation-tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    const gen = btn.dataset.gen;
    document.querySelectorAll(".generation-tabs button").forEach(b => b.classList.remove("gen-active"));
    btn.classList.add("gen-active");
    renderGeneration(gen);
  });
});

// ---------------------
// 心理学データベース
// （超簡易版：キーワードマッチング）
// ---------------------
const psychDb = [
  {
    id: "social-comparison",
    name: "社会的比較理論",
    keywords: ["比較", "友達", "同期", "同級生", "周り", "SNS", "インスタ"],
    generations: ["中学生", "高校生", "大学生", "社会人"],
    desc: "人は自分の能力や価値を、他人との比較を通して判断しがちだという理論です。",
    thoughts: "「周りはうまくいっているのに自分だけダメだ」「あの人と比べて自分は…」などの思考。",
    tip: "比較の対象を『他人』ではなく『過去の自分』に変えることで、少し楽になることがあります。"
  },
  {
    id: "negativity-bias",
    name: "ネガティビティ・バイアス",
    keywords: ["不安", "心配", "最悪", "ミス", "失敗", "怖い", "怒られる"],
    generations: ["小学生", "中学生", "高校生", "大学生", "社会人", "定年後"],
    desc: "良い出来事よりも悪い出来事の方を強く・長く記憶しやすいという傾向です。",
    thoughts: "「失敗したらどうしよう」「うまくいかない未来ばかり想像してしまう」。",
    tip: "起きた良いこと・小さな成功も意識的に3つ書き出すなど、ポジティブを“見える化”する習慣が有効です。"
  },
  {
    id: "identity-diffusion",
    name: "アイデンティティの拡散",
    keywords: ["将来", "進路", "自分", "やりたいこと", "わからない", "迷う"],
    generations: ["高校生", "大学生", "社会人"],
    desc: "自分が何者で、何を大事にして生きていくかがはっきりしない状態を指します。",
    thoughts: "「何をしたいのか分からない」「全部中途半端な気がする」。",
    tip: "いきなり“天職”を決めようとせず、『興味がマシな方』を少しずつ試す“実験”として考えると楽になります。"
  },
  {
    id: "burnout",
    name: "バーンアウト（燃え尽き症候群）",
    keywords: ["疲れた", "やる気が出ない", "何もしたくない", "仕事", "勉強"],
    generations: ["高校生", "大学生", "社会人"],
    desc: "長期間のストレスや過度な負荷で、心身のエネルギーがすり減った状態です。",
    thoughts: "「前はやる気があったのに、最近は何もする気になれない」。",
    tip: "休息と『やることを減らす』ことが重要です。短期的な成果より、まず回復を優先してOKな状態です。"
  },
  {
    id: "impostor",
    name: "インポスター症候群",
    keywords: ["実力", "たまたま", "自信がない", "周りはすごい", "騙している"],
    generations: ["大学生", "社会人"],
    desc: "周囲から評価されていても『自分は実力がなく、いつかバレる』と感じてしまう現象です。",
    thoughts: "「自分だけ実力がないのに、たまたまここにいるだけだ」。",
    tip: "具体的な成果や行動を書き出し、『事実ベースで見る練習』をすると自己評価が安定しやすくなります。"
  },
  {
    id: "status-quo",
    name: "現状維持バイアス",
    keywords: ["変わりたくない", "面倒", "このまま", "決められない", "選べない"],
    generations: ["全世代"],
    desc: "本当は変えた方が良いかもしれなくても、『今のまま』を選びたくなる傾向です。",
    thoughts: "「動いた方が良いのは分かってるけど、なんとなく今のままでいいかも」。",
    tip: "『とりあえず1ミリだけ動く』小さな行動を決めると、現状維持から抜けやすくなります。"
  }
];

// ---------------------
// 心理学検索ロジック
// ---------------------
const anxietyInput = document.getElementById("anxiety-input");
const analyzeBtn = document.getElementById("analyze-btn");
const psychResult = document.getElementById("psych-result");
const psychName = document.getElementById("psych-name");
const psychDesc = document.getElementById("psych-desc");
const psychThoughts = document.getElementById("psych-thoughts");
const psychTip = document.getElementById("psych-tip");

analyzeBtn.addEventListener("click", () => {
  const text = (anxietyInput.value || "").trim();
  if (!text) {
    alert("まず、今の状況や不安を一言でも書いてみてください。");
    return;
  }

  const lowerText = text.toLowerCase();
  let best = null;
  let bestScore = 0;

  psychDb.forEach(item => {
    let score = 0;

    // キーワードマッチング
    item.keywords.forEach(kw => {
      if (!kw) return;
      if (text.includes(kw)) {
        score += 2;
      }
    });

    // 世代マッチボーナス
    if (item.generations.includes(currentGeneration) || item.generations.includes("全世代")) {
      score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  });

  if (!best || bestScore === 0) {
    // それっぽいものが見つからなかったときのフォールバック
    psychName.textContent = "はっきりした名前は付けにくいけれど…";
    psychDesc.textContent =
      "今のあなたの気持ちは、複数の要素（不安・比較・将来への迷いなど）が混ざった、とても自然な反応だと考えられます。";
    psychThoughts.textContent =
      "どの世代でも、『このままでいいのか？』という問いは何度も出てきます。それ自体が「人生二周目ノート」のスタート地点です。";
    psychTip.textContent =
      "少しだけ言語化を続けてみると、自分なりのテーマ（例：比較・将来・健康など）が見えてきます。そのテーマごとに心理学の概念を当てはめていくと整理しやすくなります。";
  } else {
    psychName.textContent = best.name;
    psychDesc.textContent = best.desc;
    psychThoughts.textContent = best.thoughts;
    psychTip.textContent = best.tip;
  }

  psychResult.classList.remove("hidden");
});

// ---------------------
// 価値観ノート保存
// ---------------------
const valuesInput = document.getElementById("values-input");
const saveButton = document.getElementById("save-values");
const statusText = document.getElementById("save-status");

if (valuesInput) {
  valuesInput.value = localStorage.getItem("valuesNote") || "";

  saveButton.addEventListener("click", () => {
    localStorage.setItem("valuesNote", valuesInput.value);
    statusText.textContent = "保存しました ✔";
    setTimeout(() => statusText.textContent = "", 1500);
  });
}
