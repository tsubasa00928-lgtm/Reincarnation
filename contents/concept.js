// contents/concept.js
// コンセプトページ専用の軽いスクリプト。
// いまはナビゲーションの「コンセプト」タブの状態を保証するのみ。
// （他ページの JS と同じ3ファイル構成を揃えるためのファイル。）

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".header-nav .nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    // パスの末尾が concept.html のリンクを「現在地」とみなす
    if (href.endsWith("concept.html")) {
      link.classList.add("is-current");
    } else {
      link.classList.remove("is-current");
    }
  });
});
