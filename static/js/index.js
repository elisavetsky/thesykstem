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

if (sortDropdown) {

	sortDropdown.addEventListener("change", handleSortDropdownValue);
	clearFiltersButton.addEventListener("click", clearFilters);

	// Create Product Object
	function createProductObjects() {
		const productContainers = Array.from(document.querySelectorAll(".grid-product-container"));
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
		const sortValue = sortDropdown.options[sortDropdown.selectedIndex].value;
		if (sortValue === "lowToHigh") {
			sortLowToHigh();
		} else if (sortValue === "highToLow") {
			sortHighToLow();
		} else if (sortValue === "default") {
			sortDefault();
		}
	}

	function sortLowToHigh() {
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
			for (let i = 0; i < checkedColors.length; i++) {
				productGrid.appendChild(checkedColors[i].container);
			}
		} else {
			for (let i = 0; i < initialProductArray.length; i++) {
				productGrid.appendChild(initialProductArray[i].container);
			}
		}
	}

}

// Product Zoom In
if (currentURL.indexOf("product") >= 0) {

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
let currentLoved = [];
const allProductsArray = [];
const productsOnPageArray = [];
let productsOnPageList = [];
let lovedProductsOnPageArray = []

function loveUnloveProduct(productID) {

	const checkbox = document.querySelector("#love-button-" + productID);
	if (checkbox.checked === true) {
		if (JSON.parse(localStorage.getItem("lovedProd")) != null) {
			loveArray = JSON.parse(localStorage.getItem("lovedProd"));
		}
		loveArray.push(productID);
	} else {
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

	productsOnPageList = Array.from(document.querySelectorAll(".grid-product-container"));

	const sortFilterProductsContainer = document.querySelector("#sort-filter-products-container");
	const checkLovedProdExists = JSON.parse(localStorage.getItem("lovedProd"));

	if (checkLovedProdExists) {
		if (checkLovedProdExists.length > 0) {
			currentLoved = JSON.parse(localStorage.getItem("lovedProd"));
			if (currentURL.indexOf("/account/loved") >= 0) {


				for (i = 0; i < currentLoved.length; i++) {
					const gridProductLovedContainer = document.querySelectorAll("#" + currentLoved[i]);
					if (currentLoved.indexOf(gridProductLovedContainer[0].id) >= 0) {
						gridProductLovedContainer.forEach(el => el.classList.remove("is-hidden"));
					}
				}
				productsOnPageList.forEach(el => allProductsArray.push(el.id));
				const productsNotLoved = allProductsArray.filter(match => currentLoved.indexOf(match) == -1);
				for (i = 0; i < currentLoved.length; i++) {
					document.querySelector("#love-button-" + currentLoved[i]).checked = true;
				}
				for (i = 0; i < productsNotLoved.length; i++) {
					const productsRemovedFromList = document.querySelectorAll("#" + productsNotLoved[i]);
					productsRemovedFromList.forEach(el => el.remove());
				}
			} else {
				productsOnPageList.forEach(el => productsOnPageArray.push(el.id));
				const productsWillBeLoved = productsOnPageArray.filter(match => currentLoved.indexOf(match) >= 0);
				for (i = 0; i < productsWillBeLoved.length; i++) {
					document.querySelector("#love-button-" + productsWillBeLoved[i]).checked = true;
				}
			}
		} else {
			if (currentURL.indexOf("/account/loved") >= 0) {

				sortFilterProductsContainer.classList.add("is-hidden");

				const loveListSubtitle = document.querySelector("#my-love-list p");
				loveListSubtitle.innerText = "No items yet! Try adding some and check back here.";
				for (i = 0; i < productsOnPageList.length; i++) {
					productsOnPageList.forEach(el => el.remove());
				}
			}
		}
	} else {
		if (currentURL.indexOf("/account/loved") >= 0) {

			sortFilterProductsContainer.classList.add("is-hidden");

			const loveListSubtitle = document.querySelector("#my-love-list p");
			loveListSubtitle.innerText = "No items yet! Try adding some and check back here.";
		}
	}

	// Find products & colors present on page
	createProductObjects();
	loadAvailableColorsInLoveList();
}

function loadAvailableColorsInLoveList() {
	if (currentURL.indexOf("/account/loved") >= 0) {
		const filterColors = Array.from(filterDropdownValues);
		const availFilterColors = filterColors.filter(el => !productArray.some(i => i.color === el.value));
		for (let i = 0; i < availFilterColors.length; i++) {
			availFilterColors[i].parentElement.parentElement.remove();
		}
	}
}