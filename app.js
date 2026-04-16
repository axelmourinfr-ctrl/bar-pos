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

// CHANGER CATÉGORIE
function setCategory(cat) {
  current = cat;
  renderMenu();
}

// AFFICHER MENU
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

// AJOUTER
function addItem(item) {
  if (!cart[item.name]) {
    cart[item.name] = { ...item, qty: 1 };
  } else {
    cart[item.name].qty++;
  }
  renderCart();
}

// SUPPRIMER
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

// IMPRESSION (CORRIGÉE)
function pay() {

  let content = "";
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
      name.includes("bière") ||
      name.includes("blanche") ||
      name.includes("kriek") ||
      name.includes("leffe") ||
      name.includes("quintine") ||
      name.includes("moinette") ||
      name.includes("vin") ||
      name.includes("apéro")
    ) {
      boissons.push(item);
    } else {
      snacks.push(item);
    }
  });

  content += "***************\n";
  content += "   COMMANDE\n";
  content += "***************\n";
  content += new Date().toLocaleTimeString() + "\n";
  content += "----------------\n\n";

  if (boissons.length > 0) {
    content += "BOISSONS\n\n";
    boissons.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}\n\n`;
      total += item.price * item.qty;
    });
  }

  if (snacks.length > 0) {
    content += "----------------\n";
    content += "SNACKS\n\n";
    snacks.forEach(item => {
      content += `${item.qty} x ${item.name.toUpperCase()}\n\n`;
      total += item.price * item.qty;
    });
  }

  content += "----------------\n";
  content += `TOTAL: ${total.toFixed(2)}€\n`;
  content += "----------------\n";
  content += "MERCI !\n";

  const win = window.open("", "", "width=300,height=600");

  win.document.write(`
    <html>
    <body style="font-family: monospace; font-size:18px;">
      <pre>${content}</pre>
    </body>
    </html>
  `);

  win.document.close();

  setTimeout(() => {
    win.print();
  }, 600);

  cart = {};
  renderCart();
}

// START
renderMenu();
