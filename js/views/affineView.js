// js/views/affineView.js
import { affineDecrypt, affineEncrypt, isValidAffineA } from "../ciphers/affine.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderAffine(root) {
  renderCipherUI(root, {
    title: "Affine Cipher",
    description:
      "A substitution cipher based on modular arithmetic: E(x) = (a·x + b) mod 26. The value of 'a' must be coprime with 26.",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." },
      { id: "a", label: "Key a (must be coprime with 26)", type: "number", default: 5, min: 1, max: 25 },
      { id: "b", label: "Key b (shift)", type: "number", default: 8, min: 0, max: 25 }
    ],

    validate: ({ text, a, b }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };

      const A = Number(a);
      const B = Number(b);

      if (!Number.isInteger(A)) return { ok: false, message: "Key 'a' must be an integer." };
      if (A < 1 || A > 25) return { ok: false, message: "Key 'a' must be between 1 and 25." };

      // Important rule for Affine
      if (!isValidAffineA(A)) {
        return { ok: false, message: "Invalid 'a'. Choose a value coprime with 26 (e.g., 1,3,5,7,9,11,15,17,19,21,23,25)." };
      }

      if (!Number.isInteger(B)) return { ok: false, message: "Key 'b' must be an integer." };
      if (B < 0 || B > 25) return { ok: false, message: "Key 'b' must be between 0 and 25." };

      return { ok: true };
    },

    onEncrypt: ({ text, a, b }) => affineEncrypt(text, Number(a), Number(b)),
    onDecrypt: ({ text, a, b }) => affineDecrypt(text, Number(a), Number(b))
  });
}
