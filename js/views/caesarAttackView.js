// js/views/caesarAttackView.js
import { caesarDecrypt } from "../ciphers/caesar.js";

const COMMON_WORDS = [
  "the","be","to","of","and","a","in","that","have","i","it","for","not","on","with","he","as","you","do","at",
  "this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there",
  "their","what","so","up","out","if","about","who","get","which","go","me"
];

export function renderCaesarAttack(root) {
  root.innerHTML = `
    <section class="card">
      <h2>Caesar Cipher Attack (Brute Force)</h2>
      <p>
        Paste a Caesar-encrypted message and the tool will try all shifts (0–25),
        score results, and rank the most likely plaintext candidates.
      </p>

      <label>Ciphertext</label>
      <textarea id="ciphertext" rows="4" placeholder="Paste ciphertext here..."></textarea>

      <div class="row">
        <button id="runBtn" class="btn">Run Attack</button>
        <button id="clearBtn" class="btn btn-secondary" type="button">Clear</button>
      </div>

      <p id="errorBox" class="error hidden"></p>
    </section>

    <section class="card">
      <h3>Top Candidates</h3>
      <div id="results" class="attack-results"></div>
    </section>
  `;

  const $ = (sel) => root.querySelector(sel);
  const ctEl = $("#ciphertext");
  const runBtn = $("#runBtn");
  const clearBtn = $("#clearBtn");
  const errorBox = $("#errorBox");
  const results = $("#results");

  function setError(msg) {
    if (!msg) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    } else {
      errorBox.textContent = msg;
      errorBox.classList.remove("hidden");
    }
  }

  function run() {
    const ct = ctEl.value;
    if (!ct.trim()) {
      setError("Please enter ciphertext first.");
      results.innerHTML = "";
      return;
    }
    setError(null);

    // Try all shifts (0..25) and score
    const candidates = [];
    for (let shift = 0; shift < 26; shift++) {
      const pt = caesarDecrypt(ct, shift);
      const score = scoreEnglish(pt);
      candidates.push({ shift, pt, score });
    }

    // Sort best first
    candidates.sort((a, b) => b.score - a.score);

    // Render (top 10 is enough, but you can show all)
    results.innerHTML = candidates
      .slice(0, 10)
      .map((c, idx) => renderCandidateCard(c, idx + 1))
      .join("");

    // Attach copy handlers
    results.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.getAttribute("data-copy") || "";
        await copyText(text);
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 800);
      });
    });
  }

  runBtn.addEventListener("click", run);
  clearBtn.addEventListener("click", () => {
    ctEl.value = "";
    results.innerHTML = "";
    setError(null);
  });
}

function renderCandidateCard({ shift, pt, score }, rank) {
  return `
    <div class="result-card">
      <div class="result-title">
        #${rank} — Shift: ${shift} <span class="muted">(score: ${score.toFixed(2)})</span>
      </div>
      <textarea rows="3" readonly>${escapeHtml(pt)}</textarea>
      <div class="row">
        <button class="btn btn-secondary" type="button" data-copy="${attrEscape(pt)}">Copy</button>
      </div>
    </div>
  `;
}

// Very lightweight scoring (no libraries)
// Adds points for: common words, vowels, spaces, and penalizes weird symbols density
function scoreEnglish(text) {
  const t = String(text);

  const lower = t.toLowerCase();
  const words = lower.split(/[^a-z]+/).filter(Boolean);

  let score = 0;

  // Common word hits
  const wordSet = new Set(words);
  for (const w of COMMON_WORDS) {
    if (wordSet.has(w)) score += 2.5;
  }

  // Vowel ratio (English-like text tends to have vowels)
  const letters = (lower.match(/[a-z]/g) || []).length;
  const vowels = (lower.match(/[aeiou]/g) || []).length;
  if (letters > 0) {
    const ratio = vowels / letters; // typical ~0.35-0.45
    score += 10 * (1 - Math.abs(ratio - 0.40)); // max near 0.40
  }

  // Space bonus (sentences have spaces)
  const spaces = (t.match(/ /g) || []).length;
  score += Math.min(spaces, 10) * 0.6;

  // Penalize too many non-printables / symbols
  const weird = (t.match(/[^a-zA-Z0-9\s.,'"\-!?]/g) || []).length;
  score -= weird * 0.8;

  // Slight bonus for punctuation that looks normal
  const normalPunc = (t.match(/[.,'"\-!?]/g) || []).length;
  score += Math.min(normalPunc, 10) * 0.2;

  return score;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback
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

// For putting text inside an HTML attribute safely
function attrEscape(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
