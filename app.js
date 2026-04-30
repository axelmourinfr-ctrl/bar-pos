// ===== MENU =====
const menu = {
softs: [
{ name: “Eau plate”, price: 1.5, category: “boisson” },
{ name: “Eau pétillante”, price: 1.5, category: “boisson” },
{ name: “Coca”, price: 2, category: “boisson” },
{ name: “Coca zéro”, price: 2, category: “boisson” },
{ name: “Fanta”, price: 2, category: “boisson” },
{ name: “Café”, price: 2, category: “boisson” },
],
apero: [
{ name: “Apéro”, price: 3.5, category: “boisson” }
],
bieres: [
{ name: “Pils”, price: 2, category: “boisson” },
{ name: “Pils NA”, price: 2, category: “boisson” },
{ name: “Blanche”, price: 2.5, category: “boisson” },
{ name: “Blanche rosé”, price: 2.5, category: “boisson” },
{ name: “Kriek”, price: 2.5, category: “boisson” },
{ name: “Trolls”, price: 3, category: “boisson” },
{ name: “Leffe”, price: 3, category: “boisson” },
{ name: “Quintine”, price: 4, category: “boisson” },
{ name: “Moinette verre”, price: 3.5, category: “boisson” },
{ name: “Moinette bouteille”, price: 9, category: “boisson” },
{ name: “Saison bio verre”, price: 3, category: “boisson” },
{ name: “Saison bio bouteille”, price: 8, category: “boisson” },
],
vins: [
{ name: “Rouge (verre)”, price: 2.5, category: “boisson” },
{ name: “Blanc (verre)”, price: 2.5, category: “boisson” },
{ name: “Rosé (verre)”, price: 2.5, category: “boisson” },
{ name: “Rouge (bouteille)”, price: 14, category: “boisson” },
{ name: “Blanc (bouteille)”, price: 14, category: “boisson” },
{ name: “Rosé (bouteille)”, price: 14, category: “boisson” },
],
snacks: [
{ name: “Pain saucisse”, price: 4, category: “snack” },
{ name: “Hamburger”, price: 3, category: “snack” },
{ name: “Croque”, price: 3, category: “snack” },
{ name: “Chips”, price: 1, category: “snack” },
{ name: “Cornet de glace”, price: 2, category: “snack” },
{ name: “Pot de glace”, price: 3.5, category: “snack” },
],
};

// ===== ÉTAT =====
let current = “softs”;
let cart = {};

let totalDay = 0;
let totalOrders = 0;
let productStats = {};
let totalCash = 0;
let totalCard = 0;

// ===== LOAD =====
loadData();

// ===== MENU =====
window.setCategory = function (cat) {
current = cat;
renderMenu();
};

function renderMenu() {
const container = document.getElementById(“items”);
container.innerHTML = “”;

menu[current].forEach(item => {
const btn = document.createElement(“button”);
btn.innerText = `${item.name}\n${item.price}€`;

```
btn.onclick = () => {
  addItem(item);
  btn.style.background = "#00c853";
};

container.appendChild(btn);
```

});
}

// ===== PANIER =====
function addItem(item) {
if (!cart[item.name]) {
cart[item.name] = { …item, qty: 1 };
} else {
cart[item.name].qty++;
}
renderCart();
}

window.addItemByName = function (name) {
for (let cat in menu) {
let found = menu[cat].find(i => i.name === name);
if (found) return addItem(found);
}
};

window.removeItem = function (name) {
if (cart[name].qty > 1) {
cart[name].qty–;
} else {
delete cart[name];
}
renderCart();
};

function renderCart() {
const container = document.getElementById(“cart”);
container.innerHTML = “”;

let total = 0;

Object.values(cart).forEach(item => {
total += item.price * item.qty;

```
const div = document.createElement("div");
div.innerHTML = `
  ${item.name} x${item.qty}
  <div>
    <button onclick="addItemByName('${item.name}')">+</button>
    <button onclick="removeItem('${item.name}')">-</button>
  </div>
`;
container.appendChild(div);
```

});

document.getElementById(“total”).innerText = `Total: ${total.toFixed(2)}€`;
}

// ===== TOTAL GLOBAL =====
window.getTotal = function () {
return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
};

// ===== RESET VISUEL =====
function resetProductButtons() {
document.querySelectorAll(”#items button”).forEach(btn => {
btn.style.background = “#2e2e2e”;
});
}

// ===== FINALISATION VENTE =====
window.finalizeSale = function (total, paymentMethod) {

// 1. Màj stats produits
Object.values(cart).forEach(i => {
productStats[i.name] = (productStats[i.name] || 0) + i.qty;
});

// 2. Màj totaux
totalDay += total;
totalOrders++;

if (paymentMethod === “cash”) {
totalCash += total;
} else if (paymentMethod === “card”) {
totalCard += total;
}

// 3. Sauvegarde
saveData();

// 4. Impression avec snapshot du panier AVANT de le vider
//    On passe une copie du panier pour éviter tout problème async
const cartSnapshot = JSON.parse(JSON.stringify(cart));
printTicket(total, cartSnapshot);

// 5. Reset panier et interface APRÈS l’impression
cart = {};
renderCart();
resetProductButtons();
};

// ===== IMPRESSION =====
window.printTicket = function (total, cartSnapshot) {

// Utilise le snapshot passé en paramètre (panier figé au moment du paiement)
const items = Object.values(cartSnapshot);

// Tri basé sur la catégorie définie dans le menu (plus fiable que les includes)
let boissons = items.filter(i => i.category === “boisson”);
let snacks = items.filter(i => i.category === “snack”);

// ===== FONCTION IMPRESSION =====
function printBlock(title, blockItems) {
if (blockItems.length === 0) return;

```
let rows = blockItems.map(item =>
  `${item.qty} x ${item.name.toUpperCase()}`
).join("<br>");

const content = `
  <div style="padding:8px;font-family:monospace;max-width:72mm;margin:0 auto;">
    <div style="text-align:center;">
      <img src="logo.png" style="width:110px;margin-bottom:8px;">
    </div>
    <div style="text-align:center;font-weight:bold;">${title}</div>
    <div style="text-align:center;">COMMANDE #${totalOrders}</div>
    <hr>
    ${rows}
    <hr>
    <b>TOTAL: ${total.toFixed(2)}€</b>
    <br><br>
    <div style="text-align:center;">MERCI !</div>
  </div>
`;

const iframe = document.createElement("iframe");
iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden;";
document.body.appendChild(iframe);

const doc = iframe.contentWindow.document;
doc.open();
doc.write(`
  <html>
  <head>
    <style>
      @page { size: 80mm auto; margin: 0; }
      body { width:80mm; margin:0; font-family:monospace; font-size:13px; }
      img { filter: grayscale(100%) contrast(200%); }
    </style>
  </head>
  <body>${content}</body>
  </html>
`);
doc.close();

// Impression + nettoyage propre de l'iframe
iframe.onload = () => {
  try {
    iframe.contentWindow.print();
  } catch (e) {
    console.error("Erreur impression:", e);
  }
  // Nettoyage après 2s pour laisser le temps à l'imprimante
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 2000);
};
```

}

// Impression ticket boissons immédiatement
printBlock(“BOISSONS”, boissons);

// Impression ticket snacks avec délai pour ne pas chevaucher
if (snacks.length > 0) {
setTimeout(() => {
printBlock(“SNACKS”, snacks);
}, 800);
}
};

// ===== START =====
renderMenu();
