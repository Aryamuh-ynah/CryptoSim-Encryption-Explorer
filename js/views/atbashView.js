// js/views/atbashView.js
import { atbashTransform } from "../ciphers/atbash.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderAtbash(root) {
  renderCipherUI(root, {
    title: "Atbash Cipher",
    description:
      "A monoalphabetic substitution cipher that maps A↔Z, B↔Y, C↔X (same operation for encryption and decryption).",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." }
    ],

    validate: ({ text }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };
      return { ok: true };
    },

    onEncrypt: ({ text }) => atbashTransform(text),
    onDecrypt: ({ text }) => atbashTransform(text)
  });
}
