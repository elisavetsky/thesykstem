// Check URL
var currentURL = window.location.href;

// Product Zoom In
if (currentURL.includes("product")) {
	var activeCollection = document.querySelector(".active-image");
	var activeNormal = document.querySelector(".active-image .image-normal");
	var activeZoomed = document.querySelector(".active-image .image-zoomed");
	var thumbs = document.querySelectorAll(".gallery label");
	for (let i = 0; i < thumbs.length; i++) {
		thumbs[i].addEventListener("click", function() {
			document.querySelector(".active-image").classList.remove("active-image");
			var activeThumb = this.getAttribute("for");
			var activeFull = document.getElementById(activeThumb).nextElementSibling;
			activeFull.classList.add("active-image");
			activeNormal = activeFull.firstElementChild;
			activeZoomed = activeFull.lastElementChild;
			activeZoomed.addEventListener("click", getCoordinates);
			activeNormal.addEventListener("click", getCoordinates);
		});
	}

	activeNormal.addEventListener("click", getCoordinates);
	activeZoomed.addEventListener("click", getCoordinates);
}

function getCoordinates(event) {
	const xOffset = event.offsetX;
	const yOffset = event.offsetY;
	zoomProduct(xOffset, yOffset, event);
}

function zoomProduct(xOffset, yOffset, event) {
	var targetArray = [event.target.parentNode.firstElementChild, event.target.parentNode.lastElementChild];
	var productImageNormal = targetArray[0];
	var productImageZoomed = targetArray[1];
	const nWidthZoomed = productImageZoomed.naturalWidth;
	const nHeightZoomed = productImageZoomed.naturalHeight;
	const nWidthNormal = productImageNormal.naturalWidth;
	const nHeightNormal = productImageNormal.naturalHeight;
	const zoomScale = nHeightNormal / nHeightZoomed;
	const calcX = (xOffset) * (zoomScale - (1 + zoomScale));
	const calcY = (yOffset) * (zoomScale - (1 + zoomScale));

	if (productImageNormal.style.opacity == 1 && productImageZoomed.style.opacity == 0) {
		productImageNormal.style.cssText = `opacity: 0;`;
		productImageZoomed.style.cssText = `
		opacity: 1; 
		z-index: 0; 
		left: ${ calcX + "px"}; 
		top: ${ calcY + "px"}`;
	} else if (productImageNormal.style.opacity == 0 && productImageZoomed.style.opacity == 1) {
		productImageNormal.style.cssText = `opacity: 1; z-index: 0;`;
		productImageZoomed.style.cssText = `opacity: 0; z-index: -1;`;
	}
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







// console.log((calcX) + " " + (calcY));
// for (var i = 0; i < 10; i++) {
// 	setTimeout(function() {
// 		console.log(xOffset);
// 		// 
// 	}, 50 * i);
// }




// for (var i = 0; i < targetArray.length; i++) {
// 
// 	// console.log(xOffset, yOffset);
// 	if (productImageNormal[i].style.opacity == 1 && productImageZoomed[i].style.opacity == 0) {
// 		productImageNormal[i].style.opacity = 0;
// 		productImageNormal[i].style.zIndex = 3;
// 		productImageZoomed[i].style.opacity = 1;
// 		productImageZoomed[i].style.zIndex = 4;
// 	} else if (productImageNormal[i].style.opacity == 0 && productImageZoomed[i].style.opacity == 1) {
// 		productImageNormal[i].style.opacity = 1;
// 		productImageNormal[i].style.zIndex = 4;
// 		productImageZoomed[i].style.opacity = 0;
// 		productImageZoomed[i].style.zIndex = 3;
// 	}
// 
// 	const nWidthZoomed = productImageZoomed[i].naturalWidth;
// 	const nHeightZoomed = productImageZoomed[i].naturalHeight;
// 	const nWidthNormal = productImageNormal[i].naturalWidth;
// 	const nHeightNormal = productImageNormal[i].naturalHeight;
// 	const zoomScaleDesktop = nHeightNormal / nHeightZoomed;
// 
// 	calcX = (xOffset) * (zoomScaleDesktop - (1 + zoomScaleDesktop));
// 	calcY = (yOffset) * (zoomScaleDesktop - (1 + zoomScaleDesktop));
// 	productImageZoomed[i].style.left = calcX + "px";
// 	productImageZoomed[i].style.top = calcY + "px";
// 
// }

// productImageZoomed.forEach(i => {
// 	// console.log(event.offsetX);
// 	i.addEventListener("click", function(event) {		
// 		
// 	});
// 	if (i.style.opacity == 1) {
// 		i.style.opacity = 0;
// 		i.style.zIndex = 0;
// 	} else if (i.style.opacity == 0) {
// 		i.style.opacity = 1;
// 		i.style.zIndex = 1;
// 	}
// 	// i.style.left = calcX + "px";
// 	// console.log(calcX, calcY);
// 	// i.style.top = calcY + "px";
// });
// productImageNormal.forEach(i => {
// 	// console.log(event.offsetX);
// 	i.addEventListener("click", function(event) {		
// 		
// 	});
// 	if (i.style.opacity == 1) {
// 		i.style.opacity = 0;
// 		i.style.zIndex = 0;
// 	} else if (i.style.opacity == 0) {
// 		i.style.opacity = 1;
// 		i.style.zIndex = 1;
// 	}
// });

// console.log(event.target.classList);

// if (theTarget.classList.contains("image-normal")) {
// 	if (theTarget.style.opacity == 1) {
// 		theTarget.style.opacity = 0;
// 		theTarget.style.zIndex = 3;
// 		targetSibling.style.opacity = 1;
// 		targetSibling.style.zIndex = 4;
// 		targetSibling.style.left = calcX + "px";
// 		targetSibling.style.top = calcY + "px";
// 	} else {
// 		theTarget.style.opacity = 1;
// 		theTarget.style.zIndex = 4;
// 		targetSibling.style.opacity = 0;
// 		targetSibling.style.zIndex = 3;
// 	}
// } else {
// 	console.log(event.target);
// 	if (theTarget.style.opacity == 1) {
// 		theTarget.style.opacity = 0;
// 		theTarget.style.zIndex = 3;
// 		targetFirstSibling.style.opacity = 1;
// 		theTarget.style.zIndex = 4;
// 		
// 	} else {
// 		theTarget.style.opacity = 1;
// 		theTarget.style.zIndex = 4;
// 		targetFirstSibling.style.opacity = 0;
// 		targetFirstSibling.style.zIndex = 3;
// 		theTarget.style.left = calcX + "px";
// 		theTarget.style.top = calcY + "px";
// 	}
// }


// 	productImageNormal.forEach((i) => {
// 		i.addEventListener("click", getCoordinates);
// 		// console.log(event.offsetX);
// 		if (i.style.opacity == 1) {
// 			i.style.opacity = 0;
// 		} else if (i.style.opacity == 0) {
// 			i.style.opacity = 1;
// 		}
// 	});
// 	
// 	productImageZoomed.forEach((i) => {
// 		i.addEventListener("click", getCoordinates);
// 		// console.log(event.offsetX);
// 		if (i.style.opacity == 1) {
// 			i.style.opacity = 0;
// 		} else if (i.style.opacity == 0) {
// 			i.style.opacity = 1;
// 		}
// 		const nHeightZoomed = i.naturalHeight;
// 		const nHeightNormal = i.naturalHeight;
// 		const zoomScaleDesktop = nHeightNormal / nHeightZoomed;
// 		
// 
// 		calcX = (xOffset) * (zoomScaleDesktop - (1 + zoomScaleDesktop));
// 		calcY = (yOffset) * (zoomScaleDesktop - (1 + zoomScaleDesktop));
// 		// console.log(xOffset, yOffset, zoomScaleDesktop);
// 		i.style.left = calcX + "px";
// 		i.style.top = calcY + "px";
// 		
// 		
// 	});



// console.log(xOffset, yOffset, zoomScaleDesktop);
// coordinateArray.push(xOffset);
// var last8 = coordinateArray.slice(-8);
// console.log(last8);
// for (let u = 0; u < 4; u++) {

// console.log("CONTINUE FUN+CTION");
// }

// while (coordinateArray.length > 10 && !last8.every((val, i, array) => val === array[0]) && coordinateArray.length < 20) {
// coordinateArray.push(xOffset);
// console.log("hello world");
// productImageZoomed[i].style.left = calcX + "px";
// productImageZoomed[i].style.top = calcY + "px";
// console.log(coordinateArray);
// theLoop();

// }

// console.log(coordinateArray);
// 
// console.log(lastTen);

// console.log(event.target);