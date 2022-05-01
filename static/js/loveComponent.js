var loveArray = [];

function loveUnloveProduct(productID) {

	var checkbox = document.querySelector("#love-button-" + productID);
	if (checkbox.checked === true) {
		if (loveArray.length != 0) {
			loveArray = JSON.parse(localStorage.getItem("lovedProd"));
		}
		loveArray.push(productID);
	} else if (checkbox.checked === false) {
		loveArray = JSON.parse(localStorage.getItem("lovedProd"));
		var itemIndex = loveArray.indexOf(productID);
		console.log("The item you are about to remove from your love list is: " + loveArray[itemIndex]);
		loveArray.splice(itemIndex, 1);
	}
	try {
		localStorage.setItem("lovedProd", JSON.stringify(loveArray));
	} catch (err) {
		console.log("some error!!");
	}
	var nowLove = JSON.parse(localStorage.getItem("lovedProd"));
	console.log("Your loved product(s) are: " + nowLove);
}

function loadLovedProducts() {
	var currentLoved = JSON.parse(localStorage.getItem("lovedProd"));
	console.log(currentLoved.length + " PRODUCTS. " + "After page load, the currently loved product(s) are: " + currentLoved);
	for (i = 0; i < currentLoved.length; i++) {
		document.querySelector("#love-button-" + currentLoved[i]).checked = true;
	}
}