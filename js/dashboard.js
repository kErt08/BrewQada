/**
 * Dashboard page — client-side enhancements.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    if (document.referrer && document.referrer.indexOf("index.html") !== -1) {
      document.body.classList.add("app-reveal");
    }
    var cards = document.querySelectorAll(".dash-card");
    cards.forEach(function (card, i) {
      card.style.animationDelay = 0.12 + i * 0.06 + "s";
    });
  });
})();
