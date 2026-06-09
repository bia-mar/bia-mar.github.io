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
