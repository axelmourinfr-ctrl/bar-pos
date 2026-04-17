// MENU
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

// ÉTAT
let current = "softs";
let cart = {};
let orderNumber = 1;

// STATS
let totalDay = 0;
let totalOrders = 0;
let productStats = {};

// CATÉGORIE
function setCategory(cat) {
  current = cat;
  renderMenu();
}

// MENU
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

// AJOUT
function addItem(item) {
  if (!cart[item.name]) {
    cart[item.name] = { ...item, qty: 1 };
  } else {
    cart[item.name].qty++;
  }
  renderCart();
}

// SUPPRESSION
function removeItem(name) {
  if (!cart[name]) return;

  if (cart[name].qty > 1) {
    cart[name].qty--;
  } else {
    delete cart[name];
  }
  renderCart();
}

// PANIER
function renderCart() {
  const container = document.getElementById("cart");
  container.innerHTML = "";

  let total = 0;

  Object.values(cart).forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

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

// PAIEMENT + IMPRESSION
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
      name.includes("eau") ||
      name.includes("coca") ||
      name.includes("fanta") ||
      name.includes("café") ||
      name.includes("pils") ||
      name.includes("blanche") ||
      name.includes("kriek") ||
      name.includes("leffe") ||
      name.includes("quintine") ||
      name.includes("moinette") ||
      name.includes("saison") ||
      name.includes("vin") ||
      name.includes("rouge") ||
      name.includes("blanc") ||
      name.includes("rosé") ||
      name.includes("apéro")
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

  // 🧾 TICKET THERMIQUE OPTIMISÉ
  let content = `
    <div style="text-align:center; font-family: monospace;">
      <div style="font-size:22px; font-weight:bold;">
        LES FOURMIS
      </div>
      <div style="font-size:20px; margin-bottom:10px;">
        BOUGENT !
      </div>

      <div style="font-size:18px; margin-top:10px;">
        COMMANDE #${orderNumber}
      </div>
    </div>
    <hr>
  `;

  if (boissons.length > 0) {
    content += "<strong>BOISSONS</strong><br><br>";
    boissons.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}<br><br>`;
    });
  }

  if (snacks.length > 0) {
    content += "<hr><strong>SNACKS</strong><br><br>";
    snacks.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}<br><br>`;
    });
  }

  content += `<hr><strong>TOTAL: ${total.toFixed(2)}€</strong><br><br>`;
  content += `<div style="text-align:center;">MERCI !</div>`;

  // IMPRESSION
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = "-10000px";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<body style="font-size:18px;">${content}</body>`);
  doc.close();

  iframe.onload = function () {
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  orderNumber++;
  cart = {};
  renderCart();
}

// STATS
function showStats() {

  if (totalOrders === 0) {
    alert("Aucune vente pour le moment");
    return;
  }

  let message = "TOTAL JOUR: " + totalDay.toFixed(2) + "€\n";
  message += "COMMANDES: " + totalOrders + "\n\n";

  for (let product in productStats) {
    message += product + " : " + productStats[product] + "\n";
  }

  alert(message);
}

// START
renderMenu();
