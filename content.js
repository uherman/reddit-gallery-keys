(() => {
  const log = (...args) => console.log("[reddit-arrowkeys]", ...args);

  const PREV_REGEX =
    /\bprevious\b|\bprev\b|föregående|anterior|précédent|vorherige|forrige|vorige|edellinen|önceki|前へ|이전|предыдущ/i;
  const NEXT_REGEX =
    /\bnext\b|nästa|siguiente|suivant|nächste|próxim|prossim|successivo|volgende|seuraava|sonraki|次へ|다음|следующ/i;

  function deepQueryAll(selector, root = document) {
    const out = [];
    const visited = new WeakSet();
    const walk = (node) => {
      if (!node || visited.has(node)) return;
      visited.add(node);
      if (node.querySelectorAll) out.push(...node.querySelectorAll(selector));
      if (node.shadowRoot) walk(node.shadowRoot);
      for (const el of node.querySelectorAll?.("*") || []) {
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    };
    walk(root);
    return out;
  }

  const isVisible = (el) => {
    if (el.checkVisibility) {
      return el.checkVisibility({
        checkVisibilityCSS: true,
        checkOpacity: true,
      });
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const isInLightbox = () =>
    location.hash.toLowerCase().includes("lightbox") ||
    deepQueryAll("shreddit-media-lightbox").length > 0;

  function buttonFromSlot(name) {
    const candidates = deepQueryAll(`[slot="${name}"]`)
      .map((s) => (s.tagName === "BUTTON" ? s : s.querySelector("button")))
      .filter((b) => b && isVisible(b));
    if (candidates.length <= 1) return candidates[0] || null;

    // Multiple visible candidates means the feed is rendered behind the
    // lightbox overlay. The lightbox chevrons sit at the viewport edges;
    // feed-card chevrons are inset. Pick the one closest to the edge.
    const isPrev = name === "prevButton";
    candidates.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return isPrev ? ar.left - br.left : br.right - ar.right;
    });
    return candidates[0];
  }

  function findNavButtons() {
    let prev = buttonFromSlot("prevButton");
    let next = buttonFromSlot("nextButton");
    if (prev && next) return { prev, next };

    for (const btn of deepQueryAll("button, [role='button']").filter(isVisible)) {
      if (prev && next) break;
      const label = (btn.getAttribute("aria-label") || "").trim();
      if (!prev && PREV_REGEX.test(label)) prev = btn;
      if (!next && NEXT_REGEX.test(label)) next = btn;
    }
    return { prev, next };
  }

  function isTyping(e) {
    const path = e.composedPath ? e.composedPath() : [e.target];
    return path.some(
      (el) =>
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable),
    );
  }

  function handleKey(e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
    if (isTyping(e)) return;
    if (!isInLightbox()) return;

    const { prev, next } = findNavButtons();
    const target = e.key === "ArrowRight" ? next : prev;
    if (!target) {
      log("no nav button found for", e.key);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    target.click();
  }

  window.addEventListener("keydown", handleKey, true);
  log("loaded");
})();
