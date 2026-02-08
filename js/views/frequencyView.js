// js/views/frequencyView.js

export function renderFrequency(root) {
  root.innerHTML = `
    <section class="card">
      <h2>Frequency Analysis (A–Z)</h2>
      <p>
        Frequency analysis is a classic cryptanalysis technique. Paste text (plain or cipher)
        to view letter distribution.
      </p>

      <label>Input Text</label>
      <textarea id="text" rows="4" placeholder="Paste text here..."></textarea>

      <div class="row">
        <button id="analyzeBtn" class="btn">Analyze</button>
        <button id="clearBtn" class="btn btn-secondary" type="button">Clear</button>
      </div>

      <p id="summary" class="muted"></p>
      <p id="errorBox" class="error hidden"></p>
    </section>

    <section class="card">
      <h3>Chart</h3>
      <canvas id="chart" width="900" height="320" class="chart"></canvas>
    </section>

    <section class="card">
      <h3>Table</h3>
      <div class="table-wrap">
        <table class="freq-table">
          <thead>
            <tr>
              <th>Letter</th>
              <th>Count</th>
              <th>Percent</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  const $ = (sel) => root.querySelector(sel);
  const textEl = $("#text");
  const analyzeBtn = $("#analyzeBtn");
  const clearBtn = $("#clearBtn");
  const errorBox = $("#errorBox");
  const summary = $("#summary");
  const canvas = $("#chart");
  const tbody = $("#tbody");
  const ctx = canvas.getContext("2d");

  function setError(msg) {
    if (!msg) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    } else {
      errorBox.textContent = msg;
      errorBox.classList.remove("hidden");
    }
  }

  function analyze() {
    const text = textEl.value;
    if (!text.trim()) {
      setError("Please enter text first.");
      summary.textContent = "";
      tbody.innerHTML = "";
      clearCanvas(ctx, canvas);
      return;
    }

    const { counts, totalLetters } = countLetters(text);
    if (totalLetters === 0) {
      setError("No letters (A–Z) found in the input.");
      summary.textContent = "";
      tbody.innerHTML = "";
      clearCanvas(ctx, canvas);
      return;
    }

    setError(null);

    // Build data
    const labels = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const values = labels.map((L) => counts[L] || 0);

    // Summary
    summary.textContent = `Total letters counted: ${totalLetters}`;

    // Table
    tbody.innerHTML = labels
      .map((L) => {
        const c = counts[L] || 0;
        const pct = ((c / totalLetters) * 100).toFixed(2);
        return `
          <tr>
            <td><b>${L}</b></td>
            <td>${c}</td>
            <td>${pct}%</td>
          </tr>
        `;
      })
      .join("");

    // Draw chart
    drawBarChart(ctx, canvas, labels, values, totalLetters);
  }

  analyzeBtn.addEventListener("click", analyze);
  clearBtn.addEventListener("click", () => {
    textEl.value = "";
    setError(null);
    summary.textContent = "";
    tbody.innerHTML = "";
    clearCanvas(ctx, canvas);
  });

  // initial blank
  clearCanvas(ctx, canvas);
}

function countLetters(text) {
  const counts = {};
  let total = 0;

  for (const ch of String(text).toUpperCase()) {
    if (ch >= "A" && ch <= "Z") {
      counts[ch] = (counts[ch] || 0) + 1;
      total++;
    }
  }

  return { counts, totalLetters: total };
}

function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // subtle border
  ctx.save();
  ctx.strokeStyle = "#ddd";
  ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
  ctx.restore();
}

function drawBarChart(ctx, canvas, labels, values, totalLetters) {
  clearCanvas(ctx, canvas);

  const W = canvas.width;
  const H = canvas.height;

  // Padding
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 40;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...values, 1);
  const barCount = values.length;
  const gap = 6;
  const barW = (chartW - gap * (barCount - 1)) / barCount;

  // Axes
  ctx.save();
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + chartH);
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.stroke();
  ctx.restore();

  // Bars + labels
  ctx.font = "12px system-ui, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  for (let i = 0; i < barCount; i++) {
    const v = values[i];
    const x = padL + i * (barW + gap);
    const h = (v / maxVal) * chartH;
    const y = padT + (chartH - h);

    // Bar (default canvas color)
    ctx.save();
    ctx.fillStyle = "#4a90e2"; // if you want to avoid fixed colors, remove and use default; but this is fine for UI
    ctx.fillRect(x, y, barW, h);
    ctx.restore();

    // Letter label
    ctx.fillStyle = "#333";
    ctx.fillText(labels[i], x + barW / 2, padT + chartH + 8);
  }

  // Title (top-left)
  ctx.save();
  ctx.fillStyle = "#333";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`A–Z Frequency (Total letters: ${totalLetters})`, padL, 4);
  ctx.restore();
}
