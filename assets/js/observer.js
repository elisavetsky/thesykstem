/* The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

ROOT:
It is not necessary for the root to be the ancestor element of the target. The root is always the document, and the so-called root element is used only to get its size and position, to create an area in the document, with options.rootMargin.
Leave it false to have the viewport as root.

TARGET:
IntersectionObserver triggers when the target is entering at the specified ratio(s), and when it exits at the same ratio(s).

For more on IntersectionObserverEntry object, see:
https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#targeting_an_element_to_be_observed

IntersectionObserverEntry.time               // Timestamp when the change occurred
IntersectionObserverEntry.rootBounds         // Unclipped area of root
IntersectionObserverEntry.intersectionRatio  // Ratio of intersectionRect area to boundingClientRect area
IntersectionObserverEntry.target             // the Element target
IntersectionObserverEntry.boundingClientRect // target.boundingClientRect()
IntersectionObserverEntry.intersectionRect   // boundingClientRect, clipped by its containing block ancestors, and intersected with rootBounds

THRESHOLD:
Intersection ratio/threshold can be an array, and then it will trigger on each value, when in and when out.
If root element's size, for example, is only 10% of the target element's size, then intersection ratio/threshold can't be set to more than 10% (that is 0.1).

CALLBACKS:
There can be created two functions; when the target is entering and when it's exiting. These functions can do what's required for each event (visible/invisible).
Each function is passed three arguments, the root (html) element, IntersectionObserverEntry object, and intersectionObserver options used for that observer.

Set only root and targets to only have some info in the browser's console.

For more info on IntersectionObserver see: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

Polyfill: <script src="https://polyfill.io/v3/polyfill.js?features=IntersectionObserver"></script>
or:
https://github.com/w3c/IntersectionObserver/tree/main/polyfill


Based on answer by Quentin D, answered Oct 27 '20 at 12:12
https://stackoverflow.com/questions/57834100/change-style-header-nav-with-intersection-observer-io

root     - (any selector) - root element, intersection parent (only the first element is selected).
targets  - (any selector) - observed elements that trigger function when visible/invisible.
inCb     - (function name) - custom callback function to trigger when the target is intersecting.
outCb    - (function name) - custom callback function to trigger when the target is not intersecting.
thres    - (number 0-1) - threshold to trigger the observer (e.g. 0.1 will trigger when 10% is visible).
unobserve- (boolean) - if true, the target is unobserved after triggering the callback.
*/

class Observer {
	constructor({
		root = false,
		targets = false,
		inCb = this.isIn,
		outCb = this.isOut,
		thres = 0,
		unobserve = false,
	} = {}) {
		// this element's position creates with rootMargin the area in the document
		// which is used as intersection observer's root area.
		// the real root is always the document.
		this.area = document.querySelector(root); // intersection area
		this.targets = document.querySelectorAll(targets); // intersection targets
		this.inCallback = inCb; // callback when intersecting
		this.outCallback = outCb; // callback when not intersecting
		this.unobserve = unobserve; // unobserve after intersection
		this.margins; // rootMargin for observer
		this.windowW = document.documentElement.clientWidth;
		this.windowH = document.documentElement.clientHeight;

		// intersection is being checked like:
		// if (entry.isIntersecting || entry.intersectionRatio >= this.ratio),
		// and if ratio is 0, "entry.intersectionRatio >= this.ratio" will be true,
		// even for non-intersecting elements, therefore:
		this.ratio = thres;
		if (Array.isArray(thres)) {
			for (var i = 0; i < thres.length; i++) {
				if (thres[i] == 0) {
					this.ratio[i] = 0.0001;
				}
			}
		} else {
			if (thres == 0) {
				this.ratio = 0.0001;
			}
		}

		// if root selected use its position to create margins, else no margins (viewport as root)
		if (this.area) {
			this.iArea = this.area.getBoundingClientRect(); // intersection area
			this.margins = `-${this.iArea.top}px -${(this.windowW - this.iArea.right)}px -${(this.windowH - this.iArea.bottom)}px -${this.iArea.left}px`;
		} else {
			this.margins = '0px';
		}

		// Keep this last (this.ratio has to be defined before).
		// targets are required to create an observer.
		if (this.targets) {
			window.addEventListener('resize', () => this.resetObserver());
			this.resetObserver();
		}
	}

	resetObserver() {
		if (this.observer) this.observer.disconnect();
		
		const options = {
			root: null, // null for the viewport
			rootMargin: this.margins,
			threshold: this.ratio,
		}

		this.observer = new IntersectionObserver(
			entries => this.observerCallback(entries, options),
			options,
		);
		
		this.targets.forEach((target) => this.observer.observe(target));
		
	};

	observerCallback(entries, options) {
		entries.forEach(entry => {
			// "entry.intersectionRatio >= this.ratio" for older browsers
			if (entry.isIntersecting || entry.intersectionRatio >= this.ratio) {
				// callback when visible
				this.inCallback(this.area, entry, options);

				// unobserve
				if (this.unobserve) {
					this.observer.unobserve(entry.target);
				}
			} else {
				// callback when hidden
				this.outCallback(this.area, entry, options);
				// No unobserve, because all invisible targets will be unobserved automatically
			}
		});
	};

	isIn(rootElmnt, targetElmt, options) {
		if (!rootElmnt) {
			console.log(`IO Root: VIEWPORT`);
		} else {
			console.log(`IO Root: ${rootElmnt.tagName} class="${rootElmnt.classList}"`);
		}
		console.log(`IO Target: ${targetElmt.target.tagName} class="${targetElmt.target.classList}" IS IN (${targetElmt.intersectionRatio * 100}%)`);
		console.log(`IO Threshold: ${options.threshold}`);
		//console.log(targetElmt.rootBounds);
		console.log(`============================================`);
	}
	isOut(rootElmnt, targetElmt, options) {
		if (!rootElmnt) {
			console.log(`IO Root: VIEWPORT`);
		} else {
			console.log(`IO Root: ${rootElmnt.tagName} class="${rootElmnt.classList}"`);
		}
		console.log(`IO Target: ${targetElmt.target.tagName} class="${targetElmt.target.classList}" IS OUT `);
		console.log(`============================================`);
	}
}