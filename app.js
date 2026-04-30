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

// ===== LOAD (géré par storage.js) =====
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

// 3. Sauvegarde (via storage.js)
saveData();

// 4. Snapshot du panier AVANT de le vider
const cartSnapshot = JSON.parse(JSON.stringify(cart));
printTicket(total, cartSnapshot); // printTicket est dans ticket.js

// 5. Reset panier et interface
cart = {};
renderCart();
resetProductButtons();
};

// ===== START =====
renderMenu();
