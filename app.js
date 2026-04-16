async function pay() {

  try {
    // 🔴 Tentative impression PRO (plus tard)
    await fetch("http://IP_PC:3000/print", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(Object.values(cart))
    });

    alert("Ticket imprimé !");
  } catch (e) {

    // 🟢 Fallback → impression classique (ce soir)
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
        name.includes("vin") ||
        name.includes("apéro")
      ) {
        boissons.push(item);
      } else {
        snacks.push(item);
      }
    });

    content += "COMMANDE\n";
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

    win.print();
  }

  cart = {};
  renderCart();
}
