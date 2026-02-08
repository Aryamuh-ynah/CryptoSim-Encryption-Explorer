// js/components/cipherUI.js

export function renderCipherUI(root, config) {
  const {
    title,
    description = "",
    inputs = [],
    onEncrypt,
    onDecrypt,
    validate, // optional: function(values) => { ok: boolean, message?: string }
  } = config;

  root.innerHTML = `
    <section class="card">
      <h2>${escapeHtml(title)}</h2>
      ${description ? `<p>${escapeHtml(description)}</p>` : ""}

      <div class="form">
        ${inputs.map((input) => renderInput(input)).join("")}

        <p id="errorBox" class="error hidden"></p>

        <div class="row">
          <button id="encryptBtn" class="btn">Encrypt</button>
          <button id="decryptBtn" class="btn">Decrypt</button>
          <button id="clearBtn" class="btn btn-secondary" type="button">Clear</button>
          <button id="copyBtn" class="btn btn-secondary" type="button">Copy Output</button>
        </div>

        <label>Output</label>
        <textarea id="output" rows="4" readonly></textarea>
      </div>
    </section>
  `;

  const output = root.querySelector("#output");
  const errorBox = root.querySelector("#errorBox");
  const encryptBtn = root.querySelector("#encryptBtn");
  const decryptBtn = root.querySelector("#decryptBtn");
  const clearBtn = root.querySelector("#clearBtn");
  const copyBtn = root.querySelector("#copyBtn");

  // Attach live validation to inputs
  inputs.forEach((input) => {
    const el = root.querySelector(`#${cssEscape(input.id)}`);
    if (!el) return;
    el.addEventListener("input", () => {
      const res = runValidation(inputs, validate);
      setError(errorBox, res);
      setButtonsEnabled(encryptBtn, decryptBtn, res.ok);
    });
  });

  // Initial validation state
  const initial = runValidation(inputs, validate);
  setError(errorBox, initial);
  setButtonsEnabled(encryptBtn, decryptBtn, initial.ok);

  encryptBtn.onclick = () => {
    const res = runValidation(inputs, validate);
    setError(errorBox, res);
    if (!res.ok) return;

    const values = getValues(root, inputs);
    output.value = String(onEncrypt(values) ?? "");
  };

  decryptBtn.onclick = () => {
    const res = runValidation(inputs, validate);
    setError(errorBox, res);
    if (!res.ok) return;

    const values = getValues(root, inputs);
    output.value = String(onDecrypt(values) ?? "");
  };

  clearBtn.onclick = () => {
    inputs.forEach((input) => {
      const el = root.querySelector(`#${cssEscape(input.id)}`);
      if (!el) return;
      if (input.type === "number") {
        el.value = input.default ?? "";
      } else {
        el.value = input.default ?? "";
      }
    });
    output.value = "";
    const res = runValidation(inputs, validate);
    setError(errorBox, res);
    setButtonsEnabled(encryptBtn, decryptBtn, res.ok);
  };

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(output.value || "");
      // Quick feedback
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = old), 800);
    } catch (e) {
      // Fallback if clipboard is blocked
      output.focus();
      output.select();
      document.execCommand("copy");
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = old), 800);
    }
  };
}

function renderInput(input) {
  const {
    id,
    label,
    type = "text",
    placeholder = "",
    default: def = "",
    min,
    max,
    step,
  } = input;

  const attrs = [
    `id="${escapeHtml(id)}"`,
    `type="${escapeHtml(type)}"`,
    placeholder ? `placeholder="${escapeHtml(placeholder)}"` : "",
    def !== "" ? `value="${escapeHtml(String(def))}"` : "",
    min != null ? `min="${escapeHtml(String(min))}"` : "",
    max != null ? `max="${escapeHtml(String(max))}"` : "",
    step != null ? `step="${escapeHtml(String(step))}"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <label for="${escapeHtml(id)}">${escapeHtml(label)}</label>
    <input ${attrs} />
  `;
}

function getValues(root, inputs) {
  const values = {};
  inputs.forEach((input) => {
    const el = root.querySelector(`#${cssEscape(input.id)}`);
    values[input.id] = el ? el.value : "";
  });
  return values;
}

function runValidation(inputs, customValidate) {
  const values = {};
  inputs.forEach((i) => (values[i.id] = document.getElementById(i.id)?.value ?? ""));

  // Basic default validation: require first input (usually "text")
  const first = inputs[0]?.id;
  if (first && !String(values[first]).trim()) {
    return { ok: false, message: "Please enter input text." };
  }

  if (typeof customValidate === "function") {
    return customValidate(values);
  }

  return { ok: true };
}

function setError(errorBox, res) {
  if (!res.ok) {
    errorBox.textContent = res.message || "Invalid input.";
    errorBox.classList.remove("hidden");
  } else {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }
}

function setButtonsEnabled(encBtn, decBtn, enabled) {
  encBtn.disabled = !enabled;
  decBtn.disabled = !enabled;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Escape IDs safely for querySelector
function cssEscape(id) {
  // Simple escape for common ids
  return id.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1");
}
