const express = require("express");
const ThermalPrinter = require("node-thermal-printer").printer;

const app = express();
app.use(express.json());

let totalDay = 0;
let totalOrders = 0;

const printer = new ThermalPrinter({
  type: "epson",
  interface: "tcp://IP_IMPRIMANTE",
});

app.post("/print", async (req, res) => {
  const order = req.body;

  let total = 0;
  totalOrders++;

  printer.clear();
  printer.println("=== BAR ===");
  printer.println("Commande #" + totalOrders);
  printer.println(new Date().toLocaleString());
  printer.println("----------------");

  order.forEach(item => {
    printer.println(`${item.name} x${item.qty}`);
    total += item.price * item.qty;
  });

  totalDay += total;

  printer.println("----------------");
  printer.println(`TOTAL : ${total.toFixed(2)}€`);
  printer.println("----------------");
  printer.println("Merci !");
  printer.cut();

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
