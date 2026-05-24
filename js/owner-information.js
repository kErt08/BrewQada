/**
 * Owner Information page — timeline interaction.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".engage-card").forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        card.style.transform = "translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  });
})();
