window.printTicket = function(total, cartSnapshot) {
var items = Object.keys(cartSnapshot).map(function(k) { return cartSnapshot[k]; });

var boissons = items.filter(function(i) { return i.category === “boisson”; });
var snacks   = items.filter(function(i) { return i.category === “snack”; });

function printBlock(title, blockItems) {
if (blockItems.length === 0) return;

```
var rows = blockItems.map(function(item) {
  return item.qty + " x " + item.name.toUpperCase();
}).join("<br>");

var content =
  "<div style='padding:8px;font-family:monospace;max-width:72mm;margin:0 auto;'>" +
    "<div style='text-align:center;'>" +
      "<img src='logo.png' style='width:110px;margin-bottom:8px;'>" +
    "</div>" +
    "<div style='text-align:center;font-weight:bold;'>" + title + "</div>" +
    "<div style='text-align:center;'>COMMANDE #" + totalOrders + "</div>" +
    "<hr>" +
    rows +
    "<hr>" +
    "<b>TOTAL: " + total.toFixed(2) + "EUR</b>" +
    "<br><br>" +
    "<div style='text-align:center;'>MERCI !</div>" +
  "</div>";

var iframe = document.createElement("iframe");
iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden;";
document.body.appendChild(iframe);

var doc = iframe.contentWindow.document;
doc.open();
doc.write(
  "<html><head><style>" +
  "@page { size: 80mm auto; margin: 0; }" +
  "body { width:80mm; margin:0; font-family:monospace; font-size:13px; }" +
  "img { filter: grayscale(100%) contrast(200%); }" +
  "</style></head><body>" + content + "</body></html>"
);
doc.close();

iframe.onload = function() {
  try { iframe.contentWindow.print(); } catch(e) {}
  setTimeout(function() {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 2000);
};
```

}

printBlock(“BOISSONS”, boissons);

if (snacks.length > 0) {
setTimeout(function() {
printBlock(“SNACKS”, snacks);
}, 800);
}
};
