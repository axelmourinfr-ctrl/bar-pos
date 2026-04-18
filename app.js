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
let totalCash = 0;
let totalCard = 0;

// ===== LOAD =====
if (localStorage.getItem("data")) {
  const data = JSON.parse(localStorage.getItem("data"));
  totalDay = data.totalDay || 0;
  totalOrders = data.totalOrders || 0;
  productStats = data.productStats || {};
  totalCash = data.totalCash || 0;
  totalCard = data.totalCard || 0;
}

// ===== SAVE =====
function saveData() {
  localStorage.setItem("data", JSON.stringify({
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

// ===== ENCAISSER =====
function pay() {

  if (Object.keys(cart).length === 0) {
    alert("Panier vide !");
    return;
  }

  let total = Object.values(cart).reduce((sum, i) => sum + i.price * i.qty, 0);

  let mode = prompt("Paiement : cash ou card");

  if (!mode) return;

  if (mode === "cash") {

    let received = parseFloat(prompt("Montant reçu (€)"));

    if (isNaN(received)) {
      alert("Montant invalide");
      return;
    }

    let change = received - total;

    if (change < 0) {
      alert("Pas assez reçu !");
      return;
    }

    alert(`Rendu : ${change.toFixed(2)}€`);

    totalCash += total;

  } else {
    totalCard += total;
  }

  // stats produits
  Object.values(cart).forEach(item => {
    if (!productStats[item.name]) productStats[item.name] = 0;
    productStats[item.name] += item.qty;
  });

  totalDay += total;
  totalOrders++;

  saveData();

  printTicket(total);

  cart = {};
  renderCart();
}

// ===== TICKET =====
function printTicket(total) {

  let content = `
    <div style="padding-left:10px;">
      <div style="text-align:center;font-weight:bold;">
        LES FOURMIS BOUGENT
      </div>
      <div style="text-align:center;">COMMANDE #${orderNumber}</div>
      <hr>
  `;

  Object.values(cart).forEach(item => {
    content += `${item.qty} x ${item.name.toUpperCase()}<br>`;
  });

  content += `<hr>TOTAL: ${total.toFixed(2)}€`;

  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <style>
    @page { size: 80mm auto; margin: 0; }
    body { width:80mm; font-family:monospace; }
    </style>
    ${content}
  `);
  doc.close();

  iframe.onload = () => iframe.contentWindow.print();

  orderNumber++;
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

  document.getElementById("statsContent").innerHTML = html;
  document.getElementById("statsBox").style.display = "block";
}

// ===== CLOSE =====
function closeStats() {
  document.getElementById("statsBox").style.display = "none";
}

// ===== START =====
renderMenu();
