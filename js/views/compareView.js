// js/views/compareView.js
import { affineEncrypt, isValidAffineA } from "../ciphers/affine.js";
import { atbashTransform } from "../ciphers/atbash.js";
import { caesarEncrypt } from "../ciphers/caesar.js";
import { playfairEncrypt } from "../ciphers/playfair.js";
import { railFenceEncrypt } from "../ciphers/railFence.js";
import { columnarEncrypt } from "../ciphers/transposition.js";
import { vigenereEncrypt } from "../ciphers/vigenere.js";

const CIPHERS = [
  {
    id: "caesar",
    name: "Caesar",
    run: (v) => caesarEncrypt(v.text, Number(v.shift)),
    defaults: { shift: 3 },
  },
  {
    id: "atbash",
    name: "Atbash",
    run: (v) => atbashTransform(v.text),
    defaults: {},
  },
  {
    id: "vigenere",
    name: "Vigenère",
    run: (v) => vigenereEncrypt(v.text, v.vigKey),
    defaults: { vigKey: "KEY" },
  },
  {
    id: "railfence",
    name: "Rail Fence",
    run: (v) => railFenceEncrypt(v.text, Number(v.rails)),
    defaults: { rails: 3 },
  },
  {
    id: "affine",
    name: "Affine",
    run: (v) => affineEncrypt(v.text, Number(v.affA), Number(v.affB)),
    defaults: { affA: 5, affB: 8 },
  },
  {
    id: "columnar",
    name: "Columnar Transposition",
    run: (v) => columnarEncrypt(v.text, v.colKey),
    defaults: { colKey: "ZEBRA" },
  },
  {
    id: "playfair",
    name: "Playfair",
    run: (v) => playfairEncrypt(v.text, v.pfKey),
    defaults: { pfKey: "MONARCHY" },
  },
];

