window.showStats = function() {
var html =
“<h3>Total: “ + totalDay.toFixed(2) + “EUR</h3>” +
“<p>Commandes: “ + totalOrders + “</p>” +
“<p>Cash: “ + totalCash.toFixed(2) + “EUR</p>” +
“<p>Carte: “ + totalCard.toFixed(2) + “EUR</p>” +
“<hr>”;

var sorted = Object.keys(productStats).sort(function(a, b) {
return productStats[b] - productStats[a];
});

sorted.forEach(function(name) {
html += name + “ : “ + productStats[name] + “<br>”;
});

document.getElementById(“statsContent”).innerHTML = html;
document.getElementById(“statsBox”).style.display = “block”;
};

window.closeStats = function() {
document.getElementById(“statsBox”).style.display = “none”;
};

window.resetStats = function() {
if (!confirm(“Remettre a zero les stats ?”)) return;
totalDay = 0;
totalOrders = 0;
productStats = {};
totalCash = 0;
totalCard = 0;
saveData();
alert(“Stats reinitialisees !”);
showStats();
};

window.copyStats = function() {
var text = document.getElementById(“statsContent”).innerText;
navigator.clipboard.writeText(text)
.then(function() { alert(“Stats copiees !”); })
.catch(function() { alert(“Erreur copie”); });
};

window.exportStats = function() {
var text = document.getElementById(“statsContent”).innerText;
var blob = new Blob([text], { type: “text/plain” });
var url = URL.createObjectURL(blob);
var a = document.createElement(“a”);
a.href = url;
a.download = “stats_bar.txt”;
a.click();
setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
};
