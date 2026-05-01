window.pay = function() {
if (Object.keys(cart).length === 0) {
alert(“Panier vide !”);
return;
}
document.getElementById(“paymentBox”).style.display = “block”;
};

window.choosePayment = function(mode) {
var total = getTotal();

if (mode === “cash”) {
document.getElementById(“paymentBox”).style.display = “none”;
document.getElementById(“cashBox”).style.display = “block”;
document.getElementById(“amountDue”).innerText = total.toFixed(2);
document.getElementById(“cashInput”).value = “”;
document.getElementById(“cashInput”).focus();
} else {
document.getElementById(“paymentBox”).style.display = “none”;
finalizeSale(total, “card”);
}
};

window.validateCash = function() {
var total = getTotal();
var received = parseFloat(document.getElementById(“cashInput”).value);

if (isNaN(received)) {
alert(“Montant invalide”);
return;
}
if (received < total) {
alert(“Montant insuffisant”);
return;
}

var change = received - total;
alert(“Rendu : “ + change.toFixed(2) + “EUR”);

document.getElementById(“cashBox”).style.display = “none”;
finalizeSale(total, “cash”);
};
