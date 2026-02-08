import { vigenereDecrypt, vigenereEncrypt } from "../ciphers/vigenere.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderVigenere(root) {
  renderCipherUI(root, {
    title: "Vigenère Cipher",
    description:
      "A polyalphabetic substitution cipher that uses a keyword to apply different shifts to each letter.",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." },
      { id: "key", label: "Keyword", placeholder: "Enter keyword (letters recommended)", default: "KEY" }
    ],

    validate: ({ text, key }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };
      if (!key.trim()) return { ok: false, message: "Please enter a keyword." };
      // optional: enforce letters only
      if (!/^[a-zA-Z]+$/.test(key.trim())) {
        return { ok: false, message: "Keyword should contain only letters (A–Z)." };
      }
      return { ok: true };
    },

    onEncrypt: ({ text, key }) => vigenereEncrypt(text, key),
    onDecrypt: ({ text, key }) => vigenereDecrypt(text, key)
  });
}
