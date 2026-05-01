// ===== MENU =====
const menu = {
softs: [
{ name: “Eau plate”, price: 1.5, category: “boisson” },
{ name: “Eau petillante”, price: 1.5, category: “boisson” },
{ name: “Coca”, price: 2, category: “boisson” },
{ name: “Coca zero”, price: 2, category: “boisson” },
{ name: “Fanta”, price: 2, category: “boisson” },
{ name: “Cafe”, price: 2, category: “boisson” }
],
apero: [
{ name: “Apero”, price: 3.5, category: “boisson” }
],
bieres: [
{ name: “Pils”, price: 2, category: “boisson” },
{ name: “Pils NA”, price: 2, category: “boisson” },
{ name: “Blanche”, price: 2.5, category: “boisson” },
{ name: “Blanche rose”, price: 2.5, category: “boisson” },
{ name: “Kriek”, price: 2.5, category: “boisson” },
{ name: “Trolls”, price: 3, category: “boisson” },
{ name: “Leffe”, price: 3, category: “boisson” },
{ name: “Quintine”, price: 4, category: “boisson” },
{ name: “Moinette verre”, price: 3.5, category: “boisson” },
{ name: “Moinette bouteille”, price: 9, category: “boisson” },
{ name: “Saison bio verre”, price: 3, category: “boisson” },
{ name: “Saison bio bouteille”, price: 8, category: “boisson” }
],
vins: [
{ name: “Rouge verre”, price: 2.5, category: “boisson” },
{ name: “Blanc verre”, price: 2.5, category: “boisson” },
{ name: “Rose verre”, price: 2.5, category: “boisson” },
{ name: “Rouge bouteille”, price: 14, category: “boisson” },
{ name: “Blanc bouteille”, price: 14, category: “boisson” },
{ name: “Rose bouteille”, price: 14, category: “boisson” }
],
snacks: [
{ name: “Pain saucisse”, price: 4, category: “snack” },
{ name: “Hamburger”, price: 3, category: “snack” },
{ name: “Croque”, price: 3, category: “snack” },
{ name: “Chips”, price: 1, category: “snack” },
{ name: “Cornet de glace”, price: 2, category: “snack” },
{ name: “Pot de glace”, price: 3.5, category: “snack” }
]
};

// ===== ETAT =====
var current = “softs”;
var cart = {};
var totalDay = 0;
var totalOrders = 0;
var productStats = {};
var totalCash = 0;
var totalCard = 0;

// ===== LOAD =====
loadData();

// ===== CATEGORIE =====
window.setCategory = function(cat) {
current = cat;
renderMenu();
};

// ===== MENU =====
function renderMenu() {
var container = document.getElementById(“items”);
container.innerHTML = “”;

menu[current].forEach(function(item) {
var btn = document.createElement(“button”);
btn.innerText = item.name + “\n” + item.price + “EUR”;
btn.onclick = function() {
addItem(item);
btn.style.background = “#00c853”;
};
container.appendChild(btn);
});
}

// ===== PANIER =====
function addItem(item) {
if (!cart[item.name]) {
cart[item.name] = {
name: item.name,
price: item.price,
category: item.category,
qty: 1
};
} else {
cart[item.name].qty++;
}
renderCart();
}

window.addItemByName = function(name) {
var cats = Object.keys(menu);
for (var c = 0; c < cats.length; c++) {
var found = menu[cats[c]].find(function(i) { return i.name === name; });
if (found) { addItem(found); return; }
}
};

window.removeItem = function(name) {
if (cart[name].qty > 1) {
cart[name].qty–;
} else {
delete cart[name];
}
renderCart();
};

function renderCart() {
var container = document.getElementById(“cart”);
container.innerHTML = “”;
var total = 0;

Object.keys(cart).forEach(function(key) {
var item = cart[key];
total += item.price * item.qty;

```
var div = document.createElement("div");
div.innerHTML =
  item.name + " x" + item.qty +
  "<div>" +
  "<button onclick=\"addItemByName('" + item.name + "')\">+</button>" +
  "<button onclick=\"removeItem('" + item.name + "')\">-</button>" +
  "</div>";
container.appendChild(div);
```

});

document.getElementById(“total”).innerText = “Total: “ + total.toFixed(2) + “EUR”;
}

// ===== TOTAL =====
window.getTotal = function() {
return Object.keys(cart).reduce(function(s, key) {
return s + cart[key].price * cart[key].qty;
}, 0);
};

// ===== RESET BOUTONS =====
function resetProductButtons() {
var btns = document.querySelectorAll(”#items button”);
btns.forEach(function(btn) {
btn.style.background = “#2e2e2e”;
});
}

// ===== FINALISATION =====
window.finalizeSale = function(total, paymentMethod) {
Object.keys(cart).forEach(function(key) {
var i = cart[key];
productStats[i.name] = (productStats[i.name] || 0) + i.qty;
});

totalDay += total;
totalOrders++;

if (paymentMethod === “cash”) {
totalCash += total;
} else if (paymentMethod === “card”) {
totalCard += total;
}

saveData();

var cartSnapshot = {};
Object.keys(cart).forEach(function(key) {
cartSnapshot[key] = {
name: cart[key].name,
price: cart[key].price,
category: cart[key].category,
qty: cart[key].qty
};
});

printTicket(total, cartSnapshot);

cart = {};
renderCart();
resetProductButtons();
};

// ===== START =====
renderMenu();
