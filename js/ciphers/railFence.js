// js/ciphers/railFence.js

export function railFenceEncrypt(text, rails) {
  const r = Number(rails);
  if (!text || r <= 1) return text;

  const fence = Array.from({ length: r }, () => []);
  let row = 0;
  let dir = 1;

  for (const ch of text) {
    fence[row].push(ch);
    row += dir;

    if (row === 0 || row === r - 1) dir *= -1;
  }

  return fence.flat().join("");
}

export function railFenceDecrypt(cipher, rails) {
  const r = Number(rails);
  if (!cipher || r <= 1) return cipher;

  // Step 1: mark zigzag positions
  const n = cipher.length;
  const marks = Array.from({ length: r }, () => Array(n).fill(false));

  let row = 0;
  let dir = 1;
  for (let col = 0; col < n; col++) {
    marks[row][col] = true;
    row += dir;
    if (row === 0 || row === r - 1) dir *= -1;
  }

  // Step 2: fill marked positions with ciphertext sequentially
  const grid = Array.from({ length: r }, () => Array(n).fill(null));
  let idx = 0;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < n; j++) {
      if (marks[i][j]) {
        grid[i][j] = cipher[idx++];
      }
    }
  }

  // Step 3: read plaintext in zigzag order
  let result = "";
  row = 0;
  dir = 1;
  for (let col = 0; col < n; col++) {
    result += grid[row][col];
    row += dir;
    if (row === 0 || row === r - 1) dir *= -1;
  }

  return result;
}
