// ===== AFFICHER STATS =====
window.showStats = function () {

let html = `<h3>Total: ${totalDay.toFixed(2)}€</h3> <p>Commandes: ${totalOrders}</p> <p>Cash: ${totalCash.toFixed(2)}€</p> <p>Carte: ${totalCard.toFixed(2)}€</p> <hr>`;

let sorted = Object.entries(productStats)
.sort((a, b) => b[1] - a[1]);

sorted.forEach(([name, qty]) => {
html += `${name} : ${qty}<br>`;
});

document.getElementById(“statsContent”).innerHTML = html;
document.getElementById(“statsBox”).style.display = “block”;
};

// ===== FERMER =====
window.closeStats = function () {
document.getElementById(“statsBox”).style.display = “none”;
};

// ===== RESET =====
window.resetStats = function () {

if (!confirm(“Remettre à zéro les stats ?”)) return;

totalDay = 0;
totalOrders = 0;
productStats = {};
totalCash = 0;
totalCard = 0;

// Sauvegarde l’état vide plutôt que de juste supprimer la clé
saveData();

alert(“Stats réinitialisées ✅”);

showStats();
};

// ===== COPIER =====
window.copyStats = function () {

let text = document.getElementById(“statsContent”).innerText;

navigator.clipboard.writeText(text)
.then(() => alert(“Stats copiées ✅”))
.catch(() => alert(“Erreur copie ❌”));
};

// ===== EXPORT =====
window.exportStats = function () {

let text = document.getElementById(“statsContent”).innerText;

let blob = new Blob([text], { type: “text/plain” });
let url = URL.createObjectURL(blob);

let a = document.createElement(“a”);
a.href = url;
a.download = “stats_bar.txt”;
a.click();

// Nettoyage mémoire
setTimeout(() => URL.revokeObjectURL(url), 1000);
};
