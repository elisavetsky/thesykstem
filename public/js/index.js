// Product Zoom In


function getCoordinates(event) {
	var productImageNormal = document.querySelectorAll(".image-normal")[0];
	var productImageZoomed = document.querySelectorAll(".image-zoomed")[0];
	productImageNormal.addEventListener("click", getCoordinates);
	if (productImageNormal.style.opacity == 1 && productImageZoomed.style.opacity == 0) {
		productImageNormal.style.opacity = 0;
		productImageZoomed.style.opacity = 1;
	} else if (productImageNormal.style.opacity == 0 && productImageZoomed.style.opacity == 1) {
		productImageNormal.style.opacity = 1;
		productImageZoomed.style.opacity = 0;
	}
	const xOffset = event.offsetX;
	const yOffset = event.offsetY;
	const nWidthZoomed = productImageZoomed.naturalWidth;
	const nHeightZoomed = productImageZoomed.naturalHeight;
	const nWidthNormal = productImageNormal.naturalWidth;
	const nHeightNormal = productImageNormal.naturalHeight;
	const zoomScale = nHeightNormal / nHeightZoomed;
	var xPos = (event.offsetX);
	var yPos = (event.offsetY);
	var calcX = (xPos) * (zoomScale - 1);
	var calcY = (yPos) * (zoomScale - 1);
	console.log(xPos, yPos);
	productImageZoomed.style.left = calcX + "px";
	productImageZoomed.style.top = calcY + "px";
}

// Love Component
var loveArray = [];

function loveUnloveProduct(productID) {
	var checkbox = document.querySelector("#love-button-" + productID);
	if (checkbox.checked === true) {
		if (JSON.parse(localStorage.getItem("lovedProd")) != null) {
			loveArray = JSON.parse(localStorage.getItem("lovedProd"));
		}
		loveArray.push(productID);
	} else if (checkbox.checked === false) {
		if (JSON.parse(localStorage.getItem("lovedProd")) != null) {
			loveArray = JSON.parse(localStorage.getItem("lovedProd"));
			var itemIndex = loveArray.indexOf(productID);
			loveArray.splice(itemIndex, 1);
		}
	}
	try {
		localStorage.setItem("lovedProd", JSON.stringify(loveArray));
	} catch (error) {
		console.error("An error occured while modifying your love list.");
	}
}

function loadLovedProducts() {
	var allProductsArray = [];
	var productsOnPageArray = [];
	var allProductsList = Array.from(document.querySelectorAll(".grid-product-container-love-list"));
	var productsOnPageList = Array.from(document.querySelectorAll(".grid-product-container"));
	var checkLovedProdExists = JSON.parse(localStorage.getItem("lovedProd"));
	var currentURL = window.location.href;

	if (checkLovedProdExists) {
		if (checkLovedProdExists.length) {
			var currentLoved = JSON.parse(localStorage.getItem("lovedProd"));
			if (currentURL.includes("/account/loved")) {
				for (i = 0; i < currentLoved.length; i++) {
					var gridProductLovedContainer = document.querySelectorAll("#" + currentLoved[i]);
					if (currentLoved.includes(gridProductLovedContainer[0].id)) {
						gridProductLovedContainer.forEach(el => el.style.display = "flex");
					}
				}
				allProductsList.forEach(el => allProductsArray.push(el.id));
				var productsNotLoved = allProductsArray.filter(match => !currentLoved.includes(match));
				for (i = 0; i < currentLoved.length; i++) {
					document.querySelector("#love-button-" + currentLoved[i]).checked = true;
				}
				for (i = 0; i < productsNotLoved.length; i++) {
					var productsRemovedFromList = document.querySelectorAll("#" + productsNotLoved[i]);
					productsRemovedFromList.forEach(el => el.remove());
				}
			} else {
				productsOnPageList.forEach(el => productsOnPageArray.push(el.id));
				var productsWillBeLoved = productsOnPageArray.filter(match => currentLoved.includes(match));
				for (i = 0; i < productsWillBeLoved.length; i++) {
					document.querySelector("#love-button-" + productsWillBeLoved[i]).checked = true;
				}
			}
		} else {
			if (currentURL.includes("/account/loved")) {
				var loveListSubtitle = document.querySelector("#my-love-list p");
				var loveListSection = document.querySelector(".section.is-small");
				loveListSection.style.minHeight = "877px";
				loveListSubtitle.innerHTML = "No items yet! Try adding some and check back here.";
				for (i = 0; i < allProductsList.length; i++) {
					allProductsList.forEach(el => el.remove());
				}
			}
		}
	}
}