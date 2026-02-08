// js/ciphers/transposition.js

function normalizeKey(key) {
  // Keep letters/numbers only (safer for UI)
  return String(key).trim();
}

function getColumnOrder(key) {
  // Stable ordering: sort by character, and keep original index for ties
  const chars = [...key];
  const pairs = chars.map((ch, i) => ({ ch: ch.toLowerCase(), i }));
  pairs.sort((a, b) => (a.ch < b.ch ? -1 : a.ch > b.ch ? 1 : a.i - b.i));
  return pairs.map((p) => p.i); // indices in reading order
}

export function columnarEncrypt(text, key) {
  const k = normalizeKey(key);
  if (!k.length) return "";

  const cols = k.length;
  const msg = String(text);

  // Fill grid row-wise
  const rows = Math.ceil(msg.length / cols);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = idx < msg.length ? msg[idx++] : ""; // no padding char
    }
  }

  // Read columns by sorted key order
  const order = getColumnOrder(k);
  let out = "";
  for (const c of order) {
    for (let r = 0; r < rows; r++) out += grid[r][c] || "";
  }
  return out;
}

export function columnarDecrypt(cipher, key) {
  const k = normalizeKey(key);
  if (!k.length) return "";

  const cols = k.length;
  const ct = String(cipher);
  const n = ct.length;

  const rows = Math.ceil(n / cols);
  const baseLen = Math.floor(n / cols);
  const extra = n % cols;

  // Determine length of each column in original column index space
  // Because we did row-wise fill without padding:
  // The first `extra` columns (by original index) have length baseLen+1, others baseLen.
  const colLens = Array(cols).fill(baseLen);
  for (let c = 0; c < extra; c++) colLens[c] = baseLen + 1;

  // But ciphertext columns are in sorted-key reading order:
  const order = getColumnOrder(k);

  // Build empty columns (original index) and fill from ciphertext
  const colsData = Array.from({ length: cols }, () => []);
  let idx = 0;

  for (const colIndex of order) {
    const len = colLens[colIndex];
    colsData[colIndex] = [...ct.slice(idx, idx + len)];
    idx += len;
  }

  // Reconstruct plaintext by reading row-wise
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = colsData[c][r];
      if (ch !== undefined) out += ch;
    }
  }
  return out;
}
