// js/ciphers/affine.js

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

// Extended Euclid to find modular inverse
function modInverse(a, m) {
  a = ((a % m) + m) % m;

  let t = 0, newT = 1;
  let r = m, newR = a;

  while (newR !== 0) {
    const q = Math.floor(r / newR);
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }

  if (r !== 1) return null; // no inverse if gcd(a, m) != 1
  if (t < 0) t += m;
  return t;
}

function affineChar(ch, a, b) {
  const code = ch.charCodeAt(0);

  // Uppercase A-Z
  if (code >= 65 && code <= 90) {
    const x = code - 65;
    const y = (a * x + b) % 26;
    return String.fromCharCode(y + 65);
  }

  // Lowercase a-z
  if (code >= 97 && code <= 122) {
    const x = code - 97;
    const y = (a * x + b) % 26;
    return String.fromCharCode(y + 97);
  }

  return ch; // keep punctuation/spaces
}

function affineCharDecrypt(ch, aInv, b) {
  const code = ch.charCodeAt(0);

  // Uppercase
  if (code >= 65 && code <= 90) {
    const y = code - 65;
    const x = (aInv * (y - b)) % 26;
    return String.fromCharCode(((x + 26) % 26) + 65);
  }

  // Lowercase
  if (code >= 97 && code <= 122) {
    const y = code - 97;
    const x = (aInv * (y - b)) % 26;
    return String.fromCharCode(((x + 26) % 26) + 97);
  }

  return ch;
}

export function affineEncrypt(text, a, b) {
  const A = Number(a);
  const B = Number(b);
  return [...text].map((ch) => affineChar(ch, A, ((B % 26) + 26) % 26)).join("");
}

export function affineDecrypt(text, a, b) {
  const A = Number(a);
  const B = ((Number(b) % 26) + 26) % 26;
  const inv = modInverse(A, 26);
  if (inv === null) return ""; // validation should prevent this
  return [...text].map((ch) => affineCharDecrypt(ch, inv, B)).join("");
}

export function isValidAffineA(a) {
  const A = Number(a);
  return Number.isInteger(A) && gcd(A, 26) === 1;
}
