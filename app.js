// ===== MENU =====
const menu = {
  softs: [
    { name: "Eau plate", price: 1.5 },
    { name: "Eau pétillante", price: 1.5 },
    { name: "Coca", price: 2 },
    { name: "Coca zéro", price: 2 },
    { name: "Fanta", price: 2 },
    { name: "Café", price: 2 },
  ],

  apero: [{ name: "Apéro", price: 3.5 }],

  bieres: [
    { name: "Pils", price: 2 },
    { name: "Pils NA", price: 2 },
    { name: "Blanche", price: 2.5 },
    { name: "Blanche rosé", price: 2.5 },
    { name: "Kriek", price: 2.5 },
    { name: "Trolls", price: 3 },
    { name: "Leffe", price: 3 },
    { name: "Quintine", price: 4 },
    { name: "Moinette verre", price: 3.5 },
    { name: "Moinette bouteille", price: 9 },
    { name: "Saison bio verre", price: 3 },
    { name: "Saison bio bouteille", price: 8 },
  ],

  vins: [
    { name: "Rouge (verre)", price: 2.5 },
    { name: "Blanc (verre)", price: 2.5 },
    { name: "Rosé (verre)", price: 2.5 },
    { name: "Rouge (bouteille)", price: 14 },
    { name: "Blanc (bouteille)", price: 14 },
    { name: "Rosé (bouteille)", price: 14 },
  ],

  snacks: [
    { name: "Pain saucisse", price: 4 },
    { name: "Hamburger", price: 3 },
    { name: "Croque", price: 3 },
    { name: "Chips", price: 1 },
    { name: "Cornet de glace", price: 2 },
  ],
};

// ===== ÉTAT =====
let current = "softs";
let cart = {};
let orderNumber = 1;

let totalDay = 0;
let totalOrders = 0;
let productStats = {};

// ===== LOAD LOCAL STORAGE =====
if (localStorage.getItem("totalDay")) {
  totalDay = parseFloat(localStorage.getItem("totalDay"));
}
if (localStorage.getItem("totalOrders")) {
  totalOrders = parseInt(localStorage.getItem("totalOrders"));
}
if (localStorage.getItem("productStats")) {
  productStats = JSON.parse(localStorage.getItem("productStats"));
}

// ===== MENU =====
function setCategory(cat) {
  current = cat;
  renderMenu();
}

function renderMenu() {
  const container = document.getElementById("items");
  container.innerHTML = "";

  menu[current].forEach(item => {
    const btn = document.createElement("button");
    btn.innerText = item.name.toUpperCase() + "\n" + item.price + "€";
    btn.onclick = () => addItem(item);
    container.appendChild(btn);
  });
}

// ===== PANIER =====
function addItem(item) {
  if (!cart[item.name]) {
    cart[item.name] = { ...item, qty: 1 };
  } else {
    cart[item.name].qty++;
  }
  renderCart();
}

function removeItem(name) {
  if (!cart[name]) return;

  if (cart[name].qty > 1) {
    cart[name].qty--;
  } else {
    delete cart[name];
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart");
  container.innerHTML = "";

  let total = 0;

  Object.values(cart).forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.innerHTML = `
      ${item.name} x${item.qty}
      <div>
        <button onclick="addItem(${JSON.stringify(item)})">+</button>
        <button onclick="removeItem('${item.name}')">-</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById("total").innerText = `Total: ${total.toFixed(2)}€`;
}

// ===== PAIEMENT =====
function pay() {

  if (Object.keys(cart).length === 0) {
    alert("Panier vide !");
    return;
  }

  let total = 0;
  let boissons = [];
  let snacks = [];

  Object.values(cart).forEach(item => {
    const name = item.name.toLowerCase();

    if (
      name.includes("pils") ||
      name.includes("blanche") ||
      name.includes("kriek") ||
      name.includes("troll") ||
      name.includes("leffe") ||
      name.includes("quintine") ||
      name.includes("moinette") ||
      name.includes("saison") ||
      name.includes("vin") ||
      name.includes("rouge") ||
      name.includes("blanc") ||
      name.includes("rosé") ||
      name.includes("apéro") ||
      name.includes("coca") ||
      name.includes("fanta") ||
      name.includes("eau") ||
      name.includes("café")
    ) {
      boissons.push(item);
    } else {
      snacks.push(item);
    }

    total += item.price * item.qty;

    if (!productStats[item.name]) {
      productStats[item.name] = 0;
    }
    productStats[item.name] += item.qty;
  });

  totalDay += total;
  totalOrders++;

  // ===== SAVE =====
  localStorage.setItem("totalDay", totalDay);
  localStorage.setItem("totalOrders", totalOrders);
  localStorage.setItem("productStats", JSON.stringify(productStats));

  // ===== TICKET =====
  let content = `
    <div style="text-align:center;">
      <div style="font-size:20px;font-weight:bold;">LES FOURMIS</div>
      <div style="font-size:18px;">BOUGENT !</div>
      <br>
      <div>COMMANDE #${orderNumber}</div>
    </div>
    <hr>
  `;

  if (boissons.length > 0) {
    content += "<b>BOISSONS</b><br><br>";
    boissons.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}<br><br>`;
    });
  }

  if (snacks.length > 0) {
    content += "<hr><b>SNACKS</b><br><br>";
    snacks.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}<br><br>`;
    });
  }

  content += `<hr><b>TOTAL: ${total.toFixed(2)}€</b><br><br>`;
  content += `<div style="text-align:center;">MERCI !</div>`;

  // ===== PRINT =====
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = "-10000px";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
    <head>
    <style>
    @page { size: 80mm auto; margin: 0; }
    body {
      width: 80mm;
      margin: 0;
      font-family: monospace;
      font-size: 14px;
    }
    </style>
    </head>
    <body>${content}</body>
    </html>
  `);
  doc.close();

  iframe.onload = function () {
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  orderNumber++;
  cart = {};
  renderCart();
}

// ===== STATS (MOBILE OK) =====
function showStats() {

  let html = `
    <p><b>Total jour:</b> ${totalDay.toFixed(2)}€</p>
    <p><b>Commandes:</b> ${totalOrders}</p>
    <hr>
  `;

  for (let product in productStats) {
    html += `${product} : ${productStats[product]}<br>`;
  }

  document.getElementById("statsContent").innerHTML = html;
  document.getElementById("statsBox").style.display = "block";
}

// ===== EXPORT =====
function exportStats() {

  let text = `TOTAL: ${totalDay.toFixed(2)}€\nCOMMANDES: ${totalOrders}\n\n`;

  for (let product in productStats) {
    text += `${product}: ${productStats[product]}\n`;
  }

  navigator.clipboard.writeText(text);
  alert("Stats copiées !");
}

// ===== RESET =====
function resetDay() {
  if (confirm("Remettre à zéro ?")) {
    localStorage.clear();
    totalDay = 0;
    totalOrders = 0;
    productStats = {};
    alert("Remise à zéro OK");
  }
}

// ===== CLOSE STATS =====
function closeStats() {
  document.getElementById("statsBox").style.display = "none";
}

// ===== START =====
renderMenu();