export function renderCompare(root) {
  root.innerHTML = `
    <section class="card">
      <div class="section-head">
        <div>
          <h2>Compare Mode</h2>
          <p>Run multiple ciphers on the same input and compare results instantly.</p>
        </div>
        <div class="row">
          <button id="copyAllBtn" class="btn btn-secondary" type="button">Copy All</button>
          <button id="clearBtn" class="btn btn-secondary" type="button">Clear</button>
        </div>
      </div>

      <label>Input Text</label>
      <textarea id="text" rows="3" placeholder="Enter text..."></textarea>

      <div class="grid-2">
        <div>
          <label>Caesar Shift</label>
          <input id="shift" type="number" value="3" min="-25" max="25" />
        </div>

        <div>
          <label>Vigenère Key</label>
          <input id="vigKey" type="text" value="KEY" />
        </div>

        <div>
          <label>Rail Fence Rails</label>
          <input id="rails" type="number" value="3" min="2" max="20" />
        </div>

        <div>
          <label>Affine Key (a)</label>
          <input id="affA" type="number" value="5" min="1" max="25" />
        </div>

        <div>
          <label>Affine Key (b)</label>
          <input id="affB" type="number" value="8" min="0" max="25" />
        </div>

        <div>
          <label>Columnar Key</label>
          <input id="colKey" type="text" value="ZEBRA" />
        </div>

        <div>
          <label>Playfair Key</label>
          <input id="pfKey" type="text" value="MONARCHY" />
        </div>
      </div>

      <div class="row">
        <button id="runBtn" class="btn">Run</button>

        <label class="toggle">
          <input id="autoRun" type="checkbox" />
          <span>Auto-run</span>
        </label>

        <label class="toggle">
          <input id="showAll" type="checkbox" checked />
          <span>Show all ciphers</span>
        </label>
      </div>

      <p id="errorBox" class="error hidden"></p>

      <div id="picker" class="picker hidden"></div>
    </section>

    <section class="card">
      <div class="section-head">
        <h3>Outputs</h3>
        <input id="filter" type="text" placeholder="Filter outputs (e.g., caesar, rail, playfair)..." />
      </div>
      <div class="compare-grid" id="results"></div>
    </section>
  `;

  const $ = (sel) => root.querySelector(sel);
  const text = $("#text");
  const errorBox = $("#errorBox");
  const results = $("#results");

  const runBtn = $("#runBtn");
  const clearBtn = $("#clearBtn");
  const copyAllBtn = $("#copyAllBtn");

  const autoRun = $("#autoRun");
  const showAll = $("#showAll");
  const picker = $("#picker");
  const filter = $("#filter");

  const inputs = {
    shift: $("#shift"),
    vigKey: $("#vigKey"),
    rails: $("#rails"),
    affA: $("#affA"),
    affB: $("#affB"),
    colKey: $("#colKey"),
    pfKey: $("#pfKey"),
  };

  // selection state
  let selected = new Set(CIPHERS.map((c) => c.id));

  // Build picker UI (only visible when showAll unchecked)
  picker.innerHTML = `
    <div class="picker-title">Select ciphers to run:</div>
    <div class="picker-grid">
      ${CIPHERS.map((c) => `
        <label class="pick">
          <input type="checkbox" data-id="${c.id}" checked />
          <span>${c.name}</span>
        </label>
      `).join("")}
    </div>
  `;

  picker.querySelectorAll('input[type="checkbox"][data-id]').forEach((cb) => {
    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-id");
      if (cb.checked) selected.add(id);
      else selected.delete(id);
      runIfAuto();
    });
  });

  function setError(msg) {
    if (!msg) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    } else {
      errorBox.textContent = msg;
      errorBox.classList.remove("hidden");
    }
  }

  function getValues() {
    return {
      text: text.value,
      shift: inputs.shift.value,
      vigKey: inputs.vigKey.value.trim(),
      rails: inputs.rails.value,
      affA: inputs.affA.value,
      affB: inputs.affB.value,
      colKey: inputs.colKey.value.trim(),
      pfKey: inputs.pfKey.value.trim(),
    };
  }

  function validate(v) {
    if (!v.text.trim()) return "Please enter input text.";

    const s = Number(v.shift);
    if (Number.isNaN(s) || s < -25 || s > 25) return "Caesar shift must be between -25 and 25.";

    const r = Number(v.rails);
    if (!Number.isInteger(r) || r < 2 || r > 20) return "Rail Fence rails must be an integer between 2 and 20.";

    const A = Number(v.affA);
    const B = Number(v.affB);
    if (!Number.isInteger(A) || A < 1 || A > 25) return "Affine 'a' must be an integer between 1 and 25.";
    if (!isValidAffineA(A)) return "Affine 'a' must be coprime with 26 (e.g., 1,3,5,7,9,11,15,17,19,21,23,25).";
    if (!Number.isInteger(B) || B < 0 || B > 25) return "Affine 'b' must be an integer between 0 and 25.";

    if (!v.vigKey) return "Please enter a Vigenère key.";
    if (!/^[a-zA-Z]+$/.test(v.vigKey)) return "Vigenère key should contain only letters (A–Z).";

    if (!v.colKey) return "Please enter a Columnar key.";
    if (v.colKey.length < 2) return "Columnar key should be at least 2 characters.";

    if (!v.pfKey) return "Please enter a Playfair key.";

    if (!showAll.checked && selected.size === 0) return "Select at least one cipher.";
    return null;
  }

  function renderCandidate({ name, out, ms }) {
    return `
      <div class="result-card">
        <div class="result-title">
          ${escapeHtml(name)}
          <span class="pill">${ms.toFixed(2)} ms</span>
        </div>
        <textarea rows="3" readonly>${escapeHtml(out)}</textarea>
        <div class="row">
          <button class="btn btn-secondary" type="button" data-copy="${attrEscape(out)}">Copy</button>
        </div>
      </div>
    `;
  }

  function run() {
    const v = getValues();
    const err = validate(v);
    setError(err);
    if (err) {
      results.innerHTML = "";
      return;
    }

    const q = filter.value.trim().toLowerCase();

    const chosen = showAll.checked
      ? CIPHERS
      : CIPHERS.filter((c) => selected.has(c.id));

    const computed = chosen.map((c) => {
      const t0 = performance.now();
      const out = String(c.run(v) ?? "");
      const t1 = performance.now();
      return { name: c.name, out, ms: t1 - t0, id: c.id };
    });

    const filtered = !q
      ? computed
      : computed.filter((x) =>
          `${x.name} ${x.id}`.toLowerCase().includes(q)
        );

    results.innerHTML = filtered.map(renderCandidate).join("");

    // attach copy handlers
    results.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const txt = btn.getAttribute("data-copy") || "";
        await copyText(txt);
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 800);
      });
    });
  }

  function runIfAuto() {
    if (autoRun.checked) run();
  }

  // show picker when not showing all
  showAll.addEventListener("change", () => {
    picker.classList.toggle("hidden", showAll.checked);
    runIfAuto();
  });

  // actions
  runBtn.addEventListener("click", run);

  clearBtn.addEventListener("click", () => {
    text.value = "";
    filter.value = "";
    results.innerHTML = "";
    setError(null);
  });

  copyAllBtn.addEventListener("click", async () => {
    // Copy rendered outputs only
    const blocks = [...results.querySelectorAll(".result-card")]
      .map((card) => {
        const title = card.querySelector(".result-title")?.innerText?.replace(/\s+ms.*$/, "") || "Cipher";
        const out = card.querySelector("textarea")?.value || "";
        return `${title}:\n${out}`;
      })
      .join("\n\n---\n\n");

    await copyText(blocks);
    const old = copyAllBtn.textContent;
    copyAllBtn.textContent = "Copied!";
    setTimeout(() => (copyAllBtn.textContent = old), 800);
  });

  // auto-run events
  [text, filter, ...Object.values(inputs)].forEach((el) => {
    el.addEventListener("input", () => {
      // debounce a bit
      window.clearTimeout(el._t);
      el._t = window.setTimeout(runIfAuto, 150);
    });
  });

  // initial state
  picker.classList.toggle("hidden", showAll.checked);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attrEscape(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
