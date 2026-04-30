window.pay = function () {
if (Object.keys(cart).length === 0) {
alert(“Panier vide !”);
return;
}
document.getElementById(“paymentBox”).style.display = “block”;
};

window.choosePayment = function (mode) {

let total = getTotal();

if (mode === “cash”) {

```
document.getElementById("paymentBox").style.display = "none";
document.getElementById("cashBox").style.display = "block";
document.getElementById("amountDue").innerText = total.toFixed(2);

document.getElementById("cashInput").value = "";
document.getElementById("cashInput").focus();
```

} else {

```
document.getElementById("paymentBox").style.display = "none";

// totalCard géré dans finalizeSale — ne pas le mettre ici
finalizeSale(total, "card");
```

}
};

window.validateCash = function () {

let total = getTotal();
let received = parseFloat(document.getElementById(“cashInput”).value);

if (isNaN(received)) {
alert(“Montant invalide”);
return;
}

if (received < total) {
alert(“Montant insuffisant”);
return;
}

let change = received - total;

alert(“Rendu : “ + change.toFixed(2) + “€”);

// totalCash géré dans finalizeSale — ne pas le mettre ici
document.getElementById(“cashBox”).style.display = “none”;

finalizeSale(total, “cash”);
};
