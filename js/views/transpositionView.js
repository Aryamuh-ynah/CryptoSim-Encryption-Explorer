// js/views/transpositionView.js
import { columnarDecrypt, columnarEncrypt } from "../ciphers/transposition.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderTransposition(root) {
  renderCipherUI(root, {
    title: "Columnar Transposition Cipher",
    description:
      "A transposition cipher that rearranges characters by writing them into columns based on a keyword and reading columns in sorted keyword order.",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." },
      { id: "key", label: "Keyword", placeholder: "Enter a keyword (e.g., ZEBRA)", default: "ZEBRA" }
    ],

    validate: ({ text, key }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };
      if (!key.trim()) return { ok: false, message: "Please enter a keyword." };
      if (key.trim().length < 2) return { ok: false, message: "Keyword should be at least 2 characters." };
      return { ok: true };
    },

    onEncrypt: ({ text, key }) => columnarEncrypt(text, key.trim()),
    onDecrypt: ({ text, key }) => columnarDecrypt(text, key.trim())
  });
}
