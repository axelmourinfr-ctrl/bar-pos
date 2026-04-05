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

let current = "softs";
let cart = {};

function setCategory(cat) {
  current = cat;
  renderMenu();
}

function renderMenu() {
  const container = document.getElementById("items");
  container.innerHTML = "";

  menu[current].forEach(item => {
    const btn = document.createElement("button");
    btn.innerText = `${item.name}\n${item.price}€`;
    btn.onclick = () => addItem(item);
    container.appendChild(btn);
  });
}

function addItem(item) {
  if (!cart[item.name]) {
    cart[item.name] = { ...item, qty: 1 };
  } else {
    cart[item.name].qty++;
  }
  renderCart();
}

function removeItem(name) {
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

async function pay() {
  alert("Commande envoyée (impression à venir)");
  cart = {};
  renderCart();
}

renderMenu();
