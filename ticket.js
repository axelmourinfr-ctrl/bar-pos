window.printTicket = function (total, cartSnapshot) {

// Utilise le snapshot passé en paramètre (panier figé au moment du paiement)
const items = Object.values(cartSnapshot);

// Tri basé sur la catégorie définie dans le menu (plus fiable que les includes)
let boissons = items.filter(i => i.category === “boisson”);
let snacks   = items.filter(i => i.category === “snack”);

// ===== FONCTION IMPRESSION =====
function printBlock(title, blockItems) {

```
if (blockItems.length === 0) return;

let rows = blockItems.map(item =>
  `${item.qty} x ${item.name.toUpperCase()}`
).join("<br>");

const content = `
  <div style="padding:8px;font-family:monospace;max-width:72mm;margin:0 auto;">

    <div style="text-align:center;">
      <img src="logo.png" style="width:110px;margin-bottom:8px;">
    </div>

    <div style="text-align:center;font-weight:bold;">
      ${title}
    </div>

    <div style="text-align:center;">
      COMMANDE #${totalOrders}
    </div>

    <hr>
    ${rows}
    <hr>

    <b>TOTAL: ${total.toFixed(2)}€</b>
    <br><br>

    <div style="text-align:center;">MERCI !</div>

  </div>
`;

// Iframe cachée pour ne pas perturber l'interface
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
      body {
        width: 80mm;
        margin: 0;
        font-family: monospace;
        font-size: 13px;
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

// Impression + nettoyage propre après 2s
iframe.onload = () => {
  try {
    iframe.contentWindow.print();
  } catch (e) {
    console.error("Erreur impression:", e);
  }
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 2000);
};
```

}

// Ticket boissons immédiatement
printBlock(“BOISSONS”, boissons);

// Ticket snacks avec délai pour ne pas chevaucher
if (snacks.length > 0) {
setTimeout(() => {
printBlock(“SNACKS”, snacks);
}, 800);
}
};
