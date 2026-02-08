// js/ciphers/playfair.js
// Playfair rules (standard):
// - Build 5x5 key square (I/J combined -> use I for both)
// - Prepare plaintext in digraphs:
//   - Replace J with I
//   - Remove non-letters
//   - If pair has same letters, insert X between (e.g., BALLOON -> BA LX LO ON)
//   - If odd length, pad with X
// - Encryption:
//   - Same row: shift right
//   - Same col: shift down
//   - Rectangle: swap columns
// - Decryption:
//   - Same row: shift left
//   - Same col: shift up
//   - Rectangle: swap columns

function cleanLetters(str) {
  return [...String(str).toUpperCase()]
    .filter((ch) => ch >= "A" && ch <= "Z")
    .map((ch) => (ch === "J" ? "I" : ch))
    .join("");
}

function buildKeySquare(key) {
  const cleaned = cleanLetters(key);
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // no J

  const seen = new Set();
  const letters = [];

  for (const ch of cleaned + alphabet) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }

  // 5x5 matrix
  const square = [];
  for (let i = 0; i < 5; i++) {
    square.push(letters.slice(i * 5, i * 5 + 5));
  }

  // map letter -> position
  const pos = new Map();
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      pos.set(square[r][c], { r, c });
    }
  }

  return { square, pos };
}

function makeDigraphs(text) {
  const t = cleanLetters(text);
  const pairs = [];
  let i = 0;

  while (i < t.length) {
    const a = t[i];
    const b = t[i + 1];

    if (!b) {
      pairs.push([a, "X"]);
      i += 1;
    } else if (a === b) {
      pairs.push([a, "X"]);
      i += 1;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }

  return pairs;
}

function shiftWrap(n, delta) {
  return (n + delta + 5) % 5;
}

function encPair(a, b, pos, square) {
  const pa = pos.get(a);
  const pb = pos.get(b);

  // Same row
  if (pa.r === pb.r) {
    return [
      square[pa.r][shiftWrap(pa.c, 1)],
      square[pb.r][shiftWrap(pb.c, 1)],
    ];
  }

  // Same column
  if (pa.c === pb.c) {
    return [
      square[shiftWrap(pa.r, 1)][pa.c],
      square[shiftWrap(pb.r, 1)][pb.c],
    ];
  }

  // Rectangle
  return [square[pa.r][pb.c], square[pb.r][pa.c]];
}

function decPair(a, b, pos, square) {
  const pa = pos.get(a);
  const pb = pos.get(b);

  // Same row
  if (pa.r === pb.r) {
    return [
      square[pa.r][shiftWrap(pa.c, -1)],
      square[pb.r][shiftWrap(pb.c, -1)],
    ];
  }

  // Same column
  if (pa.c === pb.c) {
    return [
      square[shiftWrap(pa.r, -1)][pa.c],
      square[shiftWrap(pb.r, -1)][pb.c],
    ];
  }

  // Rectangle
  return [square[pa.r][pb.c], square[pb.r][pa.c]];
}

export function playfairEncrypt(plaintext, key) {
  const { square, pos } = buildKeySquare(key);
  const pairs = makeDigraphs(plaintext);

  const out = [];
  for (const [a, b] of pairs) {
    const [x, y] = encPair(a, b, pos, square);
    out.push(x, y);
  }
  return out.join("");
}

export function playfairDecrypt(ciphertext, key) {
  const { square, pos } = buildKeySquare(key);
  const ct = cleanLetters(ciphertext);

  // ciphertext should be even; if odd, we'll treat last as X-padded
  const out = [];
  for (let i = 0; i < ct.length; i += 2) {
    const a = ct[i];
    const b = ct[i + 1] || "X";
    const [x, y] = decPair(a, b, pos, square);
    out.push(x, y);
  }
  return out.join("");
}

export function buildKeySquareText(key) {
  const { square } = buildKeySquare(key);
  return square.map((row) => row.join(" ")).join("\n");
}
