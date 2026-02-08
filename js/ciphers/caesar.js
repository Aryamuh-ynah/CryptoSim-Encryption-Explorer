// js/ciphers/caesar.js
function shiftChar(ch, shift) {
  const A = 65, Z = 90;
  const a = 97, z = 122;

  const code = ch.charCodeAt(0);

  // Uppercase
  if (code >= A && code <= Z) {
    const offset = code - A;
    return String.fromCharCode(((offset + shift) % 26 + 26) % 26 + A);
  }

  // Lowercase
  if (code >= a && code <= z) {
    const offset = code - a;
    return String.fromCharCode(((offset + shift) % 26 + 26) % 26 + a);
  }

  return ch; // keep spaces/symbols
}

export function caesarEncrypt(text, shift) {
  return [...text].map((c) => shiftChar(c, shift)).join("");
}

export function caesarDecrypt(text, shift) {
  return [...text].map((c) => shiftChar(c, -shift)).join("");
}
