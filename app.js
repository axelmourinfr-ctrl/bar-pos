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
  apero: [
    { name: "Apéro", price: 2.5 },
  ],
  bieres: [
    { name: "Pils", price: 2 },
    { name: "Blanche", price: 2 },
    { name: "Blanche rosé", price: 2.5 },
    { name: "Kriek", price: 2.5 },
    { name: "Trolls", price: 3 },
    { name: "Leffe", price: 3 },
    { name: "Quintine", price: 3 },
    { name: "Moinette (verre)", price: 3 },
    { name: "Moinette (bouteille)", price: 8 },
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
    { name: "Pain saucisse", price: 3.5 },
    { name: "Hamburger", price: 3 },
    { name: "Croque", price: 2.5 },
    { name: "Tarte", price: 2.5 },
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

// CHANGER CATÉGORIE
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

// IMPRESSION HYBRIDE + STATS
async function pay() {

  const order = Object.values(cart);
  let total = 0;

  let boissons = [];
  let snacks = [];

  order.forEach(item => {
    const name = item.name.toLowerCase();

    // 👉 CORRECTION VIN = BOISSON
    if (
      name.includes("eau") ||
      name.includes("coca") ||
      name.includes("fanta") ||
      name.includes("café") ||
      name.includes("pils") ||
      name.includes("bière") ||
      name.includes("blanche") ||
      name.includes("kriek") ||
      name.includes("leffe") ||
      name.includes("quintine") ||
      name.includes("moinette") ||
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

    // STATS PRODUITS
    if (!productStats[item.name]) {
      productStats[item.name] = 0;
    }
    productStats[item.name] += item.qty;
  });

  totalDay += total;
  totalOrders++;

  // TICKET
  let content = "";

  content += "***************\n";
  content += "COMMANDE #" + orderNumber + "\n";
  content += "***************\n";
  content += new Date().toLocaleTimeString() + "\n";
  content += "----------------\n\n";

  if (boissons.length > 0) {
    content += "BOISSONS\n\n";
    boissons.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}\n\n`;
    });
  }

  if (snacks.length > 0) {
    content += "----------------\n";
    content += "SNACKS\n\n";
    snacks.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}\n\n`;
    });
  }

  content += "----------------\n";
  content += `TOTAL: ${total.toFixed(2)}€\n`;
  content += "----------------\n";
  content += "MERCI !\n";

  // IMPRESSION CLASSIQUE
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = "-10000px";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  doc.open();
  doc.write(`<pre style="font-size:18px">${content}</pre>`);
  doc.close();

  iframe.onload = function () {
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  orderNumber++;
  cart = {};
  renderCart();
}

// AFFICHER STATS
function showStats() {
  let message = "TOTAL JOUR: " + totalDay.toFixed(2) + "€\n";
  message += "COMMANDES: " + totalOrders + "\n\n";

  for (let product in productStats) {
    message += product + " : " + productStats[product] + "\n";
  }

  alert(message);
}

// START
renderMenu();
