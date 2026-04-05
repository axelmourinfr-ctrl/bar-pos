const menu = {
  softs: [
    { name: "Coca", price: 2 },
    { name: "Fanta", price: 2 },
    { name: "Eau", price: 1.5 },
  ],
  alcohol: [
    { name: "Bière", price: 3 },
    { name: "Vin", price: 4 },
  ],
  snacks: [
    { name: "Chips", price: 2 },
    { name: "Croque", price: 5 },
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

  document.getElementById("total").innerText = `Total: ${total}€`;
}

async function pay() {
  await fetch("http://192.168.1.100:3000/print", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(Object.values(cart))
  });

  cart = {};
  renderCart();
}

renderMenu();
