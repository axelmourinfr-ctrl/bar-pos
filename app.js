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

let totalDay = 0;
let totalOrders = 0;
let productStats = {};
let totalCash = 0;
let totalCard = 0;

// ===== LOAD =====
const saved = localStorage.getItem("barData");

if (saved) {
  const data = JSON.parse(saved);
  totalDay = data.totalDay || 0;
  totalOrders = data.totalOrders || 0;
  productStats = data.productStats || {};
  totalCash = data.totalCash || 0;
  totalCard = data.totalCard || 0;
}

// ===== SAVE =====
function saveData() {
  localStorage.setItem("barData", JSON.stringify({
    totalDay,
    totalOrders,
    productStats,
    totalCash,
    totalCard
  }));
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
    btn.innerText = item.name + "\n" + item.price + "€";
    btn.onclick = () => addItem(item);
    container.appendChild(btn);
  });
}

// ===== PANIER =====
function addItem(item) {
  if (!cart[item.name]) cart[item.name] = { ...item, qty: 1 };
  else cart[item.name].qty++;
  renderCart();
}

function addItemByName(name) {
  for (let cat in menu) {
    let found = menu[cat].find(i => i.name === name);
    if (found) return addItem(found);
  }
}

function removeItem(name) {
  if (cart[name].qty > 1) cart[name].qty--;
  else delete cart[name];
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
        <button onclick="addItemByName('${item.name}')">+</button>
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
  document.getElementById("paymentBox").style.display = "block";
}

function choosePayment(mode) {

  let total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);

  if (mode === "cash") {
    document.getElementById("cashBox").style.display = "block";
    document.getElementById("amountDue").innerText = total.toFixed(2);
  } else {
    totalCard += total;
    finalizeSale(total);
  }
}

function validateCash() {

  let total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  let received = parseFloat(document.getElementById("cashInput").value);

  if (isNaN(received) || received < total) {
    alert("Montant incorrect");
    return;
  }

  let change = received - total;
  alert("Rendu : " + change.toFixed(2) + "€");

  totalCash += total;

  finalizeSale(total);
}

// ===== FINAL =====
function finalizeSale(total) {

  Object.values(cart).forEach(item => {
    if (!productStats[item.name]) productStats[item.name] = 0;
    productStats[item.name] += item.qty;
  });

  totalDay += total;
  totalOrders++;

  saveData(); // 🔥 important

  printTicket(total);

  cart = {};
  renderCart();

  document.getElementById("paymentBox").style.display = "none";
  document.getElementById("cashBox").style.display = "none";
}

// ===== TICKET =====
function printTicket(total) {

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
  });

  let content = `
    <div style="padding:10px;font-family:monospace;">

      <div style="text-align:center;">
        <img src="logo.png" style="width:120px;margin-bottom:10px;">
      </div>

      <div style="text-align:center;">
        COMMANDE #${totalOrders}
      </div>

      <hr>
  `;

  if (boissons.length > 0) {
    content += `<b>BOISSONS</b><br><br>`;
    boissons.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}<br>`;
    });
    content += `<br><hr>`;
  }

  if (snacks.length > 0) {
    content += `<b>SNACKS</b><br><br>`;
    snacks.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}<br>`;
    });
    content += `<br><hr>`;
  }

  content += `
      <b>TOTAL: ${total.toFixed(2)}€</b>
      <br><br>
      <div style="text-align:center;">MERCI !</div>
    </div>
  `;

  let iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  let doc = iframe.contentWindow.document;
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
        img {
          filter: grayscale(100%) contrast(200%);
        }
      </style>
    </head>
    <body>${content}</body>
    </html>
  `);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
}

// ===== STATS =====
function showStats() {
  let html = `
    <p>Total: ${totalDay.toFixed(2)}€</p>
    <p>Commandes: ${totalOrders}</p>
    <p>Cash: ${totalCash.toFixed(2)}€</p>
    <p>Carte: ${totalCard.toFixed(2)}€</p>
    <hr>
  `;

  for (let p in productStats) {
    html += `${p}: ${productStats[p]}<br>`;
  }

  html += `
    <br>
    <button onclick="resetStats()">🔄 Reset</button>
  `;

  document.getElementById("statsContent").innerHTML = html;
  document.getElementById("statsBox").style.display = "block";
}

// ===== RESET =====
function resetStats() {
  if (confirm("Remettre à zéro les stats ?")) {
    localStorage.removeItem("barData");

    totalDay = 0;
    totalOrders = 0;
    productStats = {};
    totalCash = 0;
    totalCard = 0;

    alert("Stats réinitialisées");
    showStats();
  }
}

function closeStats() {
  document.getElementById("statsBox").style.display = "none";
}

// ===== START =====
renderMenu();
