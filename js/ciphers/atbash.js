// js/ciphers/atbash.js

function atbashChar(ch) {
  const code = ch.charCodeAt(0);

  // Uppercase A-Z
  if (code >= 65 && code <= 90) {
    const offset = code - 65;
    return String.fromCharCode(90 - offset);
  }

  // Lowercase a-z
  if (code >= 97 && code <= 122) {
    const offset = code - 97;
    return String.fromCharCode(122 - offset);
  }

  return ch; // keep spaces/symbols
}

export function atbashTransform(text) {
  return [...text].map(atbashChar).join("");
}
