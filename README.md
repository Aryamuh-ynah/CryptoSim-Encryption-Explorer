# 🔐 CryptoSim – Encryption Explorer

CryptoSim is an interactive, browser-based web application for **learning, experimenting with, and analyzing classical cryptographic algorithms**.  
The project is fully client-side, lightweight, and designed with a modern UI/UX, making it ideal for **education, demonstrations, and portfolio use**.

---

## 🌐 Live Demo

https://https://aryamuh-ynah.github.io/CryptoSim-Encryption-Explorer/index.html

---

## 📌 Features

### 🔒 Classical Encryption Algorithms

- Caesar Cipher
- Vigenère Cipher
- Atbash Cipher
- Rail Fence Cipher
- Columnar Transposition Cipher
- Affine Cipher
- Playfair Cipher

Each cipher supports:

- Encryption & Decryption
- Input validation
- Copy output functionality
- Clean, reusable UI components

---

### ⚖️ Compare Mode

- Run multiple ciphers on the same input
- View outputs side-by-side
- Filter and select specific ciphers
- Copy individual outputs or all results at once
- Execution time (ms) shown for each cipher

---

### 🧪 Cryptanalysis Tools

**Caesar Cipher Brute Force Attack**

- Automatically tests all 26 shifts
- Ranks results using English-likelihood scoring
- Helps demonstrate basic cryptanalysis techniques

**Frequency Analysis**

- Letter frequency analysis (A–Z)
- Bar chart visualization using Canvas
- Frequency table with counts and percentages

---

### 🎨 UI / UX

- Modern dashboard-style home page
- Card-based layout with hover effects
- Responsive design (mobile & desktop)
- Dark / Light mode with animated icon toggle 🌙☀️
- Theme preference saved using `localStorage`
- Active navigation highlighting

---

## 🛠️ Tech Stack

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES Modules)
- Canvas API (for charts)
- GitHub Pages (deployment)

✔ No backend  
✔ No frameworks  
✔ No external libraries

---

## 📁 Project Structure

```md
CryptoSim/
├── index.html
├── css/
│ └── style.css
├── js/
│ ├── app.js
│ ├── router.js
│ ├── theme.js
│ ├── navActive.js
│ ├── components/
│ │ └── cipherUI.js
│ ├── ciphers/
│ │ ├── caesar.js
│ │ ├── vigenere.js
│ │ ├── atbash.js
│ │ ├── railFence.js
│ │ ├── affine.js
│ │ ├── transposition.js
│ │ └── playfair.js
│ └── views/
│ ├── home.js
│ ├── compareView.js
│ ├── caesarAttackView.js
│ └── frequencyView.js
└── README.md
```

---

## 🚀 Getting Started

### Clone the Repository

```md
git clone https://github.com/Aryamuh-ynah/CryptoSim-Encryption-Explorer.git
```

### Open the Project

```md
cd CryptoSim-Encryption-Explorer
```

### Run Locally

- Open `index.html` directly in your browser

---

## 🎯 Learning Outcomes

This project demonstrates:

- Understanding of classical cryptography
- JavaScript SPA routing and modular architecture
- Client-side cryptanalysis concepts
- UI/UX design principles
- Clean, maintainable front-end code

---

## 📌 Future Improvements

- Rail Fence visualization animation
- Frequency comparison (plaintext vs ciphertext)
- Step-by-step cipher explanations
- Export results (TXT / PDF)
- Accessibility improvements (ARIA, keyboard support)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Humayra Afia Hany**  
🔗 **GitHub:** [Aryamuh-ynah](https://github.com/Aryamuh-ynah)  
🔗 **LinkedIn:** [Humayra Afia Hany](https://www.linkedin.com/in/humayra-afia-hany-888baa25a)
