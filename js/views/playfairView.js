// js/views/playfairView.js
import {
    buildKeySquareText,
    playfairDecrypt,
    playfairEncrypt
} from "../ciphers/playfair.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderPlayfair(root) {
  renderCipherUI(root, {
    title: "Playfair Cipher",
    description:
      "A digraph substitution cipher using a 5×5 key square (I/J combined). It encrypts pairs of letters using row/column/rectangle rules.",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." },
      { id: "key", label: "Keyword", placeholder: "Enter a keyword (e.g., MONARCHY)", default: "MONARCHY" }
    ],

    validate: ({ text, key }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };
      if (!key.trim()) return { ok: false, message: "Please enter a keyword." };
      return { ok: true };
    },

    onEncrypt: ({ text, key }) => {
      const ct = playfairEncrypt(text, key);
      // Add key square preview below output (optional enhancement)
      return ct;
    },

    onDecrypt: ({ text, key }) => playfairDecrypt(text, key)
  });

  // Optional: show key square preview under output
  const keyInput = root.querySelector("#key");
  const outputBox = root.querySelector("#output");

  const preview = document.createElement("pre");
  preview.className = "keysquare";
  preview.style.marginTop = "12px";
  preview.textContent = "Key Square:\n" + buildKeySquareText(keyInput.value);
  outputBox.parentElement.appendChild(preview);

  keyInput.addEventListener("input", () => {
    preview.textContent = "Key Square:\n" + buildKeySquareText(keyInput.value);
  });
}
