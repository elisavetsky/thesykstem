// Check URL
const currentURL = window.location.href;

// Product Sort & Filter
let initialProductArray = [];
let productArray = [];
let colorArray = [];
var checkedColors = [];
var uncheckedColors = [];

const sortDropdown = document.getElementById("sort-products");
const filterDropdownValues = document.querySelectorAll(".filter-option-color");
const clearFiltersButton = document.getElementById("clear-filters-button");

const productGrid = document.querySelector(".product-grid");
const productContainers = Array.from(document.querySelectorAll(".grid-product-container"));

if (sortDropdown) {
	
	createProductObject();
	
	sortDropdown.addEventListener("change", handleSortDropdownValue);
	clearFiltersButton.addEventListener("click", clearFilters);
	
	// Create Product Object
	function createProductObject() {
		for (let i = 0; i < productContainers.length; i++) {
			const productPrice = productContainers[i].querySelector(".price").textContent.replace("$", "");
			const productColor = productContainers[i].querySelector(".product-page-color").textContent;
			const productObject = {
				container: productContainers[i],
				price: productPrice,
				color: productColor
			}
			initialProductArray.push(productObject);
			productArray.push(productObject);
		}
	}

	// Filter Products (Color)
	function getCheckedValue(option) {
		const checkedStatus = option.target.checked;
		if (checkedStatus === true) {
			colorArray.push(option.target.value);
		} else {
			colorArray.splice(colorArray.indexOf(option.target.value), 1);
		}
		console.log(colorArray);
	}

	filterDropdownValues.forEach((f) => {
		f.addEventListener("change", (option) => {
			getCheckedValue(option);

			checkedColors = productArray.filter(el => colorArray.indexOf(el.color) >= 0);
			uncheckedColors = productArray.filter(el => colorArray.indexOf(el.color) == -1);

			changeClearFiltersButtonState();

			for (let i = 0; i < checkedColors.length; i++) {
				productGrid.appendChild(checkedColors[i].container);
			}
			for (i = 0; i < uncheckedColors.length; i++) {
				const colorsRemovedFromList = document.querySelectorAll("#" + uncheckedColors[i].container.id);
				colorsRemovedFromList.forEach(el => el.remove());
			}
			if ((uncheckedColors.length == productArray.length) && productArray.every(el => uncheckedColors.indexOf(el) >= 0)) {
				for (let i = 0; i < productArray.length; i++) {
					productGrid.appendChild(productArray[i].container);
				}
			}
			handleSortDropdownValue();
		});
	});

	function changeClearFiltersButtonState() {
		if (checkedColors.length > 0) {
			clearFiltersButton.classList.remove("is-hidden");
		} else {
			clearFiltersButton.classList.add("is-hidden");
		}
	}

	function clearFilters() {
		filterDropdownValues.forEach((el) => {
			if (el.checked == true) {
				el.checked = false;
			}
		})
		for (let i = 0; i < initialProductArray.length; i++) {
			productGrid.appendChild(initialProductArray[i].container);
		}
		colorArray = [];
		checkedColors = [];
		handleSortDropdownValue();
		clearFiltersButton.classList.add("is-hidden");
	}

	// Sort Products
	function handleSortDropdownValue() {
		if (sortDropdown.options[sortDropdown.selectedIndex].value === "lowToHigh") {
			sortLowToHigh();
		} else if (sortDropdown.options[sortDropdown.selectedIndex].value === "highToLow") {
			sortHighToLow();
		} else if (sortDropdown.options[sortDropdown.selectedIndex].value === "default") {
			sortDefault();
		}
	}

	function sortLowToHigh() {
		console.log(checkedColors);
		if (checkedColors.length > 0) {
			checkedColors = checkedColors.sort((a, b) => a.price - b.price);
			for (let i = 0; i < checkedColors.length; i++) {
				productGrid.appendChild(checkedColors[i].container);
			}
		} else {
			productArray = productArray.sort((a, b) => a.price - b.price);
			for (let i = 0; i < productArray.length; i++) {
				productGrid.appendChild(productArray[i].container);
			}
		}
	}

	function sortHighToLow() {
		if (checkedColors.length > 0) {
			checkedColors = checkedColors.sort((a, b) => b.price - a.price);
			for (let i = 0; i < checkedColors.length; i++) {
				productGrid.appendChild(checkedColors[i].container);
			}
		} else {
			productArray = productArray.sort((a, b) => b.price - a.price);
			for (let i = 0; i < productArray.length; i++) {
				productGrid.appendChild(productArray[i].container);
			}
		}
	}

	function sortDefault() {
		if (checkedColors.length > 0) {
			// checkedColors = checkedColors.sort((a, b) => a.price - b.price);
			for (let i = 0; i < checkedColors.length; i++) {
				productGrid.appendChild(checkedColors[i].container);
			}
		} else {
			// productArray = productArray.sort((a, b) => a.price - b.price);
			for (let i = 0; i < initialProductArray.length; i++) {
				productGrid.appendChild(initialProductArray[i].container);
			}
		}
	}
}

