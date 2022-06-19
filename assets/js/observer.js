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
