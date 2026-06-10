// Pin each recipe by its BOTTOM edge so tall recipes scroll to read first, then
// pin once their end is reached (nothing is ever clipped). This just measures the
// recipe height and exposes it as --pin-top; the glide itself is JavaScript-driven.
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

// Cross-browser scroll-driven image glide (Firefox, Safari, Chrome).
// Smoothness: one update per frame via requestAnimationFrame (no layout thrash on
// every scroll event) and a compositor-friendly translate3d transform.
(function () {
  // Only run on desktop with motion allowed.
  if (window.innerWidth <= 1000) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var strip = document.querySelector('.image-strip');
  var track = document.querySelector('.image-track');
  if (!strip || !track) return;

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;

    // Progress across the time the strip's sticky stage is pinned (0 -> 1),
    // so the glide starts exactly when it pins (no dead scroll) and ends as it releases.
    var pinned = strip.offsetHeight - vh;
    var progress = pinned > 0 ? -strip.getBoundingClientRect().top / pinned : 0;
    progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;

    // Travel from the first photo at the top to the last photo at the bottom.
    var travel = track.scrollHeight - vh;
    if (travel < 0) travel = 0;

    track.style.transform = 'translate3d(0,' + (-progress * travel) + 'px,0)';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
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

// Event listeners (landing page only; these elements don't exist on recipe pages)
if (leftBox && rightBox) {
  leftBox.addEventListener('scroll', function() {
    handleScroll(leftBox, rightBox);
  });

  rightBox.addEventListener('scroll', function() {
    handleScroll(rightBox, leftBox);
  });

  document.addEventListener('DOMContentLoaded', function() {
    leftBox.scrollTop = leftBox.scrollHeight - leftBox.clientHeight;
  });
}
