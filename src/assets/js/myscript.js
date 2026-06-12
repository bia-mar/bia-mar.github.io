// JUST RECIPE PAGES --------------------------------------------------------------
function recipePageThings() { //only runs when something calls


  var recipe = document.querySelector('.recipe-page'); // Looks for an element with class "recipe-page"

  function setPinOffset() { //How far to nudge the pinned recipe. 
    if (!recipe) return; //if there's no recipe element on the page, give up (error prevention).
          
    var offset = Math.min(0, window.innerHeight - recipe.offsetHeight); //Screen height minus recipe height. (positive = recipe shorter; Negative = recipe taller)
    document.documentElement.style.setProperty('--pin-top', offset + 'px'); //short recipes pin from the top (offset 0); tall recipes get a negative offset so they pin from the bottom and nothing gets cut off.
  }

  window.addEventListener('resize', setPinOffset); //run setPinOffset if the window is resized or there is loading
  window.addEventListener('load', setPinOffset);

  setPinOffset(); //call it once right now


  // glide the photos ------------------------------------------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; //if the user has set a preference for reduced motion, skip this whole section. (accessibility)

  var strip = document.querySelector('.image-strip'); //the container that pins to the screen and holds the track
  var track = document.querySelector('.image-track'); //the container that holds the photos and moves up and down as you scroll. It is inside the strip, so it can be pinned to the screen while it moves.
  if (!strip || !track) return; //if there is no strip or track, give up (error prevention).

  var pinned = 0;    // how long the glide lasts, in scrolled pixels (starts at 0)
  var travel = 0;    // how far the photos have to travel
  var stripTop = 0;  // where the strip starts on the page

  function measure() { // Defines the function that takes those measurements.

    strip.style.height = track.scrollHeight + 'px'; //track.scrollHeight is the full height of the photo row. This line makes the strip exactly that tall. one pixel of scrolling = one pixel of photo movement (a calm, even speed).

    var screenHeight = window.innerHeight; //Store the screen height in a short-named box so the next lines read more easily.

    pinned = strip.offsetHeight - screenHeight; //How much scrolling the glide should last for = the strip's height minus one screen.
    travel = Math.max(0, track.scrollHeight - screenHeight); //How far the photos have to travel = the track's height minus one screen.
    stripTop = strip.getBoundingClientRect().top + window.scrollY; //Where the strip starts on the page = the distance from the top of the strip to the top of the screen, plus how far we've scrolled down. (getBoundingClientRect().top is how far the strip is from the top of the screen right now; add scrollY to get how far it is from the top of the whole page.)
  }

  function movePhotos() { //function that actually slides the photos.
  
    var progress = pinned > 0 ? (window.scrollY - stripTop) / pinned : 0;// How far through the glide are we, from 0 to 1? = how far we've scrolled past the start of the strip, divided by how long the glide should last. If pinned is 0 (the strip is shorter than the screen, so no pinning/glide is needed), progress is just 0.
    if (progress < 0) progress = 0; // If we haven't reached the strip yet, progress is 0.
    if (progress > 1) progress = 1; // If we've scrolled past the end of the glide, progress is 1.
  
    track.style.transform = 'translate3d(0,' + (-progress * travel) + 'px,0)'; // Move the photos up by a percentage of the total travel distance, based on how far through the glide we are. 
  }

  var waiting = false; // The "only do this once per frame" guard. A true/false box (a "flag"). false = "not currently waiting."
  function onScroll() { // The function that runs when the user scrolls, but only actually does something once per animation frame (see requestAnimationFrame below).
    if (!waiting) { 
      waiting = true; 
      requestAnimationFrame(function () { 
        waiting = false;
        movePhotos();
      });
    }
  }

  function refresh() { // A little combo: re-take the measurements, then redraw once. Used whenever the layout might have changed.
    measure();
    movePhotos();
  }

  window.addEventListener('scroll', onScroll, { passive: true }); // When the user scrolls, call onScroll. The passive: true option is a hint to the browser that this scroll handler won't call preventDefault().

  window.addEventListener('resize', refresh); // When the window is resized or loading call refresh to re-measure and redraw.
  window.addEventListener('load', refresh);

  refresh(); // Call it once right now to set everything up.
}









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



// WHICH PAGE ARE WE ON???
document.addEventListener('DOMContentLoaded', function() {
  var isLandingPage = document.getElementById('recipes'); //if there is a recipes in this page this will be ==True
  var isRecipePage = document.querySelector('.recipe-page'); //a single recipe page has the .recipe-page layout

  if (isLandingPage) { //if True
    landingPageThings();
  } else if (isRecipePage) { //otherwise, if it's one recipe page
    recipePageThings();
  }
});