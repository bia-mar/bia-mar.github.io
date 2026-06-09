// Pin each recipe by its BOTTOM edge so tall recipes scroll to read first, then
// pin once their end is reached (nothing is ever clipped). This just measures the
// recipe height and exposes it as --pin-top; the glide itself is pure CSS.
(function () {
  function setPinOffset() {
    var page = document.querySelector(".recipe-page");
    if (!page) return;
    // 0 for short recipes (pin by top); negative for tall ones (pin by bottom).
    var offset = Math.min(0, window.innerHeight - page.offsetHeight);
    document.documentElement.style.setProperty("--pin-top", offset + "px");
  }

  window.addEventListener("resize", setPinOffset);
  window.addEventListener("load", setPinOffset);
  setPinOffset();
})();




// LANDING PAGE
var leftBox = document.getElementById('images');
var rightBox = document.getElementById('recipes');

// prevent infinite loop
var isScrolling = false;

function handleScroll(scrolledElement, targetElement) {
  if (!isScrolling) {
    isScrolling = true;

    // how far the user scrolled (0 to 1)
    var scrollScrolled = scrolledElement.scrollHeight - scrolledElement.clientHeight;
    var scrollPercentage = scrolledElement.scrollTop / scrollScrolled;

    // scroll for the target element
    var scrollTarget = targetElement.scrollHeight - targetElement.clientHeight;

    // target's scroll to the INVERSE percentage
    targetElement.scrollTop = scrollTarget * (1 - scrollPercentage);

    // Reset the flag on the next animation frame --- requestAnimationFrame is a built-in browser function that tells the browser: "Hey, I want to change something on the screen. Please run this code right before you paint the next frame." 
    requestAnimationFrame(function() {
      isScrolling = false;
    });
  }
}

// Event listeners
leftBox.addEventListener('scroll', function() {
  handleScroll(leftBox, rightBox);
});

rightBox.addEventListener('scroll', function() {
  handleScroll(rightBox, leftBox);
});

document.addEventListener('DOMContentLoaded', function() {
  leftBox.scrollTop = leftBox.scrollHeight - leftBox.clientHeight;
});
