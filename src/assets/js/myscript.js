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

// Scroll-driven image glide: the photos glide up over the pinned recipe.
// Pace: the strip is sized to match the photo track, so the glide tracks scrolling
// ~1:1 — a calm, consistent speed on every recipe. (Before, the fixed 220vh strip
// made the photos move ~6x faster than the scroll, and faster still the more
// photos a recipe had.) One update per frame via requestAnimationFrame; the
// transform is a compositor-friendly translate3d.
(function () {
  // Run wherever motion is allowed (mobile + desktop).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var strip = document.querySelector('.image-strip');
  var track = document.querySelector('.image-track');
  if (!strip || !track) return;

  var ticking = false;

  // Layout cached here, measured only on load/resize — never on the scroll path.
  var pinned = 0; // scroll distance over which the glide runs
  var travel = 0; // distance the track has to move
  var stripTop = 0; // the strip's position in the document (stable while scrolling)

  // Make the strip exactly as tall as the photo track (so the pinned scroll
  // distance equals the track's travel -> photos move at scroll speed), then read
  // the geometry once. These reads force layout, so we keep them out of update().
  function measure() {
    strip.style.height = track.scrollHeight + 'px';
    var vh = window.innerHeight;
    pinned = strip.offsetHeight - vh;
    travel = Math.max(0, track.scrollHeight - vh);
    stripTop = strip.getBoundingClientRect().top + window.scrollY;
  }

  // Per frame: only read window.scrollY (no layout reflow) and set the transform.
  // Equivalent to the old getBoundingClientRect math: rect.top === stripTop - scrollY.
  function update() {
    ticking = false;
    var progress = pinned > 0 ? (window.scrollY - stripTop) / pinned : 0;
    progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
    track.style.transform = 'translate3d(0,' + (-progress * travel) + 'px,0)';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  // Photo sizes are vw/vh-based, so the track height changes with the viewport —
  // re-measure on resize/load, then repaint.
  function refresh() {
    measure();
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  refresh();
})();









// JUST LANDING PAGE --!!PLEASE DON'T EDIT WITHOUT CHECKING!!--------------------------------------------------
function landingPageThings() {
  // scroll stuff ------------------------------------------
  var leftBox = document.getElementById('images');
  var rightBox = document.getElementById('recipes');

  // prevent infinite loop
  var isScrolling = false;

  function handleScroll(scrolledElement, targetElement) {
    if (!isScrolling) {
      isScrolling = true;

      // how far the user scrolled (0 to 1)
      var scrollSpace = scrolledElement.scrollHeight - scrolledElement.clientHeight;
      var scrollPercentage = scrolledElement.scrollTop / scrollSpace;

      // scroll for the target element
      var scrollTarget = targetElement.scrollHeight - targetElement.clientHeight;

      // target's scroll to the INVERSE percentage
      targetElement.scrollTop = scrollTarget * (1 - scrollPercentage);

      // Reset the flag on the next animation frame --- requestAnimationFrame is a built-in browser function that tells the browser: "Hey, I want to change something on the screen. Please run this code right before you paint the next frame."
      requestAnimationFrame(function() {
        isScrolling = false;
      });

      // console.log('scroll detected... weirdScrollProtocol activated by', scrollPercentage, 'bip boop');
    }
  }

  //inhibit downward scroll on left box, it will alway percieve itself as being scrolled upwards
  leftBox.addEventListener('wheel', function(event) {
    // if (event.deltaY > 0) {
    event.preventDefault();
    
    // If we are at the minimum scroll (0) and trying to scroll up, pass it to the body
    if (leftBox.scrollTop <= 0.4 && event.deltaY > 0) {
        window.scrollBy(0, event.deltaY);
    } else {
        leftBox.scrollTop -= event.deltaY;
    }
    // }

  }, { passive: false });
  // this passive false is for the browser to not interfere

  leftBox.addEventListener('scroll', function() {
    handleScroll(leftBox, rightBox);
  });

  rightBox.addEventListener('scroll', function() {
    handleScroll(rightBox, leftBox);
  });

  //paralell scrolls
  leftBox.scrollTop = leftBox.scrollHeight - leftBox.clientHeight;





  // avoiding a url and card url to conflict ------------------------------------------
  // Convert to a true array right away so .slice() works
  var recipeCards = Array.from(document.querySelectorAll('.recipe-card'));

  for (var i = 0; i < recipeCards.length; i++) {
    var card = recipeCards[i];
    card.style.cursor = 'pointer';

    card.addEventListener('click', function(event) {
      
      var otherLink = this.querySelector('h3 a');

      if (!event.target.closest('a')) {
        window.location.href = otherLink.href;
      }
    });
  }



  // animation for stacked cards ------------------------------------------
  const recipeImages = document.querySelectorAll('.recipe-thumb');

  // where a card is considered in focus
  const observerOptions = {
    root: null, 
    rootMargin: "-5% 0px -5% 0px", 
    threshold: 0 
  };

  function effectModifier(entries) {
    entries.forEach(function (entry) {
        // Find which number ID is linked to the current letter
        const targetId = entry.target.getAttribute('data-target');
        const targetCard = document.getElementById(targetId);

        if (entry.isIntersecting) {
            // Add .in-focus to the target number
            targetCard.classList.add('in-focus');
            
            // Calculate and apply .stacked to previous numbers
            updateStackedClasses(targetCard);
        } else {
            // Remove .in-focus when it leaves the center line
            targetCard.classList.remove('in-focus');
        }
    });
  }
  
  const observer = new IntersectionObserver(effectModifier, observerOptions);

  recipeImages.forEach(function (image) {
    observer.observe(image);
  });

  function updateStackedClasses(focusedCard) {
    // Find where the currently focused number sits in the array (index 0 to 5)
    const focusedIndex = recipeCards.indexOf(focusedCard);

    recipeCards.forEach(function (num, index) {
        if (index < focusedIndex) {
            // If the number's position is before the focused one, add .stacked
            num.classList.add('stacked');
            num.classList.add('hidden-title');
            console.log(num + "is in status A");
        } else if (index = focusedIndex) {
            num.classList.remove('stacked');
            num.classList.remove('hidden-title');
            console.log(num + "is in status B");
        } else {
          if (num.classList.contains('stacked')) {
            num.classList.add('hidden-title');
            console.log(num + "is in status C");
          }
        }
    });
  }

}



// ARE WE IN THE INDEX PAGE???
document.addEventListener('DOMContentLoaded', function() {
  var isLandingPage = document.getElementById('recipes'); //if there is a recipes in this page this will be ==True

  if (isLandingPage) { //if True
    landingPageThings();
  }
});