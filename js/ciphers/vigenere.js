// js/ciphers/vigenere.js

function isLetter(ch) {
  const code = ch.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function shiftLetter(ch, shift) {
  const code = ch.charCodeAt(0);

  // Uppercase
  if (code >= 65 && code <= 90) {
    const offset = code - 65;
    return String.fromCharCode(((offset + shift) % 26 + 26) % 26 + 65);
  }

  // Lowercase
  if (code >= 97 && code <= 122) {
    const offset = code - 97;
    return String.fromCharCode(((offset + shift) % 26 + 26) % 26 + 97);
  }

  return ch;
}

function normalizeKey(key) {
  const onlyLetters = [...key].filter(isLetter).join("");
  return onlyLetters;
}

export function vigenereEncrypt(text, key) {
  const k = normalizeKey(key);
  if (!k.length) return ""; // we will add validation soon

  let ki = 0;
  let out = "";

  for (const ch of text) {
    if (!isLetter(ch)) {
      out += ch;
      continue;
    }
    const kch = k[ki % k.length];
    const base = kch === kch.toUpperCase() ? 65 : 97;
    const shift = kch.charCodeAt(0) - base;

    out += shiftLetter(ch, shift);
    ki++;
  }

  return out;
}

export function vigenereDecrypt(text, key) {
  const k = normalizeKey(key);
  if (!k.length) return "";

  let ki = 0;
  let out = "";

  for (const ch of text) {
    if (!isLetter(ch)) {
      out += ch;
      continue;
    }
    const kch = k[ki % k.length];
    const base = kch === kch.toUpperCase() ? 65 : 97;
    const shift = kch.charCodeAt(0) - base;

    out += shiftLetter(ch, -shift);
    ki++;
  }

  return out;
}
