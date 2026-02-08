// js/views/railFenceView.js
import { railFenceDecrypt, railFenceEncrypt } from "../ciphers/railFence.js";
import { renderCipherUI } from "../components/cipherUI.js";

export function renderRailFence(root) {
  renderCipherUI(root, {
    title: "Rail Fence Cipher",
    description:
      "A transposition cipher that writes the message in a zig-zag pattern across multiple rails, then reads row by row.",

    inputs: [
      { id: "text", label: "Input Text", placeholder: "Enter text..." },
      { id: "rails", label: "Number of Rails", type: "number", default: 3, min: 2, max: 20 }
    ],

    validate: ({ text, rails }) => {
      if (!text.trim()) return { ok: false, message: "Please enter input text." };
      const r = Number(rails);
      if (!Number.isInteger(r)) return { ok: false, message: "Rails must be an integer." };
      if (r < 2 || r > 20) return { ok: false, message: "Rails must be between 2 and 20." };
      return { ok: true };
    },

    onEncrypt: ({ text, rails }) => railFenceEncrypt(text, Number(rails)),
    onDecrypt: ({ text, rails }) => railFenceDecrypt(text, Number(rails))
  });
}
