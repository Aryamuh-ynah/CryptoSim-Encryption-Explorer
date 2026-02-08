import { caesarDecrypt, caesarEncrypt } from "../ciphers/caesar.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderCaesar(root) {
  renderCipherUI(root, {
    title: "Caesar Cipher",
    description:
      "A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." },
      { id: "shift", label: "Shift Value", type: "number", default: 3, min: -25, max: 25 }
    ],

    validate: ({ text, shift }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };
      const s = Number(shift);
      if (Number.isNaN(s)) return { ok: false, message: "Shift must be a number." };
      if (s < -25 || s > 25) return { ok: false, message: "Shift must be between -25 and 25." };
      return { ok: true };
    },

    onEncrypt: ({ text, shift }) => caesarEncrypt(text, Number(shift)),
    onDecrypt: ({ text, shift }) => caesarDecrypt(text, Number(shift))
  });
}
