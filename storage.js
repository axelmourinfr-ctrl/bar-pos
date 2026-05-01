function saveData() {
try {
var data = {
totalDay: totalDay,
totalOrders: totalOrders,
productStats: productStats,
totalCash: totalCash,
totalCard: totalCard
};
localStorage.setItem(“barData”, JSON.stringify(data));
} catch(e) {
alert(“Erreur sauvegarde !”);
}
}

function loadData() {
try {
var d = localStorage.getItem(“barData”);
if (!d) return;
d = JSON.parse(d);
totalDay    = d.totalDay    || 0;
totalOrders = d.totalOrders || 0;
productStats= d.productStats|| {};
totalCash   = d.totalCash   || 0;
totalCard   = d.totalCard   || 0;
} catch(e) {
totalDay = 0;
totalOrders = 0;
productStats = {};
totalCash = 0;
totalCard = 0;
}
}