// Product Zoom In
if (currentURL.includes("product")) {

	const activeCollection = document.querySelector(".active-image");
	var activeNormal = document.querySelector(".active-image .image-normal");
	var activeZoomed = document.querySelector(".active-image .image-zoomed");
	const thumbs = document.querySelectorAll(".gallery label");
	for (let i = 0; i < thumbs.length; i++) {
		thumbs[i].addEventListener("click", () => {
			document.querySelector(".active-image").classList.remove("active-image");
			const activeThumb = this.getAttribute("for");
			const activeFull = document.getElementById(activeThumb).nextElementSibling;
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
	const targetArray = [event.target.parentNode.firstElementChild, event.target.parentNode.lastElementChild];
	const productImageNormal = targetArray[0];
	const productImageZoomed = targetArray[1];
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
let loveArray = [];

function loveUnloveProduct(productID) {
	const checkbox = document.querySelector("#love-button-" + productID);
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

	const allProductsArray = [];
	const productsOnPageArray = [];
	const productsOnPageList = Array.from(document.querySelectorAll(".grid-product-container"));
	const sortFilterProductsContainer = document.querySelector("#sort-filter-products-container");
	const checkLovedProdExists = JSON.parse(localStorage.getItem("lovedProd"));

	if (checkLovedProdExists) {
		if (checkLovedProdExists.length > 0) {
			const currentLoved = JSON.parse(localStorage.getItem("lovedProd"));
			if (currentURL.includes("/account/loved")) {

				for (i = 0; i < currentLoved.length; i++) {
					const gridProductLovedContainer = document.querySelectorAll("#" + currentLoved[i]);
					if (currentLoved.includes(gridProductLovedContainer[0].id)) {
						gridProductLovedContainer.forEach(el => el.classList.remove("is-hidden"));
					}
				}
				productsOnPageList.forEach(el => allProductsArray.push(el.id));
				const productsNotLoved = allProductsArray.filter(match => !currentLoved.includes(match));
				for (i = 0; i < currentLoved.length; i++) {
					document.querySelector("#love-button-" + currentLoved[i]).checked = true;
				}
				for (i = 0; i < productsNotLoved.length; i++) {
					const productsRemovedFromList = document.querySelectorAll("#" + productsNotLoved[i]);
					productsRemovedFromList.forEach(el => el.remove());
				}
			} else {
				productsOnPageList.forEach(el => productsOnPageArray.push(el.id));
				const productsWillBeLoved = productsOnPageArray.filter(match => currentLoved.includes(match));
				for (i = 0; i < productsWillBeLoved.length; i++) {
					document.querySelector("#love-button-" + productsWillBeLoved[i]).checked = true;
				}
			}
		} else {
			if (currentURL.includes("/account/loved")) {

				sortFilterProductsContainer.classList.add("is-hidden");

				const loveListSubtitle = document.querySelector("#my-love-list p");
				loveListSubtitle.innerText = "No items yet! Try adding some and check back here.";
				for (i = 0; i < productsOnPageList.length; i++) {
					productsOnPageList.forEach(el => el.remove());
				}
			}
		}
	} else {
		if (currentURL.includes("/account/loved")) {

			sortFilterProductsContainer.classList.add("is-hidden");

			const loveListSubtitle = document.querySelector("#my-love-list p");
			loveListSubtitle.innerText = "No items yet! Try adding some and check back here.";
		}
	}
}