function saveData() {
try {
localStorage.setItem(“barData”, JSON.stringify({
totalDay,
totalOrders,
productStats,
totalCash,
totalCard
}));
} catch (e) {
console.error(“Erreur sauvegarde localStorage:”, e);
alert(“⚠️ Erreur de sauvegarde ! Vérifiez l’espace disponible.”);
}
}

function loadData() {
try {
let d = localStorage.getItem(“barData”);
if (!d) return;
d = JSON.parse(d);

```
totalDay    = d.totalDay    || 0;
totalOrders = d.totalOrders || 0;
productStats= d.productStats|| {};
totalCash   = d.totalCash   || 0;
totalCard   = d.totalCard   || 0;
```

} catch (e) {
console.error(“Erreur chargement localStorage:”, e);
totalDay    = 0;
totalOrders = 0;
productStats= {};
totalCash   = 0;
totalCard   = 0;
}
}
