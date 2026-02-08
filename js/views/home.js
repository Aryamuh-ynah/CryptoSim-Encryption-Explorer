// js/views/home.js

const CIPHERS = [
  { route: "caesar", name: "Caesar Cipher", tag: "Substitution", desc: "Shift letters by a fixed value." },
  { route: "vigenere", name: "Vigenère Cipher", tag: "Polyalphabetic", desc: "Keyword-based shifting cipher." },
  { route: "atbash", name: "Atbash Cipher", tag: "Substitution", desc: "Reverse alphabet mapping (A↔Z)." },
  { route: "affine", name: "Affine Cipher", tag: "Math", desc: "Modular arithmetic substitution cipher." },
  { route: "railfence", name: "Rail Fence Cipher", tag: "Transposition", desc: "Zig-zag rail transposition." },
  { route: "transposition", name: "Columnar Transposition", tag: "Transposition", desc: "Reorder by keyword column order." },
  { route: "playfair", name: "Playfair Cipher", tag: "Digraph", desc: "Encrypts letter pairs using 5×5 key square." },
];

const TOOLS = [
  { route: "compare", name: "Compare Mode", tag: "Tool", desc: "Compare multiple cipher outputs quickly." },
  { route: "frequency", name: "Frequency Analysis", tag: "Tool", desc: "Analyze A–Z letter distribution." },
  { route: "attack-caesar", name: "Caesar Attack", tag: "Cryptanalysis", desc: "Brute-force all shifts and rank results." },
];

export function renderHome(root) {
  root.innerHTML = `
    <section class="card">
      <div class="hero">
        <div>
          <h2>CryptoSim Dashboard</h2>
          <p>
            Explore classical encryption techniques, compare algorithms, and try basic cryptanalysis — all in your browser.
          </p>

          <div class="row">
            <a class="btn btn-secondary" href="#compare">Open Compare Mode</a>
            <a class="btn btn-secondary" href="#frequency">Frequency Tool</a>
            <a class="btn btn-secondary" href="#attack-caesar">Caesar Attack</a>
          </div>
        </div>

        <div class="hero-box">
          <div class="hero-stat">
            <div class="hero-stat-num">${CIPHERS.length}</div>
            <div class="hero-stat-label">Ciphers</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${TOOLS.length}</div>
            <div class="hero-stat-label">Tools</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">100%</div>
            <div class="hero-stat-label">Client-side</div>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h3>Find a Cipher</h3>
      <p>Search by name or category (e.g., “transposition”, “math”, “digraph”).</p>
      <input id="search" type="text" placeholder="Search ciphers..." />
    </section>

    <section class="card">
      <div class="section-head">
        <h3>Ciphers</h3>
        <span class="muted">Click a card to open</span>
      </div>
      <div id="cipherGrid" class="card-grid"></div>
    </section>

    <section class="card">
      <div class="section-head">
        <h3>Tools</h3>
        <span class="muted">Utilities for learning & analysis</span>
      </div>
      <div class="tool-grid">
        ${TOOLS.map(renderToolCard).join("")}
      </div>
    </section>
  `;

  const grid = root.querySelector("#cipherGrid");
  const search = root.querySelector("#search");

  function updateList() {
    const q = search.value.trim().toLowerCase();
    const filtered = !q
      ? CIPHERS
      : CIPHERS.filter((c) =>
          `${c.name} ${c.tag} ${c.desc}`.toLowerCase().includes(q)
        );

    grid.innerHTML = filtered.map(renderCipherCard).join("");

    // click handler (event delegation)
    grid.querySelectorAll("[data-route]").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = el.getAttribute("data-route");
      });
    });
  }

  search.addEventListener("input", updateList);
  updateList();
}

function renderCipherCard(c) {
  return `
    <div class="mini-card" role="button" tabindex="0" data-route="${c.route}">
      <div class="badge">${escapeHtml(c.tag)}</div>
      <div class="mini-title">${escapeHtml(c.name)}</div>
      <div class="mini-desc">${escapeHtml(c.desc)}</div>
      <div class="mini-link">Open →</div>
    </div>
  `;
}

function renderToolCard(t) {
  return `
    <a class="mini-card mini-card-link" href="#${t.route}">
      <div class="badge badge-soft">${escapeHtml(t.tag)}</div>
      <div class="mini-title">${escapeHtml(t.name)}</div>
      <div class="mini-desc">${escapeHtml(t.desc)}</div>
      <div class="mini-link">Open →</div>
    </a>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
