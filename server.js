const express = require("express");
const ThermalPrinter = require("node-thermal-printer").printer;

const app = express();
app.use(express.json());

let totalDay = 0;
let totalOrders = 0;

const printer = new ThermalPrinter({
  type: "epson",
  interface: "tcp://IP_IMPRIMANTE", // à changer plus tard
});

app.post("/print", async (req, res) => {
  const order = req.body;

  let total = 0;
  totalOrders++;

  // Séparer boissons / snacks
  const boissons = [];
  const snacks = [];

  order.forEach(item => {
    const name = item.name.toLowerCase();

    if (
      name.includes("eau") ||
      name.includes("coca") ||
      name.includes("fanta") ||
      name.includes("café") ||
      name.includes("bière") ||
      name.includes("pils") ||
      name.includes("vin") ||
      name.includes("apéro") ||
      name.includes("kriek") ||
      name.includes("leffe") ||
      name.includes("quintine") ||
      name.includes("moinette")
    ) {
      boissons.push(item);
    } else {
      snacks.push(item);
    }
  });

  printer.clear();

  // HEADER
  printer.setTextDoubleHeight();
  printer.setTextDoubleWidth();
  printer.println("COMMANDE #" + totalOrders);

  printer.setTextNormal();
  printer.println(new Date().toLocaleTimeString());
  printer.println("----------------");

  // BOISSONS
  if (boissons.length > 0) {
    printer.setTextDoubleHeight();
    printer.println("BOISSONS");

    boissons.forEach(item => {
      printer.setTextDoubleHeight();
      printer.setTextDoubleWidth();
      printer.println(`${item.qty} x ${item.name.toUpperCase()}`);

      printer.setTextNormal();
      printer.println("");

      total += item.price * item.qty;
    });
  }

  // SNACKS
  if (snacks.length > 0) {
    printer.println("----------------");
    printer.setTextDoubleHeight();
    printer.println("SNACKS");

    snacks.forEach(item => {
      printer.setTextDoubleHeight();
      printer.setTextDoubleWidth();
      printer.println(`${item.qty} x ${item.name.toUpperCase()}`);

      printer.setTextNormal();
      printer.println("");

      total += item.price * item.qty;
    });
  }

  printer.println("----------------");

  // TOTAL
  printer.setTextDoubleHeight();
  printer.println("TOTAL: " + total.toFixed(2) + "€");

  printer.println("----------------");
  printer.setTextNormal();
  printer.println("MERCI !");
  printer.cut();

  totalDay += total;

  try {
    await printer.execute();
    res.send("OK");
  } catch (e) {
    console.log(e);
    res.status(500).send("Erreur impression");
  }
});

app.get("/stats", (req, res) => {
  res.json({
    totalDay,
    totalOrders
  });
});

app.listen(3000, () => console.log("Serveur lancé"));
