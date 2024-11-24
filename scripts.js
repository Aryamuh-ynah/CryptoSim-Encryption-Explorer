// Utility functions
function mod(n, m) {
    return ((n % m) + m) % m;
  }
  
  // Caesar Cipher
  function caesarEncrypt(text, shift) {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((char.charCodeAt(0) - base + parseInt(shift)), 26) + base);
      }
      return char;
    }).join('');
  }
  
  function caesarDecrypt(text, shift) {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((char.charCodeAt(0) - base - parseInt(shift)), 26) + base);
      }
      return char;
    }).join('');
  }
  
  // Vigenère Cipher
  function vigenereEncrypt(text, key) {
    const keyStream = key.toLowerCase();
    let keyIndex = 0;
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        const keyShift = keyStream[keyIndex % keyStream.length].charCodeAt(0) - 97;
        keyIndex++;
        return String.fromCharCode(mod((char.charCodeAt(0) - base + keyShift), 26) + base);
      }
      return char;
    }).join('');
  }
  
  function vigenereDecrypt(text, key) {
    const keyStream = key.toLowerCase();
    let keyIndex = 0;
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        const keyShift = keyStream[keyIndex % keyStream.length].charCodeAt(0) - 97;
        keyIndex++;
        return String.fromCharCode(mod((char.charCodeAt(0) - base - keyShift), 26) + base);
      }
      return char;
    }).join('');
  }
  
  

  
  
  // Playfair Cipher Helpers
  function generatePlayfairTable(key) {
    const alphabet = 'abcdefghiklmnopqrstuvwxyz'; // Excludes 'j'
    const table = [];
    const seen = new Set();
    let currentRow = [];
    key = key.toLowerCase().replace(/j/g, 'i'); // Treat 'j' as 'i'
  
    // Add key characters to the table
    for (const char of key) {
      if (alphabet.includes(char) && !seen.has(char)) {
        currentRow.push(char);
        seen.add(char);
        if (currentRow.length === 5) {
          table.push(currentRow);
          currentRow = [];
        }
      }
    }
  
    // Add remaining alphabet characters
    for (const char of alphabet) {
      if (!seen.has(char)) {
        currentRow.push(char);
        seen.add(char);
        if (currentRow.length === 5) {
          table.push(currentRow);
          currentRow = [];
        }
      }
    }
  
    return table;
  }
  
  function playfairEncryptDecrypt(text, key, encrypt = true) {
    const table = generatePlayfairTable(key);
    text = text.toLowerCase().replace(/j/g, 'i').replace(/[^a-z]/g, ''); // Preprocess text
    const pairs = [];
    let i = 0;
  
    // Form pairs, inserting 'x' between repeating letters
    while (i < text.length) {
      const char1 = text[i];
      const char2 = text[i + 1] || 'x';
      if (char1 === char2) {
        pairs.push([char1, 'x']);
        i++;
      } else {
        pairs.push([char1, char2]);
        i += 2;
      }
    }
  
    const result = pairs.map(pair => {
      const [row1, col1] = findPosition(pair[0], table);
      const [row2, col2] = findPosition(pair[1], table);
  
      if (row1 === row2) {
        // Same row
        return table[row1][mod(col1 + (encrypt ? 1 : -1), 5)] +
               table[row2][mod(col2 + (encrypt ? 1 : -1), 5)];
      } else if (col1 === col2) {
        // Same column
        return table[mod(row1 + (encrypt ? 1 : -1), 5)][col1] +
               table[mod(row2 + (encrypt ? 1 : -1), 5)][col2];
      } else {
        // Rectangle swap
        return table[row1][col2] + table[row2][col1];
      }
    });
  
    return result.join('');
  }
  
  function findPosition(char, table) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (table[row][col] === char) return [row, col];
      }
    }
    return null;
  }
  
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  
  // Transposition Cipher
  function transpositionEncrypt(text, key) {
    const keyOrder = key.split('').map((_, i) => i).sort((a, b) => key[a].localeCompare(key[b]));
    const numRows = Math.ceil(text.length / key.length);
    const grid = Array.from({ length: numRows }, () => Array(key.length).fill(''));
  
    // Fill the grid row by row
    let index = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < key.length; col++) {
        if (index < text.length) {
          grid[row][col] = text[index++];
        }
      }
    }
  
    // Read columns based on key order
    let ciphertext = '';
    for (const col of keyOrder) {
      for (let row = 0; row < numRows; row++) {
        ciphertext += grid[row][col] || '';
      }
    }
  
    return ciphertext;
  }
  
  function transpositionDecrypt(text, key) {
    const keyOrder = key.split('').map((_, i) => i).sort((a, b) => key[a].localeCompare(key[b]));
    const numRows = Math.ceil(text.length / key.length);
    const numCols = key.length;
    const numExtraCells = numRows * numCols - text.length;
  
    const grid = Array.from({ length: numCols }, () => []);
    let index = 0;
  
    // Fill the columns based on key order
    for (const col of keyOrder) {
      const colLength = numRows - (col >= numCols - numExtraCells ? 1 : 0);
      for (let row = 0; row < colLength; row++) {
        grid[col][row] = text[index++];
      }
    }
  
    // Read rows to reconstruct the plaintext
    let plaintext = '';
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (grid[col][row]) plaintext += grid[col][row];
      }
    }
  
    return plaintext;
  }
  
  // Affine Cipher
  function affineEncrypt(text, a, b) {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((a * (char.charCodeAt(0) - base) + b), 26) + base);
      }
      return char;
    }).join('');
  }
  
  function affineDecrypt(text, a, b) {
    const aInverse = modInverse(a, 26);
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((aInverse * (char.charCodeAt(0) - base - b)), 26) + base);
      }
      return char;
    }).join('');
  }
  
  function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
      if ((a * i) % m === 1) return i;
    }
    return 1;
  }
  // Atbash Cipher Function
function atbashCipher(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const reversedAlphabet = alphabet.split('').reverse().join('');
  
  return input
    .toUpperCase()
    .split('')
    .map(char => {
      const index = alphabet.indexOf(char);
      return index !== -1 ? reversedAlphabet[index] : char; // Non-alphabetic characters remain unchanged
    })
    .join('');
}

// Rail Fence Cipher Functions
function railFenceEncrypt(input, numRails) {
  if (numRails <= 1 || !input) return input;

  const rails = Array.from({ length: numRails }, () => []);
  let directionDown = false;
  let row = 0;

  for (let char of input) {
    rails[row].push(char);
    if (row === 0 || row === numRails - 1) directionDown = !directionDown;
    row += directionDown ? 1 : -1;
  }

  return rails.flat().join('');
}

function railFenceDecrypt(ciphertext, numRails) {
  if (numRails <= 1 || !ciphertext) return ciphertext;

  const railLengths = Array(numRails).fill(0);
  let directionDown = false;
  let row = 0;

  for (let i = 0; i < ciphertext.length; i++) {
    railLengths[row]++;
    if (row === 0 || row === numRails - 1) directionDown = !directionDown;
    row += directionDown ? 1 : -1;
  }

  const rails = railLengths.map(len => ciphertext.slice(0, len).split(''));
  ciphertext = ciphertext.slice(railLengths.reduce((a, b) => a + b, 0));
  directionDown = false;
  row = 0;

  const plaintext = [];
  for (let i = 0; i < ciphertext.length; i++) {
    plaintext.push(rails[row].shift());
    if (row === 0 || row === numRails - 1) directionDown = !directionDown;
    row += directionDown ? 1 : -1;
  }

  return plaintext.join('');
}
